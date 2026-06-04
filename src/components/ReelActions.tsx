import { Heart, MessageCircle, Share2 } from "lucide-react";
import { useActorLikes } from "@/lib/actor-engagement";

interface Props {
  actorId: string;
  actorName: string;
  tagline?: string | null;
  onComment: () => void;
  commentCount?: number;
}

export function ReelActions({ actorId, actorName, tagline, onComment, commentCount }: Props) {
  const { count, liked, toggle } = useActorLikes(actorId);

  const share = async () => {
    const url = `${window.location.origin}/actors/${actorId}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: `${actorName} | CyaneHub`, text: tagline ?? "", url });
        return;
      }
      await navigator.clipboard.writeText(url);
    } catch {
      /* aborted */
    }
  };

  return (
    <div className="pointer-events-auto absolute bottom-32 right-3 z-20 flex flex-col items-center gap-5 text-white">
      <button
        type="button"
        onClick={toggle}
        aria-label={liked ? "Unlike" : "Like"}
        className="flex flex-col items-center gap-1"
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-black/45 ring-1 ring-white/20 backdrop-blur active:scale-90 transition">
          <Heart
            className={`h-6 w-6 transition ${liked ? "fill-red-500 text-red-500" : "text-white"}`}
          />
        </span>
        <span className="text-[11px] font-semibold tabular-nums drop-shadow">{count}</span>
      </button>

      <button
        type="button"
        onClick={onComment}
        aria-label="Comments"
        className="flex flex-col items-center gap-1"
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-black/45 ring-1 ring-white/20 backdrop-blur active:scale-90 transition">
          <MessageCircle className="h-6 w-6" />
        </span>
        <span className="text-[11px] font-semibold tabular-nums drop-shadow">
          {commentCount ?? ""}
        </span>
      </button>

      <button
        type="button"
        onClick={share}
        aria-label="Share profile"
        className="flex flex-col items-center gap-1"
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-black/45 ring-1 ring-white/20 backdrop-blur active:scale-90 transition">
          <Share2 className="h-6 w-6" />
        </span>
        <span className="text-[11px] font-semibold drop-shadow">Share</span>
      </button>
    </div>
  );
}
