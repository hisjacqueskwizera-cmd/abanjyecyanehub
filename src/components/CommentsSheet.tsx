import { useEffect, useRef, useState } from "react";
import { Drawer } from "vaul";
import { Send, MessageCircle } from "lucide-react";
import { formatDistanceToNow } from "@/lib/format-time";
import {
  useActorComments,
  MIN_COMMENT_LENGTH,
  MAX_COMMENT_LENGTH,
  MAX_NAME_LENGTH,
} from "@/lib/actor-engagement";
import { getAnonName, setAnonName } from "@/lib/anon-id";

interface Props {
  actorId: string | null;
  actorName?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommentsSheet({ actorId, actorName, open, onOpenChange }: Props) {
  const { comments, post, loading } = useActorComments(open ? actorId : null);
  const [body, setBody] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setName(getAnonName());
      setError(null);
    }
  }, [open]);

  const trimmedLen = body.trim().length;
  const canSubmit =
    trimmedLen >= MIN_COMMENT_LENGTH && trimmedLen <= MAX_COMMENT_LENGTH && !submitting;

  const submit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    if (name.trim()) setAnonName(name);
    const res = await post(body, name);
    if (res?.error) {
      setError(res.error.message);
    } else {
      setBody("");
    }
    setSubmitting(false);
    inputRef.current?.focus();
  };

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange} shouldScaleBackground>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm" />
        <Drawer.Content className="fixed inset-x-0 bottom-0 z-[71] flex h-[50dvh] flex-col rounded-t-[28px] bg-background shadow-[var(--shadow-elevate)] outline-none">
          <div className="flex h-7 shrink-0 items-center justify-center" aria-hidden>
            <span className="mt-2 h-1.5 w-12 rounded-full bg-border" />
          </div>
          <Drawer.Title className="px-5 pb-2 pt-1 text-sm font-semibold text-ink">
            <span className="inline-flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-sky" />
              Comments {actorName ? `· ${actorName}` : ""}
            </span>
          </Drawer.Title>
          <Drawer.Description className="sr-only">Anonymous comments</Drawer.Description>

          <div className="flex-1 overflow-y-auto px-5 pb-3">
            {loading && comments.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">Loading…</p>
            ) : comments.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Be the first to leave a comment.
              </p>
            ) : (
              <ul className="space-y-3 py-2">
                {comments.map((c) => (
                  <li key={c.id} className="rounded-2xl bg-muted/60 p-3">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="text-xs font-semibold text-ink">
                        {c.anon_name?.trim() || "Anonymous"}
                      </p>
                      <span className="text-[10px] text-muted-foreground">
                        {formatDistanceToNow(c.created_at)}
                      </span>
                    </div>
                    <p className="mt-1 whitespace-pre-wrap break-words text-sm text-foreground/90">
                      {c.body}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void submit();
            }}
            className="border-t bg-background/95 px-3 pb-[calc(env(safe-area-inset-bottom)+10px)] pt-2 backdrop-blur"
          >
            <div className="mb-2 flex gap-2">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name (optional)"
                maxLength={40}
                className="w-32 rounded-full border bg-background px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-sky/40"
              />
              <span className="self-center text-[10px] text-muted-foreground">Anonymous</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Add a comment…"
                maxLength={1000}
                className="flex-1 rounded-full border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sky/40"
              />
              <button
                type="submit"
                disabled={!body.trim() || submitting}
                aria-label="Post comment"
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink text-sky disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
