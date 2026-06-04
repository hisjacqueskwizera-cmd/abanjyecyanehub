import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getAnonId } from "@/lib/anon-id";

export type ActorComment = {
  id: string;
  actor_id: string;
  anon_id: string;
  anon_name: string | null;
  body: string;
  created_at: string;
};

export function useActorLikes(actorId: string | null | undefined) {
  const [count, setCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!actorId) return;
    const anonId = getAnonId();
    const [{ count: c }, { data: mine }] = await Promise.all([
      supabase
        .from("actor_likes")
        .select("id", { count: "exact", head: true })
        .eq("actor_id", actorId),
      supabase
        .from("actor_likes")
        .select("id")
        .eq("actor_id", actorId)
        .eq("anon_id", anonId)
        .maybeSingle(),
    ]);
    setCount(c ?? 0);
    setLiked(!!mine);
  }, [actorId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const toggle = useCallback(async () => {
    if (!actorId || loading) return;
    setLoading(true);
    const anonId = getAnonId();
    // optimistic
    const next = !liked;
    setLiked(next);
    setCount((n) => n + (next ? 1 : -1));
    try {
      if (next) {
        await supabase.from("actor_likes").insert({ actor_id: actorId, anon_id: anonId });
      } else {
        await supabase
          .from("actor_likes")
          .delete()
          .eq("actor_id", actorId)
          .eq("anon_id", anonId);
      }
    } catch {
      // rollback
      setLiked(!next);
      setCount((n) => n + (next ? -1 : 1));
    } finally {
      setLoading(false);
    }
  }, [actorId, liked, loading]);

  return { count, liked, toggle, refresh };
}

export function useActorComments(actorId: string | null | undefined) {
  const [comments, setComments] = useState<ActorComment[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!actorId) return;
    setLoading(true);
    const { data } = await supabase
      .from("actor_comments")
      .select("*")
      .eq("actor_id", actorId)
      .order("created_at", { ascending: false })
      .limit(200);
    setComments((data as ActorComment[]) ?? []);
    setLoading(false);
  }, [actorId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const post = useCallback(
    async (body: string, name?: string) => {
      if (!actorId) return { data: null, error: new Error("Missing actor") };
      const trimmed = body.trim();
      if (trimmed.length < MIN_COMMENT_LENGTH) {
        return {
          data: null,
          error: new Error(`Comment must be at least ${MIN_COMMENT_LENGTH} characters`),
        };
      }
      if (trimmed.length > MAX_COMMENT_LENGTH) {
        return {
          data: null,
          error: new Error(`Comment must be ${MAX_COMMENT_LENGTH} characters or fewer`),
        };
      }
      const cleanName = name?.trim().slice(0, MAX_NAME_LENGTH) || null;
      const anonId = getAnonId();
      // optimistic insert
      const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const optimistic: ActorComment = {
        id: tempId,
        actor_id: actorId,
        anon_id: anonId,
        anon_name: cleanName,
        body: trimmed,
        created_at: new Date().toISOString(),
      };
      setComments((prev) => [optimistic, ...prev]);
      const { data, error } = await supabase
        .from("actor_comments")
        .insert({
          actor_id: actorId,
          anon_id: anonId,
          anon_name: cleanName,
          body: trimmed,
        })
        .select("*")
        .single();
      if (error || !data) {
        // rollback
        setComments((prev) => prev.filter((c) => c.id !== tempId));
        return { data: null, error: error ?? new Error("Failed to post comment") };
      }
      // replace optimistic with real
      setComments((prev) => [data as ActorComment, ...prev.filter((c) => c.id !== tempId)]);
      return { data, error: null };
    },
    [actorId],
  );

  return { comments, loading, post, refresh };
}

export const MIN_COMMENT_LENGTH = 2;
export const MAX_COMMENT_LENGTH = 1000;
export const MAX_NAME_LENGTH = 40;

export async function fetchLikeCount(actorId: string): Promise<number> {
  const { count } = await supabase
    .from("actor_likes")
    .select("id", { count: "exact", head: true })
    .eq("actor_id", actorId);
  return count ?? 0;
}

export async function fetchCommentCount(actorId: string): Promise<number> {
  const { count } = await supabase
    .from("actor_comments")
    .select("id", { count: "exact", head: true })
    .eq("actor_id", actorId);
  return count ?? 0;
}
