import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronUp, Instagram, Linkedin, X } from "lucide-react";
import { actors, initials, portraitGradient, type Actor } from "@/data/actors";

export function MobileReels() {
  const [openId, setOpenId] = useState<string | null>(null);
  const open = actors.find((a) => a.id === openId) ?? null;

  return (
    <div className="relative h-[100dvh] w-full overflow-y-scroll snap-y-mandatory no-scrollbar md:hidden">
      {actors.map((a) => (
        <Reel key={a.id} actor={a} onOpen={() => setOpenId(a.id)} />
      ))}
      <BottomSheet actor={open} onClose={() => setOpenId(null)} />
    </div>
  );
}

function Reel({ actor, onOpen }: { actor: Actor; onOpen: () => void }) {
  return (
    <section
      className="relative flex h-[100dvh] w-full snap-start items-end overflow-hidden"
      style={{ background: portraitGradient(actor.fullName) }}
    >
      <div className="absolute inset-0 imigongo-bg opacity-20 mix-blend-overlay" />
      <span className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-[14rem] font-black leading-none text-white/15">
        {initials(actor.fullName)}
      </span>
      <div className="absolute inset-x-0 bottom-0 top-1/3 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

      <div className="relative z-10 w-full p-6 pb-32 text-white">
        <p className="text-xs uppercase tracking-[0.3em] text-sky">CyaneHub Talent</p>
        <h2 className="mt-2 font-display text-3xl font-bold leading-tight">{actor.fullName}</h2>
        {actor.tagline && <p className="mt-2 line-clamp-3 text-sm text-white/85">{actor.tagline}</p>}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {actor.genres.slice(0, 4).map((g) => (
            <span key={g} className="rounded-full bg-white/15 px-2.5 py-1 text-[11px] backdrop-blur">
              {g}
            </span>
          ))}
        </div>
        <div className="mt-3 text-[11px] uppercase tracking-wider text-white/60">
          {actor.languages.join(" · ")}
        </div>
        <button
          onClick={onOpen}
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-sky px-5 py-3 text-sm font-semibold text-ink shadow-lg"
        >
          <ChevronUp className="h-4 w-4" /> View Details
        </button>
      </div>

      <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[10px] uppercase tracking-[0.3em] text-white/50 [writing-mode:vertical-rl]">
        Swipe up
      </div>
    </section>
  );
}

function BottomSheet({ actor, onClose }: { actor: Actor | null; onClose: () => void }) {
  if (!actor) return null;
  return (
    <div className="fixed inset-0 z-[60]">
      <button
        aria-label="Close"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-float-in"
        onClick={onClose}
      />
      <div className="absolute inset-x-0 bottom-0 max-h-[90dvh] overflow-y-auto rounded-t-3xl bg-background shadow-[var(--shadow-elevate)] animate-float-in">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-background/90 px-5 py-3 backdrop-blur">
          <div className="mx-auto h-1.5 w-12 rounded-full bg-border" />
          <button
            aria-label="Close"
            onClick={onClose}
            className="absolute right-3 top-3 rounded-full p-2 text-muted-foreground hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <ProfileBody actor={actor} compact />
        <div className="sticky bottom-0 border-t bg-background/95 p-4 backdrop-blur">
          <Link
            to="/actors/$id"
            params={{ id: actor.id }}
            className="block w-full rounded-full bg-ink py-3 text-center text-sm font-semibold text-white"
          >
            Open full profile
          </Link>
        </div>
      </div>
    </div>
  );
}

export function ProfileBody({ actor, compact = false }: { actor: Actor; compact?: boolean }) {
  const year = actor.dob ? new Date(actor.dob).getFullYear() : null;
  return (
    <div className={compact ? "p-5" : "py-8"}>
      <div className="flex items-start gap-4">
        <div
          className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl"
          style={{ background: portraitGradient(actor.fullName) }}
        >
          <span className="flex h-full w-full items-center justify-center font-display text-2xl font-bold text-white/90">
            {initials(actor.fullName)}
          </span>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-sky">{actor.nationality}</p>
          <h3 className="mt-1 font-display text-xl font-bold leading-tight">{actor.fullName}</h3>
          {actor.tagline && <p className="mt-1 text-sm text-muted-foreground">{actor.tagline}</p>}
        </div>
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
        {year && <Meta label="Born">{year}</Meta>}
        <Meta label="Languages">{actor.languages.join(", ")}</Meta>
      </dl>

      <Section title="Biography">{actor.bio || "—"}</Section>
      <Section title="Genres">
        <div className="flex flex-wrap gap-1.5">
          {actor.genres.map((g) => (
            <span key={g} className="rounded-full bg-sky-soft px-3 py-1 text-xs font-medium text-ink">
              {g}
            </span>
          ))}
        </div>
      </Section>
      {actor.filmography && (
        <Section title="Filmography">
          <pre className="whitespace-pre-wrap font-sans text-sm text-muted-foreground">{actor.filmography}</pre>
        </Section>
      )}
      {actor.journey && (
        <Section title="Urugendo — Journey">
          <p className="whitespace-pre-wrap text-sm text-muted-foreground">{actor.journey}</p>
        </Section>
      )}
      <div className="mt-6 flex gap-3">
        {actor.instagram && (
          <a
            href={actor.instagram.startsWith("http") ? actor.instagram : `https://instagram.com/${actor.instagram.replace(/[@\s]/g, "")}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            <Instagram className="h-4 w-4" /> Instagram
          </a>
        )}
        {actor.linkedin && actor.linkedin.startsWith("http") && (
          <a
            href={actor.linkedin}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            <Linkedin className="h-4 w-4" /> LinkedIn
          </a>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-6">
      <h4 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-sky">{title}</h4>
      <div className="mt-2 text-foreground">{children}</div>
    </div>
  );
}

function Meta({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border bg-muted/40 p-3">
      <dt className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm font-medium text-foreground">{children}</dd>
    </div>
  );
}
