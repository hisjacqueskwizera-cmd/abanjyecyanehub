import { Link } from "@tanstack/react-router";
import { Eye } from "lucide-react";
import type { Actor } from "@/data/actors";
import { initials, portraitGradient } from "@/data/actors";

export function ActorCard({ actor }: { actor: Actor }) {
  return (
    <Link
      to="/actors/$id"
      params={{ id: actor.id }}
      className="group block overflow-hidden rounded-2xl border bg-card transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-elevate)]"
    >
      <div
        className="relative aspect-[3/4] w-full overflow-hidden"
        style={{ background: portraitGradient(actor.fullName) }}
      >
        {actor.profilePhoto ? (
          <img
            src={actor.profilePhoto}
            alt={actor.fullName}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <>
            <div className="absolute inset-0 imigongo-bg opacity-30 mix-blend-overlay" />
            <span className="absolute inset-0 flex items-center justify-center font-display text-6xl font-bold text-white/90 drop-shadow">
              {initials(actor.fullName)}
            </span>
          </>
        )}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-4">
          <div className="flex flex-wrap gap-1.5">
            {actor.genres.slice(0, 3).map((g) => (
              <span
                key={g}
                className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white backdrop-blur"
              >
                {g}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg font-semibold leading-tight text-ink">
            {actor.fullName}
          </h3>
          <span
            aria-label="View details"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-soft text-sky transition-colors group-hover:bg-ink group-hover:text-sky"
          >
            <Eye className="h-4 w-4" />
          </span>
        </div>
        <p className="mt-0.5 text-xs uppercase tracking-wider text-muted-foreground">
          {actor.nationality}
        </p>
        {actor.tagline && (
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{actor.tagline}</p>
        )}
      </div>
    </Link>
  );
}
