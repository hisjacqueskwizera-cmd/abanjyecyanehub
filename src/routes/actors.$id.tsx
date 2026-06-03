import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import {
  ArrowLeft,
  Award,
  Calendar,
  ExternalLink,
  Film,
  Globe2,
  Instagram,
  Languages,
  Linkedin,
  MapPin,
  PlayCircle,
  Sparkles,
  Star,
} from "lucide-react";
import { FloatingNav } from "@/components/FloatingNav";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { MobileTopBar } from "@/components/MobileTopBar";
import { Footer } from "@/components/Footer";
import { ShareButton } from "@/components/ShareButton";
import { initials, portraitGradient, type Actor } from "@/data/actors";
import { actorQueryOptions, actorsQueryOptions } from "@/lib/actors-query";

export const Route = createFileRoute("/actors/$id")({
  loader: async ({ params, context }) => {
    const actor = await context.queryClient.ensureQueryData(actorQueryOptions(params.id));
    if (!actor) throw notFound();
    await context.queryClient.ensureQueryData(actorsQueryOptions);
    return { actor };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.actor.fullName} | CyaneHub` },
          {
            name: "description",
            content: loaderData.actor.tagline || loaderData.actor.bio || "Actor on CyaneHub.",
          },
          { property: "og:title", content: `${loaderData.actor.fullName} | CyaneHub` },
          { property: "og:description", content: loaderData.actor.tagline || loaderData.actor.bio || "" },
          { property: "og:type", content: "profile" },
          { property: "og:url", content: `/actors/${loaderData.actor.id}` },
        ]
      : [],
    links: loaderData ? [{ rel: "canonical", href: `/actors/${loaderData.actor.id}` }] : [],
  }),
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="text-center">
        <h1 className="font-display text-3xl font-bold">Actor not found</h1>
        <Link to="/actors" className="mt-4 inline-block text-sky hover:underline">
          Back to actors
        </Link>
      </div>
    </div>
  ),
  errorComponent: ({ reset }) => (
    <div className="flex min-h-screen items-center justify-center px-4">
      <button onClick={reset} className="rounded-full bg-ink px-4 py-2 text-white">
        Try again
      </button>
    </div>
  ),
  component: ActorProfile,
});

function ActorProfile() {
  const { id } = Route.useParams();
  const router = useRouter();
  const { data: actor } = useSuspenseQuery(actorQueryOptions(id));
  const { data: allActors } = useSuspenseQuery(actorsQueryOptions);
  if (!actor) return null;
  const related = allActors.filter((a) => a.id !== actor.id).slice(0, 4);
  const year = actor.dob ? new Date(actor.dob).getFullYear() : null;
  const films = parseFilmography(actor.filmography);
  const journey = parseJourney(actor.journey);

  const reels = films.filter((f) => f.url && toYouTubeEmbed(f.url));
  const externalLinks = films.filter((f) => f.url && !toYouTubeEmbed(f.url));

  const goBack = () => {
    // Prefer browser history so we return to /actors OR /search depending on where the user came from.
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.history.back();
    } else {
      router.navigate({ to: "/actors" });
    }
  };

  return (
    <>
      <FloatingNav />
      <MobileTopBar variant="dark" />
      {/* Mobile sticky back bar */}
      <div className="fixed left-3 top-3 z-40 md:hidden">
        <button
          type="button"
          onClick={goBack}
          aria-label="Go back"
          className="inline-flex items-center gap-1.5 rounded-full bg-black/55 px-3 py-2 text-xs font-semibold text-white shadow-lg backdrop-blur-md ring-1 ring-white/15 active:scale-95 transition"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
      </div>
      <main className="pb-24">
        {/* HERO */}
        <section
          className="relative overflow-hidden"
          style={{ background: portraitGradient(actor.fullName) }}
        >
          <div className="absolute inset-0 imigongo-bg opacity-25 mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-background" />
          <div className="relative mx-auto max-w-6xl px-4 pt-24 md:pt-32 md:px-6">
            <button
              type="button"
              onClick={goBack}
              className="hidden md:inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] text-white backdrop-blur hover:bg-white/25"
            >
              <ArrowLeft className="h-3 w-3" /> Back
            </button>


            <div className="mt-8 grid items-end gap-8 md:mt-10 md:grid-cols-[minmax(0,1fr)_2fr]">
              <ProfileGallery actor={actor} />

              <div className="pb-2 text-white">
                <p className="text-[11px] uppercase tracking-[0.3em] text-sky">CyaneHub Talent</p>
                <h1 className="mt-2 font-display text-4xl font-bold leading-[1.05] md:text-6xl">
                  {actor.fullName}
                </h1>
                {actor.tagline && (
                  <p className="mt-4 max-w-2xl text-base text-white/90 md:text-lg">{actor.tagline}</p>
                )}

                <div className="mt-5 flex flex-wrap gap-2">
                  {actor.genres.map((g) => (
                    <span
                      key={g}
                      className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur"
                    >
                      {g}
                    </span>
                  ))}
                </div>

                {/* Meta strip */}
                <div className="mt-6 flex flex-wrap gap-4 text-sm text-white/90">
                  {actor.nationality && (
                    <span className="inline-flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-sky" /> {actor.nationality}
                    </span>
                  )}
                  {actor.languages.length > 0 && (
                    <span className="inline-flex items-center gap-2">
                      <Languages className="h-4 w-4 text-sky" /> {actor.languages.join(", ")}
                    </span>
                  )}
                  {year && (
                    <span className="inline-flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-sky" /> Born {year}
                    </span>
                  )}
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  {actor.instagram && (
                    <a
                      href={instaUrl(actor.instagram)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink hover:bg-sky-soft"
                    >
                      <Instagram className="h-4 w-4" /> Instagram
                    </a>
                  )}
                  {actor.linkedin && actor.linkedin.startsWith("http") && (
                    <a
                      href={actor.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur hover:bg-white/25"
                    >
                      <Linkedin className="h-4 w-4" /> LinkedIn
                    </a>
                  )}
                  <ShareButton
                    title={`${actor.fullName} | CyaneHub`}
                    text={actor.tagline ?? undefined}
                    path={`/actors/${actor.id}`}
                  />
                </div>
              </div>
            </div>
            <div className="h-8 md:h-16" />
          </div>
        </section>

        {/* BODY */}
        <div className="mx-auto mt-10 grid max-w-6xl gap-8 px-4 md:mt-14 md:grid-cols-3 md:px-6">
          {/* Main column */}
          <div className="space-y-10 md:col-span-2">
            {actor.bio && (
              <SectionBlock icon={Sparkles} title="Biography">
                <p className="whitespace-pre-line text-[15px] leading-relaxed text-foreground/90">
                  {actor.bio}
                </p>
              </SectionBlock>
            )}

            {reels.length > 0 && (
              <SectionBlock icon={PlayCircle} title="Watch · Reels & Trailers">
                <div className="grid gap-5 sm:grid-cols-2">
                  {reels.map((f, i) => {
                    const embed = toYouTubeEmbed(f.url!)!;
                    return (
                      <figure
                        key={`reel-${i}`}
                        className="overflow-hidden rounded-2xl border bg-ink shadow-[var(--shadow-elevate)]"
                      >
                        <div className="relative aspect-video w-full bg-black">
                          <iframe
                            src={embed}
                            title={f.title}
                            loading="lazy"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            referrerPolicy="strict-origin-when-cross-origin"
                            className="absolute inset-0 h-full w-full"
                          />
                        </div>
                        <figcaption className="flex items-center justify-between gap-3 p-3 text-white">
                          <div className="min-w-0">
                            <p className="truncate font-display text-sm font-semibold">{f.title}</p>
                            {f.detail && (
                              <p className="truncate text-[11px] text-white/60">{f.detail}</p>
                            )}
                          </div>
                          {f.year && (
                            <span className="rounded-full bg-sky px-2 py-0.5 text-[10px] font-bold text-ink">
                              {f.year}
                            </span>
                          )}
                        </figcaption>
                      </figure>
                    );
                  })}
                </div>
              </SectionBlock>
            )}

            {films.length > 0 && (
              <SectionBlock icon={Film} title="Filmography">
                <ul className="divide-y divide-border overflow-hidden rounded-2xl border bg-card">
                  {films.map((f, i) => (
                    <li key={`${f.title}-${i}`} className="flex items-start gap-3 p-4">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-soft text-sky">
                        <Film className="h-5 w-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-display text-base font-semibold text-ink">{f.title}</p>
                        {f.detail && (
                          <p className="mt-0.5 text-sm text-muted-foreground">{f.detail}</p>
                        )}
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        {f.year && (
                          <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold text-ink">
                            {f.year}
                          </span>
                        )}
                        {f.url && (
                          <a
                            href={f.url}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={`Watch ${f.title}`}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-ink text-sky hover:bg-ink/90"
                          >
                            {toYouTubeEmbed(f.url) ? (
                              <PlayCircle className="h-4 w-4" />
                            ) : (
                              <ExternalLink className="h-3.5 w-3.5" />
                            )}
                          </a>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
                {externalLinks.length > 0 && (
                  <p className="mt-2 text-[11px] text-muted-foreground">
                    Tap the link icon to open trailers and external pages in a new tab.
                  </p>
                )}
              </SectionBlock>
            )}

            {journey.length > 0 && (
              <SectionBlock icon={Award} title="Urugendo · Journey">
                <ol className="relative space-y-5 border-l border-border pl-6">
                  {journey.map((j, i) => (
                    <li key={`${j}-${i}`} className="relative">
                      <span className="absolute -left-[31px] top-1 flex h-5 w-5 items-center justify-center rounded-full bg-sky ring-4 ring-background">
                        <span className="h-2 w-2 rounded-full bg-ink" />
                      </span>
                      <p className="text-[15px] leading-relaxed text-foreground/90">{j}</p>
                    </li>
                  ))}
                </ol>
              </SectionBlock>
            )}
          </div>

          {/* Side column */}
          <aside className="space-y-6">
            <div className="rounded-2xl border bg-card p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-sky">
                Quick facts
              </p>
              <dl className="mt-4 space-y-3 text-sm">
                <FactRow icon={MapPin} label="Nationality" value={actor.nationality} />
                <FactRow icon={Languages} label="Languages" value={actor.languages.join(", ")} />
                {year && <FactRow icon={Calendar} label="Born" value={String(year)} />}
                <FactRow icon={Globe2} label="Based in" value={actor.nationality ?? "Rwanda"} />
              </dl>
            </div>

            <div className="rounded-2xl border bg-ink p-5 text-white">
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-sky">
                Casting enquiry
              </p>
              <p className="mt-3 text-sm text-white/85">
                Interested in {actor.fullName.split(" ")[0]} for your project? Reach out through
                CyaneHub for availability, reels and rates.
              </p>
              <Link
                to="/about"
                className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-sky px-4 py-2.5 text-sm font-semibold text-ink hover:opacity-90"
              >
                Contact CyaneHub
              </Link>
            </div>

            <div className="rounded-2xl border bg-sky-soft p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-sky">
                Genres
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {actor.genres.map((g) => (
                  <span
                    key={g}
                    className="rounded-full bg-white px-3 py-1 text-xs font-medium text-ink"
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </div>

        {related.length > 0 && (
          <section className="mx-auto mt-16 max-w-6xl px-4 md:px-6">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-sky">More talent</p>
                <h2 className="mt-2 font-display text-2xl font-bold text-ink md:text-3xl">
                  Discover other CyaneHub actors
                </h2>
              </div>
              <Link to="/actors" className="hidden text-sm font-medium text-sky hover:underline md:inline">
                See all
              </Link>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
              {related.map((a) => (
                <RelatedCard key={a.id} actor={a} />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}

function SectionBlock({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink text-sky">
          <Icon className="h-4 w-4" />
        </span>
        <h2 className="font-display text-xl font-bold text-ink">{title}</h2>
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function FactRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value?: string | null;
}) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-sky-soft text-sky">
        <Icon className="h-3.5 w-3.5" />
      </span>
      <div className="min-w-0">
        <dt className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </dt>
        <dd className="text-sm font-medium text-ink">{value}</dd>
      </div>
    </div>
  );
}

function RelatedCard({ actor }: { actor: Actor }) {
  return (
    <Link
      to="/actors/$id"
      params={{ id: actor.id }}
      className="group block overflow-hidden rounded-2xl border bg-card transition hover:-translate-y-1 hover:shadow-[var(--shadow-elevate)]"
    >
      <div
        className="relative aspect-[3/4]"
        style={{ background: portraitGradient(actor.fullName) }}
      >
        <div className="absolute inset-0 imigongo-bg opacity-25 mix-blend-overlay" />
        <span className="absolute inset-0 flex items-center justify-center font-display text-4xl font-bold text-white/90">
          {initials(actor.fullName)}
        </span>
      </div>
      <div className="p-3">
        <p className="font-display text-sm font-semibold leading-tight text-ink">{actor.fullName}</p>
        <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
          {actor.genres.slice(0, 2).join(" · ")}
        </p>
      </div>
    </Link>
  );
}

function instaUrl(h: string) {
  return h.startsWith("http") ? h : `https://instagram.com/${h.replace(/[@\s]/g, "")}`;
}

export type FilmEntry = {
  title: string;
  detail?: string;
  year?: string;
  url?: string;
};

function parseFilmography(raw?: string | null): FilmEntry[] {
  if (!raw) return [];
  return raw
    .split(/\r?\n|;/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((line): FilmEntry => {
      const urlMatch = line.match(/https?:\/\/\S+/);
      const url = urlMatch ? urlMatch[0].replace(/[)\].,]+$/, "") : undefined;
      const cleaned = (url ? line.replace(url, "") : line).trim();
      const yearMatch = cleaned.match(/\b(19|20)\d{2}(?:[-–]\d{2,4})?\b/);
      const year = yearMatch ? yearMatch[0] : undefined;
      const withoutYear = year
        ? cleaned.replace(year, "").replace(/[()\s,|-]+$/, "").trim()
        : cleaned;
      const parts = withoutYear.split(/\s*[|·•]\s*|\s+[-–:]\s+/).filter(Boolean);
      const title = (parts[0] || withoutYear).replace(/^[-•·\s|]+/, "").replace(/[\s|-]+$/, "").trim();
      const detail = parts.slice(1).join(" · ").trim() || undefined;
      return { title, detail, year, url };
    });
}

function parseJourney(raw?: string | null) {
  if (!raw) return [];
  return raw
    .split(/\r?\n|;/)
    .map((s) => s.trim().replace(/^[-•·*\s]+/, ""))
    .filter(Boolean);
}

export function toYouTubeEmbed(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.slice(1);
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
      const m = u.pathname.match(/\/embed\/([^/?]+)/);
      if (m) return `https://www.youtube.com/embed/${m[1]}`;
    }
    return null;
  } catch {
    return null;
  }
}


function ProfileGallery({ actor }: { actor: Actor }) {
  const photos = actor.gallery.length > 0
    ? actor.gallery
    : actor.profilePhoto
      ? [actor.profilePhoto]
      : [];
  const [idx, setIdx] = useState(0);

  if (photos.length === 0) {
    return (
      <div
        className="relative mx-auto aspect-[3/4] w-full max-w-[280px] overflow-hidden rounded-3xl ring-4 ring-white/30 shadow-[var(--shadow-elevate)] md:mx-0 md:max-w-none"
        style={{ background: portraitGradient(actor.fullName) }}
      >
        <div className="absolute inset-0 imigongo-bg opacity-25 mix-blend-overlay" />
        <span className="absolute inset-0 flex items-center justify-center font-display text-[6rem] font-black text-white/85">
          {initials(actor.fullName)}
        </span>
        {actor.featured && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-sky px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-ink">
            <Star className="h-3 w-3" /> Featured
          </span>
        )}
      </div>
    );
  }

  const go = (dir: -1 | 1) => {
    setIdx((i) => (i + dir + photos.length) % photos.length);
  };

  return (
    <div className="mx-auto w-full max-w-[320px] md:mx-0 md:max-w-none">
      <div className="group relative aspect-[3/4] overflow-hidden rounded-3xl ring-4 ring-white/30 shadow-[var(--shadow-elevate)]">
        {photos.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={`${actor.fullName} photo ${i + 1}`}
            loading={i === 0 ? "eager" : "lazy"}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
              i === idx ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        {actor.featured && (
          <span className="absolute left-3 top-3 z-10 inline-flex items-center gap-1 rounded-full bg-sky px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-ink">
            <Star className="h-3 w-3" /> Featured
          </span>
        )}
        {photos.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous photo"
              className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/45 p-2 text-white opacity-0 backdrop-blur transition group-hover:opacity-100"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next photo"
              className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/45 p-2 text-white opacity-0 backdrop-blur transition group-hover:opacity-100"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <div className="absolute inset-x-0 bottom-3 z-10 flex justify-center gap-1.5">
              {photos.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIdx(i)}
                  aria-label={`Go to photo ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    i === idx ? "w-6 bg-white" : "w-1.5 bg-white/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
      {photos.length > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-1.5">
          {photos.slice(0, 5).map((src, i) => (
            <button
              key={`thumb-${i}`}
              type="button"
              onClick={() => setIdx(i)}
              aria-label={`Show photo ${i + 1}`}
              className={`relative aspect-square overflow-hidden rounded-lg ring-2 transition ${
                i === idx ? "ring-sky" : "ring-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
