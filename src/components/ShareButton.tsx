import { useState } from "react";
import { Share2, Check } from "lucide-react";
import { toast } from "sonner";

interface Props {
  title: string;
  text?: string;
  path: string;
  className?: string;
  label?: string;
}

export function ShareButton({ title, text, path, className, label = "Share" }: Props) {
  const [copied, setCopied] = useState(false);

  const onShare = async () => {
    const url = typeof window !== "undefined" ? `${window.location.origin}${path}` : path;
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title, text, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      toast.error("Couldn't share. Try copying the URL.");
    }
  };

  return (
    <button
      onClick={onShare}
      aria-label={`Share ${title}`}
      className={
        className ??
        "inline-flex items-center gap-2 rounded-full bg-sky px-4 py-2 text-sm font-semibold text-ink hover:bg-sky/90"
      }
    >
      {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
      {copied ? "Copied" : label}
    </button>
  );
}
