import { useState, useEffect } from "react";
import { Heart, MessageCircle, Send } from "lucide-react";
import { useActorComments, useActorLikes } from "@/lib/actor-engagement";
import { getAnonName, setAnonName } from "@/lib/anon-id";
import { formatDistanceToNow } from "@/lib/format-time";

export function ActorEngagement({ actorId }: { actorId: string }) {
  const { count, liked, toggle } = useActorLikes(actorId);
  const { comments, post } = useActorComments(actorId);
  const [body, setBody] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setName(getAnonName());
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim() || submitting) return;
    setSubmitting(true);
    if (name.trim()) setAnonName(name);
    await post(body, name);
    setBody("");
    setSubmitting(false);
  };

  return (
    <section className="mx-auto mt-12 max-w-6xl px-4 md:px-6">
      <div className="rounded-3xl border bg-card p-6 md:p-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink text-sky">
              <MessageCircle className="h-4 w-4" />
            </span>
            <h2 className="font-display text-xl font-bold text-ink">
              Comments <span className="text-muted-foreground">· {comments.length}</span>
            </h2>
          </div>
          <button
            type="button"
            onClick={toggle}
            aria-pressed={liked}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
              liked
                ? "bg-red-50 text-red-600 ring-1 ring-red-200"
                : "bg-muted text-ink hover:bg-muted/70"
            }`}
          >
            <Heart className={`h-4 w-4 ${liked ? "fill-red-500 text-red-500" : ""}`} />
            <span className="tabular-nums">{count}</span>
            <span className="hidden sm:inline">{liked ? "Liked" : "Like"}</span>
          </button>
        </div>

        <form onSubmit={submit} className="mt-5 grid gap-3 sm:grid-cols-[160px_1fr_auto]">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name (optional)"
            maxLength={40}
            className="rounded-full border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky/40"
          />
          <input
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Share a thought — posted anonymously"
            maxLength={1000}
            className="rounded-full border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky/40"
          />
          <button
            type="submit"
            disabled={!body.trim() || submitting}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-40"
          >
            <Send className="h-4 w-4" /> Post
          </button>
        </form>

        <ul className="mt-6 space-y-3">
          {comments.length === 0 ? (
            <li className="rounded-2xl border border-dashed py-10 text-center text-sm text-muted-foreground">
              No comments yet — be the first to say something.
            </li>
          ) : (
            comments.map((c) => (
              <li key={c.id} className="rounded-2xl bg-muted/50 p-4">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-sm font-semibold text-ink">
                    {c.anon_name?.trim() || "Anonymous"}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(c.created_at)}
                  </span>
                </div>
                <p className="mt-1 whitespace-pre-wrap break-words text-sm text-foreground/90">
                  {c.body}
                </p>
              </li>
            ))
          )}
        </ul>
      </div>
    </section>
  );
}
