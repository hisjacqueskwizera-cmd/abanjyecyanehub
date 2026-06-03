import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { Logo } from "./Logo";

export function MobileTopBar({ variant = "light" }: { variant?: "light" | "dark" }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      const t = setTimeout(() => inputRef.current?.focus(), 120);
      return () => {
        clearTimeout(t);
        document.body.style.overflow = "";
      };
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const term = q.trim();
    if (!term) return;
    navigate({ to: "/search", search: { q: term } });
    setOpen(false);
    setQ("");
  };

  const isDark = variant === "dark";
  const trending = ["Drama", "Comedy", "Kinyarwanda", "Action"];

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-40 flex items-center justify-between px-4 pt-4 md:hidden">
        <div
          className={`pointer-events-auto rounded-full px-3 py-2 backdrop-blur ${
            isDark ? "bg-white/10 text-white" : "glass"
          }`}
        >
          <Logo className={isDark ? "text-white" : ""} />
        </div>

        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open search"
          className={`pointer-events-auto inline-flex h-11 w-11 items-center justify-center rounded-full backdrop-blur-xl transition active:scale-95 ${
            isDark
              ? "bg-white/15 text-white ring-1 ring-white/20"
              : "bg-white/70 text-ink ring-1 ring-ink/10"
          }`}
        >
          <Search className="h-4 w-4" />
        </button>
      </header>

      {/* Search overlay */}
      <div
        className={`fixed inset-0 z-[70] md:hidden transition-opacity duration-200 ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!open}
      >
        <button
          aria-label="Close search"
          onClick={() => setOpen(false)}
          className="absolute inset-0 bg-black/55 backdrop-blur-md"
        />
        <div
          className={`absolute inset-x-0 top-0 origin-top bg-background shadow-[var(--shadow-elevate)] transition-transform duration-300 ${
            open ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          <div className="px-4 pb-5 pt-[calc(env(safe-area-inset-top)+12px)]">
            <form onSubmit={submit} className="flex items-center gap-2">
              <div className="flex h-12 flex-1 items-center gap-2 rounded-2xl border bg-muted/50 px-3">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input
                  ref={inputRef}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search by name, genre, language..."
                  className="h-full flex-1 bg-transparent text-[15px] text-ink outline-none placeholder:text-muted-foreground"
                />
                {q && (
                  <button
                    type="button"
                    onClick={() => setQ("")}
                    aria-label="Clear"
                    className="rounded-full p-1 text-muted-foreground hover:bg-muted"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-1 text-sm font-medium text-sky"
              >
                Cancel
              </button>
            </form>

            <div className="mt-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                Trending
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {trending.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      setQ(t);
                      navigate({ to: "/search", search: { q: t } });
                      setOpen(false);
                    }}
                    className="rounded-full border bg-card px-3 py-1.5 text-xs font-medium text-ink hover:bg-muted"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
