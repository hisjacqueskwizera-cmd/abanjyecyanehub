import { Link } from "@tanstack/react-router";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`flex items-center gap-2 ${className}`}>
      <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-lg bg-ink text-white">
        <span className="absolute inset-1 rounded-md bg-sky" />
        <span className="relative font-display text-sm font-bold text-ink">C</span>
      </span>
      <span className="font-display text-base font-bold tracking-tight text-ink">
        Cyane<span className="text-sky">Hub</span>
      </span>
    </Link>
  );
}
