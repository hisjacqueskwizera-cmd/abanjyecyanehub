import { Link } from "@tanstack/react-router";
import type { Actor } from "@/data/actors";
import { initials, portraitGradient } from "@/data/actors";

type Variant = "default" | "compact";

export function ActorCard({ actor, variant = "default" }: { actor: Actor; variant?: Variant }) {
  const compact = variant === "compact";
  return (
    <Link
      to="/actors/$id"
      params={{ id: actor.id }}
      className="group relative block overflow-hidden rounded-[28px] border border-black/5 bg-card shadow-[0_10px_30px_-15px_rgba(0,0,0,0.25)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_25px_60px_-20px_rgba(0,0,0,0.35)]"
    >
      <div
        className={`relative w-full overflow-hidden ${compact ? "aspect-[3/4]" : "aspect-[3/4.4]"}`}
        style={{ background: portraitGradient(actor.fullName) }}
      >
        {actor.profilePhoto ? (
          <img
            src={actor.profilePhoto}
            alt={actor.fullName}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
          />
        ) : (
          <>
            <div className="absolute inset-0 imigongo-bg opacity-30 mix-blend-overlay" />
            <span className="absolute inset-0 flex items-center justify-center font-display text-6xl font-bold text-white/90 drop-shadow">
              {initials(actor.fullName)}
            </span>
          </>
        )}

        {/* Bottom darkening for legibility */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[72%] bg-gradient-to-t from-black/85 via-black/55 to-transparent" />

        {/* Content overlay */}
        <div className={`absolute inset-x-0 bottom-0 flex flex-col ${compact ? "gap-1.5 p-3" : "gap-2.5 p-4 md:p-5"}`}>
          <h3
            className={`font-display font-bold leading-tight text-white drop-shadow-sm ${
              compact ? "text-sm" : "text-xl md:text-2xl"
            }`}
          >
            {actor.fullName}
          </h3>

          {!compact && actor.tagline && (
            <p className="line-clamp-2 text-[13px] leading-snug text-white/85">
              {actor.tagline}
            </p>
          )}

          <div className={`flex flex-wrap items-center gap-1.5 ${compact ? "" : "mt-0.5"}`}>
            {(actor.genres ?? []).slice(0, compact ? 1 : 2).map((g) => (
              <span
                key={g}
                className={`inline-flex items-center gap-1 rounded-full bg-white/15 font-medium text-white backdrop-blur-md ring-1 ring-white/20 ${
                  compact ? "px-1.5 py-0.5 text-[9px]" : "px-2.5 py-1 text-[11px]"
                }`}
              >
                <span className="h-1 w-1 rounded-full bg-sky" /> {g}
              </span>
            ))}
            {!compact && actor.nationality && (
              <span className="inline-flex items-center rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-md ring-1 ring-white/20">
                {actor.nationality}
              </span>
            )}
          </div>

          {!compact && (
            <div className="mt-3 flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-ink shadow-lg transition-transform group-hover:scale-[1.02]">
              View profile
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
