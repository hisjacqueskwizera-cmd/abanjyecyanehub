import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Drawer } from "vaul";
import {
  ArrowUpRight,
  Calendar,
  Eye,
  Film,
  Instagram,
  Languages,
  Linkedin,
  MapPin,
  PlayCircle,
  Sparkles,
} from "lucide-react";
import { actorsQueryOptions } from "@/lib/actors-query";
import { initials, portraitGradient, type Actor } from "@/data/actors";
import { MobileTopBar } from "./MobileTopBar";
import { ShareButton } from "./ShareButton";

function parseFilms(raw?: string | null) {
  if (!raw) return [];
  return raw
    .split(/\r?\n|;/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((line) => {
      const urlMatch = line.match(/https?:\/\/\S+/);
      const url = urlMatch ? urlMatch[0].replace(/[)\].,]+$/, "") : undefined;
      const cleaned = (url ? line.replace(url, "") : line).trim();
      const yearMatch = cleaned.match(/\b(19|20)\d{2}(?:[-–]\d{2,4})?\b/);
      const year = yearMatch ? yearMatch[0] : undefined;
      const withoutYear = year
        ? cleaned.replace(year, "").replace(/[()\s,|-]+$/, "").trim()
        : cleaned;
      const parts = withoutYear.split(/\s*[|·•]\s*|\s+[-–:]\s+/).filter(Boolean);
      const title = (parts[0] || withoutYear).replace(/^[-•·\s|]+/, "").trim();
      const detail = parts.slice(1).join(" · ").trim() || undefined;
      return { title, detail, year, url };
    });
}

function youTubeEmbed(url?: string) {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.slice(1);
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
    return null;
  } catch {
    return null;
  }
}

export function MobileReels() {
  const { data: actors } = useSuspenseQuery(actorsQueryOptions);
  const [openId, setOpenId] = useState<string | null>(null);
  const open = actors.find((a) => a.id === openId) ?? null;

  return (
    <div className="relative h-[100dvh] w-full overflow-y-scroll snap-y-mandatory no-scrollbar md:hidden">
      <MobileTopBar variant="dark" />
      {actors.map((a) => (
        <Reel key={a.id} actor={a} onOpen={() => setOpenId(a.id)} />
      ))}
      <BottomSheet actor={open} onClose={() => setOpenId(null)} />
    </div>
  );
}

function Reel({ actor, onOpen }: { actor: Actor; onOpen: () => void }) {
  const photos = [actor.profilePhoto, ...(actor.gallery ?? [])].filter(
    (p): p is string => !!p
  );
  const hasPhotos = photos.length > 0;
  const [idx, setIdx] = useState(0);

  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    if (i !== idx) setIdx(i);
  };

  return (
    <section
      className="relative flex h-[100dvh] w-full snap-start items-end overflow-hidden"
      style={{ background: portraitGradient(actor.fullName) }}
    >
      {hasPhotos ? (
        <div
          onScroll={onScroll}
          className="absolute inset-0 flex snap-x snap-mandatory overflow-x-auto overflow-y-hidden no-scrollbar"
        >
          {photos.map((src, i) => (
            <div key={i} className="relative h-full w-full shrink-0 snap-center">
              <img
                src={src}
                alt={`${actor.fullName} ${i + 1}`}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="absolute inset-0 imigongo-bg opacity-20 mix-blend-overlay" />
          <span className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-[14rem] font-black leading-none text-white/15">
            {initials(actor.fullName)}
          </span>
        </>
      )}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 top-1/3 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

      {photos.length > 1 && (
        <div className="pointer-events-none absolute left-0 right-0 top-16 z-10 flex justify-center gap-1.5 px-6">
          {photos.map((_, i) => (
            <span
              key={i}
              className={`h-1 max-w-12 flex-1 rounded-full transition-all ${
                i === idx ? "bg-white" : "bg-white/30"
              }`}
            />
          ))}
        </div>
      )}

      <div className="pointer-events-none relative z-10 w-full p-6 pb-32 text-white">
        <div className="pointer-events-auto">
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
            aria-label="View details"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-white backdrop-blur ring-1 ring-white/20"
          >
            <Eye className="h-4 w-4 text-sky" /> View details
          </button>
        </div>
      </div>
    </section>
  );
}

function BottomSheet({ actor, onClose }: { actor: Actor | null; onClose: () => void }) {
  const open = !!actor;
  const year = actor?.dob ? new Date(actor.dob).getFullYear() : null;
  const films = actor ? parseFilms(actor.filmography) : [];
  const reels = films.filter((f) => f.url && youTubeEmbed(f.url));

  return (
    <Drawer.Root open={open} onOpenChange={(o) => !o && onClose()} shouldScaleBackground>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm" />
        <Drawer.Content
          className="fixed inset-x-0 bottom-0 z-[61] mt-24 flex h-[92dvh] flex-col rounded-t-[28px] bg-background shadow-[var(--shadow-elevate)] outline-none"
        >
          {/* Drag handle */}
          <div className="flex h-7 shrink-0 items-center justify-center" aria-hidden>
            <span className="mt-2 h-1.5 w-12 rounded-full bg-border" />
          </div>
          <Drawer.Title className="sr-only">{actor?.fullName ?? "Actor details"}</Drawer.Title>
          <Drawer.Description className="sr-only">
            {actor?.tagline ?? "Actor profile details"}
          </Drawer.Description>

          {actor && (
            <div className="flex min-h-0 flex-1 flex-col">
              <div className="flex-1 overflow-y-auto overscroll-contain pb-[calc(env(safe-area-inset-bottom)+96px)]">
                <div
                  className="relative h-44 w-full"
                  style={{ background: portraitGradient(actor.fullName) }}
                >
                  {actor.profilePhoto ? (
                    <img
                      src={actor.profilePhoto}
                      alt={actor.fullName}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <>
                      <div className="absolute inset-0 imigongo-bg opacity-20 mix-blend-overlay" />
                      <span className="absolute inset-0 flex items-center justify-center font-display text-[5rem] font-black text-white/85">
                        {initials(actor.fullName)}
                      </span>
                    </>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 px-5 pb-3">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-sky">
                      {actor.nationality ?? "CyaneHub Talent"}
                    </p>
                    <h3 className="font-display text-2xl font-bold leading-tight text-ink">
                      {actor.fullName}
                    </h3>
                    {actor.tagline && (
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{actor.tagline}</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 overflow-x-auto px-5 pt-3 pb-1 no-scrollbar">
                  {actor.languages.length > 0 && (
                    <Chip icon={<Languages className="h-3.5 w-3.5" />}>
                      {actor.languages.join(", ")}
                    </Chip>
                  )}
                  {actor.nationality && (
                    <Chip icon={<MapPin className="h-3.5 w-3.5" />}>{actor.nationality}</Chip>
                  )}
                  {year && <Chip icon={<Calendar className="h-3.5 w-3.5" />}>Born {year}</Chip>}
                </div>

                {actor.genres.length > 0 && (
                  <div className="px-5 pt-3">
                    <div className="flex flex-wrap gap-1.5">
                      {actor.genres.map((g) => (
                        <span
                          key={g}
                          className="rounded-full bg-sky-soft px-3 py-1 text-xs font-medium text-ink"
                        >
                          {g}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {reels.length > 0 && (
                  <div className="mt-5">
                    <h4 className="flex items-center gap-1.5 px-5 text-[11px] font-semibold uppercase tracking-[0.25em] text-sky">
                      <PlayCircle className="h-3.5 w-3.5" /> Watch · Reels
                    </h4>
                    <div className="mt-2 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-1 no-scrollbar">
                      {reels.map((f, i) => (
                        <figure
                          key={`reel-${i}`}
                          className="w-[82%] shrink-0 snap-start overflow-hidden rounded-2xl border bg-ink"
                        >
                          <div className="relative aspect-video w-full bg-black">
                            <iframe
                              src={youTubeEmbed(f.url) ?? undefined}
                              title={f.title}
                              loading="lazy"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              allowFullScreen
                              className="absolute inset-0 h-full w-full"
                            />
                          </div>
                          <figcaption className="flex items-center justify-between gap-2 p-3 text-white">
                            <p className="truncate text-sm font-semibold">{f.title}</p>
                            {f.year && (
                              <span className="rounded-full bg-sky px-2 py-0.5 text-[10px] font-bold text-ink">
                                {f.year}
                              </span>
                            )}
                          </figcaption>
                        </figure>
                      ))}
                    </div>
                  </div>
                )}

                {actor.bio && (
                  <SheetSection icon={<Sparkles className="h-3.5 w-3.5" />} title="Biography">
                    <p className="whitespace-pre-line text-[14px] leading-relaxed text-foreground/90">
                      {actor.bio}
                    </p>
                  </SheetSection>
                )}

                {films.length > 0 && (
                  <SheetSection icon={<Film className="h-3.5 w-3.5" />} title="Filmography">
                    <ul className="divide-y divide-border overflow-hidden rounded-2xl border bg-card">
                      {films.map((f, i) => (
                        <li key={`f-${i}`} className="flex items-center gap-3 p-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-soft text-sky">
                            <Film className="h-4 w-4" />
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-ink">{f.title}</p>
                            {f.detail && (
                              <p className="truncate text-[12px] text-muted-foreground">{f.detail}</p>
                            )}
                          </div>
                          {f.year && (
                            <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-ink">
                              {f.year}
                            </span>
                          )}
                          {f.url && (
                            <a
                              href={f.url}
                              target="_blank"
                              rel="noreferrer"
                              aria-label={`Watch ${f.title}`}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-ink text-sky"
                            >
                              {youTubeEmbed(f.url) ? (
                                <PlayCircle className="h-4 w-4" />
                              ) : (
                                <ArrowUpRight className="h-4 w-4" />
                              )}
                            </a>
                          )}
                        </li>
                      ))}
                    </ul>
                  </SheetSection>
                )}

                {actor.journey && (
                  <SheetSection title="Urugendo / Journey">
                    <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                      {actor.journey}
                    </p>
                  </SheetSection>
                )}

                <div className="mt-6 flex gap-3 px-5">
                  {actor.instagram && (
                    <a
                      href={
                        actor.instagram.startsWith("http")
                          ? actor.instagram
                          : `https://instagram.com/${actor.instagram.replace(/[@\s]/g, "")}`
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium hover:bg-muted"
                    >
                      <Instagram className="h-4 w-4" /> Instagram
                    </a>
                  )}
                  {actor.linkedin && actor.linkedin.startsWith("http") && (
                    <a
                      href={actor.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium hover:bg-muted"
                    >
                      <Linkedin className="h-4 w-4" /> LinkedIn
                    </a>
                  )}
                  <ShareButton
                    title={`${actor.fullName} | CyaneHub`}
                    text={actor.tagline ?? undefined}
                    path={`/actors/${actor.id}`}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium hover:bg-muted"
                  />
                </div>
              </div>

              <div className="absolute inset-x-0 bottom-0 border-t bg-background/95 px-4 pb-[calc(env(safe-area-inset-bottom)+12px)] pt-3 backdrop-blur">
                <Link
                  to="/actors/$id"
                  params={{ id: actor.id }}
                  onClick={onClose}
                  className="block w-full rounded-full bg-ink py-3 text-center text-sm font-semibold text-white active:scale-[0.99]"
                >
                  Open full profile
                </Link>
              </div>
            </div>
          )}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

function Chip({ icon, children }: { icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border bg-card px-3 py-1.5 text-[12px] font-medium text-ink">
      {icon}
      {children}
    </span>
  );
}

function SheetSection({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-6 px-5">
      <h4 className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-sky">
        {icon}
        {title}
      </h4>
      <div className="mt-2 text-foreground">{children}</div>
    </div>
  );
}
