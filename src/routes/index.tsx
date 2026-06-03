import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { FloatingNav } from "@/components/FloatingNav";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { ActorCard } from "@/components/ActorCard";
import { MobileReels } from "@/components/MobileReels";
import { Footer } from "@/components/Footer";
import { actorsQueryOptions } from "@/lib/actors-query";
import type { Actor } from "@/data/actors";
import { ArrowRight, Film, Users, Sparkles, Globe2, Network, Star } from "lucide-react";

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(actorsQueryOptions),
  head: () => ({
    meta: [
      { title: "CyaneHub | Rwanda's Actor Branding & Casting Platform" },
      {
        name: "description",
        content:
          "CyaneHub connects Rwandan actors with casting opportunities, filmmakers and producers. Discover talent, build careers, tell stories.",
      },
      { property: "og:title", content: "CyaneHub | Rwanda's Actor Branding & Casting Platform" },
      { property: "og:description", content: "Discover Rwandan acting talent and connect with film opportunities." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  errorComponent: ({ error }) => (
    <div className="flex min-h-screen items-center justify-center px-4 text-center">
      <p className="text-sm text-muted-foreground">Couldn't load CyaneHub: {error.message}</p>
    </div>
  ),
  component: Home,
});

function Home() {
  const { data: actors } = useSuspenseQuery(actorsQueryOptions);
  const featured = actors.filter((a) => a.featured).slice(0, 6);

  return (
    <>
      {/* Mobile = TikTok-style reels */}
      <MobileReels />

      {/* Desktop landing */}
      <div className="hidden md:block">
        <FloatingNav />
        <Hero count={actors.length} />
        <FeaturedActors actors={featured} />
        <WhyCyaneHub />
        <HowItWorks />
        <Testimonials />
        <CTASection />
        <Footer />
      </div>
      <MobileBottomNav />
    </>
  );
}

function Hero({ count }: { count: number }) {
  return (
    <section className="relative overflow-hidden pt-28 pb-24" style={{ background: "var(--gradient-cinema)" }}>
      <div className="absolute inset-0 imigongo-bg opacity-40" />

      <SideCluster className="pointer-events-none absolute bottom-0 left-0 hidden h-[420px] w-[280px] text-ink lg:block" />
      <SideCluster className="pointer-events-none absolute bottom-0 right-0 hidden h-[420px] w-[280px] -scale-x-100 text-ink lg:block" />

      <div className="relative mx-auto max-w-5xl px-6 text-center">



        <h1 className="mx-auto mt-8 max-w-4xl text-balance font-display text-5xl font-bold leading-[1.02] tracking-tight text-ink md:text-7xl lg:text-[5.25rem]">
          Where Rwandan actors meet the <span className="text-sky">world's stages</span>.
        </h1>

        <p className="mx-auto mt-8 max-w-2xl text-base text-muted-foreground md:text-lg">
          CyaneHub is the casting and branding home for Rwanda's screen talent. We help actors build
          professional brands, access opportunities, and connect with filmmakers locally and internationally.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4">
          <Link
            to="/actors"
            className="inline-flex items-center gap-2 rounded-md bg-ink px-8 py-4 text-sm font-bold uppercase tracking-wider text-white shadow-[var(--shadow-elevate)] transition-transform hover:scale-[1.02]"
          >
            Discover Actors <ArrowRight className="h-4 w-4" />
          </Link>
          <div className="inline-flex items-center gap-2 text-sm font-medium text-ink">
            <span className="h-3 w-3 rounded-sm bg-sky" />
            Accepting new talent · {count}+ featured actors
          </div>
        </div>
      </div>
    </section>
  );
}

function SideCluster({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 280 420" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <g stroke="currentColor" strokeWidth="3" strokeLinecap="square" fill="none">
        <circle cx="70" cy="340" r="46" />
        <circle cx="70" cy="340" r="14" fill="currentColor" />
        <circle cx="70" cy="294" r="6" />
        <circle cx="70" cy="386" r="6" />
        <circle cx="24" cy="340" r="6" />
        <circle cx="116" cy="340" r="6" />
        <rect x="130" y="280" width="120" height="90" rx="3" />
        <path d="M130 308 L250 308" />
        <path d="M142 280 L162 308 M178 280 L198 308 M214 280 L234 308" />
        <rect x="40" y="186" width="130" height="90" rx="3" />
        <path d="M70 276 L70 296 M140 276 L140 296 M55 296 L155 296" />
        <path d="M210 200 L218 220 L240 222 L223 236 L228 258 L210 246 L192 258 L197 236 L180 222 L202 220 Z" fill="var(--sky)" />
        <path d="M28 128 L42 142 M42 128 L28 142" />
        <path d="M250 138 L264 152 M264 138 L250 152" />
        <rect x="100" y="118" width="44" height="44" rx="2" fill="var(--sky)" fillOpacity="0.45" />
        <rect x="170" y="150" width="22" height="22" rx="2" />
      </g>
    </svg>
  );
}

function FeaturedActors({ actors }: { actors: Actor[] }) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-sky">Featured Talent</p>
          <h2 className="mt-2 font-display text-4xl font-bold text-ink">Faces shaping Rwandan cinema</h2>
        </div>
        <Link to="/actors" className="hidden text-sm font-medium text-sky hover:underline md:inline">
          See all actors
        </Link>
      </div>
      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {actors.map((a) => (
          <ActorCard key={a.id} actor={a} />
        ))}
      </div>
    </section>
  );
}

function WhyCyaneHub() {
  const items = [
    { Icon: Sparkles, title: "Actor Branding", body: "Polished profiles, strong storytelling, professional presence." },
    { Icon: Film, title: "Casting Opportunities", body: "Direct line to producers casting Rwandan and regional projects." },
    { Icon: Users, title: "Film Production Support", body: "Short film initiatives that put our actors on real sets." },
    { Icon: Globe2, title: "Visibility", body: "Curated discovery surface for talent agents and international casting." },
    { Icon: Network, title: "Industry Network", body: "A growing community of directors, producers and creatives." },
    { Icon: Star, title: "Career Growth", body: "From first audition to international stage. We move with you." },
  ];
  return (
    <section className="bg-sky-soft/40 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <p className="text-xs uppercase tracking-[0.3em] text-sky">Why CyaneHub</p>
        <h2 className="mt-2 max-w-2xl font-display text-4xl font-bold text-ink">
          A bridge built for actors, trusted by filmmakers.
        </h2>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(({ Icon, title, body }) => (
            <div key={title} className="rounded-2xl border bg-white p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink text-sky">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-ink">{title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const a = ["Join CyaneHub", "Build your Profile", "Get Discovered", "Receive Opportunities"];
  const p = ["Browse Talent", "Filter by genre / language", "Contact Talent", "Hire Actors"];
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <p className="text-xs uppercase tracking-[0.3em] text-sky">How It Works</p>
      <h2 className="mt-2 font-display text-4xl font-bold text-ink">Two paths. One ecosystem.</h2>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <Track title="For Actors" steps={a} accent />
        <Track title="For Producers" steps={p} />
      </div>
    </section>
  );
}

function Track({ title, steps, accent }: { title: string; steps: string[]; accent?: boolean }) {
  return (
    <div className={`relative overflow-hidden rounded-3xl border p-8 ${accent ? "bg-ink text-white" : "bg-white"}`}>
      <div className={`absolute inset-0 imigongo-bg ${accent ? "opacity-10" : "opacity-30"}`} />
      <h3 className="relative font-display text-2xl font-bold">{title}</h3>
      <ol className="relative mt-6 space-y-3">
        {steps.map((s, i) => (
          <li key={s} className="flex items-start gap-3">
            <span className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${accent ? "bg-sky text-ink" : "bg-ink text-sky"}`}>
              {i + 1}
            </span>
            <span className={accent ? "text-white/90" : "text-ink"}>{s}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Testimonials() {
  const items = [
    {
      quote:
        "CyaneHub gave me a real platform to reach casting directors. My profile finally tells my story the way I want it told.",
      name: "Marie Gorette Uwantege",
      role: "Actor, Ukuri Series",
    },
    {
      quote:
        "I cast through CyaneHub for two of my productions. The quality and reliability of the talent is unmatched in Rwanda.",
      name: "Independent Producer",
      role: "Kigali",
    },
    {
      quote:
        "From local TV series to international ambitions, CyaneHub moves with my career, not against it.",
      name: "MUHOZA Jean Tresor",
      role: "Actor, Seburikoko · Papa Sava",
    },
  ];
  return (
    <section className="bg-ink py-24 text-white">
      <div className="mx-auto max-w-6xl px-6">
        <p className="text-xs uppercase tracking-[0.3em] text-sky">Voices</p>
        <h2 className="mt-2 font-display text-4xl font-bold">Trusted by actors and filmmakers.</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {items.map((t) => (
            <figure key={t.name} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <blockquote className="text-sm leading-relaxed text-white/90">"{t.quote}"</blockquote>
              <figcaption className="mt-6">
                <div className="font-semibold">{t.name}</div>
                <div className="text-xs uppercase tracking-wider text-sky">{t.role}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className="relative overflow-hidden rounded-3xl bg-sky p-10 md:p-16">
        <div className="absolute inset-0 imigongo-bg opacity-30" />
        <div className="relative">
          <h2 className="max-w-3xl font-display text-4xl font-bold text-ink md:text-5xl">
            Your story belongs on screen. Let's get it there.
          </h2>
          <p className="mt-4 max-w-xl text-ink/80">
            Apply to join CyaneHub and start receiving casting opportunities tailored to your craft.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/about"
              className="rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-white hover:opacity-90"
            >
              Join CyaneHub
            </Link>
            <Link
              to="/actors"
              className="rounded-full border border-ink/20 bg-white/80 px-6 py-3.5 text-sm font-semibold text-ink backdrop-blur hover:bg-white"
            >
              Discover talent
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
