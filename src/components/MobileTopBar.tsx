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
      const t = setTimeout(() => inputRef.current?.focus(), 120);
      return () => clearTimeout(t);
    }
  }, [open]);

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const term = q.trim();
    if (!term) return;
    navigate({ to: "/search", search: { q: term } });
    setOpen(false);
  };

  const isDark = variant === "dark";

  return (
    <header
      className={`pointer-events-none fixed inset-x-0 top-0 z-50 flex items-center justify-between px-4 pt-4 md:hidden`}
    >
      <div
        className={`pointer-events-auto rounded-full px-3 py-2 backdrop-blur transition-opacity ${
          open ? "opacity-0" : "opacity-100"
        } ${isDark ? "bg-white/10 text-white" : "glass"}`}
      >
        <Logo className={isDark ? "text-white" : ""} />
      </div>

      <div
        className={`pointer-events-auto relative ml-auto flex items-center transition-all duration-300 ease-out ${
          open ? "w-[calc(100%-1rem)]" : "w-11"
        }`}
      >
        <form
          onSubmit={submit}
          className={`relative flex h-11 w-full items-center overflow-hidden rounded-full backdrop-blur-xl transition-all duration-300 ${
            open
              ? isDark
                ? "bg-white/15 ring-1 ring-white/30"
                : "bg-white/70 ring-1 ring-ink/10"
              : isDark
                ? "bg-white/10"
                : "bg-white/60"
          }`}
        >
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search actors, genre, language..."
            className={`h-full flex-1 bg-transparent pl-5 pr-12 text-sm outline-none transition-opacity duration-200 ${
              open ? "opacity-100" : "pointer-events-none opacity-0"
            } ${isDark ? "text-white placeholder:text-white/60" : "text-ink placeholder:text-muted-foreground"}`}
          />
          <button
            type="button"
            onClick={() => {
              if (open && q.trim()) {
                submit();
              } else if (open) {
                setOpen(false);
                setQ("");
              } else {
                setOpen(true);
              }
            }}
            aria-label={open ? "Close search" : "Open search"}
            className={`absolute right-1 top-1 flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
              isDark ? "bg-white/15 text-white" : "bg-ink text-white"
            }`}
          >
            {open && !q.trim() ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
          </button>
        </form>
      </div>
    </header>
  );
}
