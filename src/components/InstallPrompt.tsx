import { useEffect, useState } from "react";
import { X, Download, Share } from "lucide-react";
import logoAsset from "@/assets/cyane-logo.png.asset.json";

type BIPEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISS_KEY = "cyanehub_install_dismissed_at";
const DISMISS_TTL = 1000 * 60 * 60 * 24; // 24h

function isStandalone() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia?.("(display-mode: standalone)").matches ||
    // iOS
    (window.navigator as any).standalone === true
  );
}

function isInIframe() {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
}

export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BIPEvent | null>(null);
  const [open, setOpen] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isStandalone() || isInIframe()) return;

    const dismissed = Number(localStorage.getItem(DISMISS_KEY) ?? 0);
    if (dismissed && Date.now() - dismissed < DISMISS_TTL) return;

    const ua = window.navigator.userAgent;
    const ios = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
    setIsIOS(ios);

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BIPEvent);
      setOpen(true);
    };
    window.addEventListener("beforeinstallprompt", handler);

    // iOS has no beforeinstallprompt — show instructions overlay
    if (ios) setOpen(true);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setOpen(false);
  };

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    const choice = await deferred.userChoice;
    if (choice.outcome !== "dismissed") {
      setOpen(false);
    } else {
      dismiss();
    }
    setDeferred(null);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[100] px-3 pb-[max(env(safe-area-inset-bottom),12px)] md:px-6 md:pb-6 animate-in slide-in-from-bottom duration-300">
      <div className="mx-auto flex max-w-md items-center gap-3 rounded-2xl border border-border bg-background/95 p-3 shadow-2xl backdrop-blur md:max-w-lg">
        <img
          src={logoAsset.url}
          alt="CyaneHub"
          className="h-12 w-12 shrink-0 rounded-xl bg-white object-contain p-1 ring-1 ring-border"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">Install CyaneHub</p>
          {isIOS ? (
            <p className="text-xs text-muted-foreground">
              Tap <Share className="inline h-3 w-3 align-[-2px]" /> then "Add to Home Screen"
            </p>
          ) : (
            <p className="truncate text-xs text-muted-foreground">
              Add the app to your home screen for instant access.
            </p>
          )}
        </div>
        {!isIOS && deferred && (
          <button
            onClick={install}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-foreground px-3.5 py-2 text-xs font-semibold text-background transition hover:opacity-90"
          >
            <Download className="h-3.5 w-3.5" /> Install
          </button>
        )}
        <button
          onClick={dismiss}
          aria-label="Dismiss"
          className="shrink-0 rounded-full p-1.5 text-muted-foreground hover:bg-muted"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
