import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { FloatingNav } from "@/components/FloatingNav";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { ProfileBody } from "@/components/MobileReels";
import { Footer } from "@/components/Footer";
import { initials, portraitGradient } from "@/data/actors";
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
      <button onClick={reset} className="rounded-full bg-ink px-4 py-2 text-white">Try again</button>
    </div>
  ),
  component: ActorProfile,
});

function ActorProfile() {
  const { id } = Route.useParams();
  const { data: actor } = useSuspenseQuery(actorQueryOptions(id));
  const { data: allActors } = useSuspenseQuery(actorsQueryOptions);
  if (!actor) return null;
  const related = allActors.filter((a) => a.id !== actor.id).slice(0, 4);

  return (
    <>
      <FloatingNav />
      <main className="pb-16">
        {/* Hero */}
        <section
          className="relative overflow-hidden"
          style={{ background: portraitGradient(actor.fullName) }}
        >
          <div className="absolute inset-0 imigongo-bg opacity-25 mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-background" />
          <div className="relative mx-auto max-w-6xl px-4 pt-24 md:pt-36 md:px-6">
            <Link
              to="/actors"
              className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.2em] text-white/90 hover:text-white"
            >
              <ArrowLeft className="h-3 w-3" /> All actors
            </Link>
            <div className="mt-8 grid items-end gap-8 md:grid-cols-[1fr_2fr]">
              <div className="relative aspect-[3/4] overflow-hidden rounded-3xl ring-4 ring-white/30">
                <span className="absolute inset-0 flex items-center justify-center font-display text-7xl font-black text-white/85">
                  {initials(actor.fullName)}
                </span>
              </div>
              <div className="pb-2 text-white">
                <p className="text-[11px] uppercase tracking-[0.3em] text-sky">{actor.nationality}</p>
                <h1 className="mt-2 font-display text-4xl font-bold leading-tight md:text-6xl">
                  {actor.fullName}
                </h1>
                {actor.tagline && (
                  <p className="mt-4 max-w-2xl text-lg text-white/90">{actor.tagline}</p>
                )}
                <div className="mt-5 flex flex-wrap gap-2">
                  {actor.genres.map((g) => (
                    <span key={g} className="rounded-full bg-white/15 px-3 py-1 text-xs backdrop-blur">
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <ProfileBody actor={actor} />
        </div>

        {related.length > 0 && (
          <section className="mx-auto mt-12 max-w-6xl px-4 md:px-6">
            <h2 className="font-display text-2xl font-bold">More from CyaneHub</h2>
            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
              {related.map((a) => (
                <Link
                  key={a.id}
                  to="/actors/$id"
                  params={{ id: a.id }}
                  className="group block overflow-hidden rounded-2xl border bg-card"
                >
                  <div
                    className="relative aspect-[3/4]"
                    style={{ background: portraitGradient(a.fullName) }}
                  >
                    <span className="absolute inset-0 flex items-center justify-center font-display text-4xl font-bold text-white/90">
                      {initials(a.fullName)}
                    </span>
                  </div>
                  <div className="p-3">
                    <p className="font-display text-sm font-semibold leading-tight">{a.fullName}</p>
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                      {a.genres.slice(0, 2).join(" · ")}
                    </p>
                  </div>
                </Link>
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
