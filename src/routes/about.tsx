import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Phone, Target, Eye, Heart } from "lucide-react";
import { FloatingNav } from "@/components/FloatingNav";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { MobileTopBar } from "@/components/MobileTopBar";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About | CyaneHub" },
      { name: "description", content: "CyaneHub is Rwanda's bridge between actors and opportunity. Branding, casting and film production support." },
      { property: "og:title", content: "About | CyaneHub" },
      { property: "og:description", content: "Rwanda's bridge between actors and opportunity." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <FloatingNav />
      <main className="pt-24 pb-16 md:pt-32">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 imigongo-bg opacity-40" />
          <div className="relative mx-auto max-w-4xl px-6 py-16 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-sky">About CyaneHub</p>
            <h1 className="mt-3 font-display text-5xl font-bold leading-tight text-ink md:text-6xl">
              The bridge between Rwandan actors and the world.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              We exist to put Rwandan talent on every stage that matters, from local productions to
              international screens. CyaneHub builds professional brands, opens doors to casting,
              and supports actors through their entire creative journey.
            </p>
          </div>
        </section>

        {/* Story */}
        <section className="mx-auto max-w-4xl px-6 py-12">
          <p className="text-xs uppercase tracking-[0.3em] text-sky">Our Story</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-ink">Born in Kigali. Built for the screen.</h2>
          <div className="mt-6 space-y-4 text-muted-foreground">
            <p>
              CyaneHub started with a simple observation: Rwanda is full of extraordinary acting talent,
              but the pipeline to professional opportunity was broken. Actors were invisible to producers.
              Producers couldn't find the faces they needed. Careers stalled before they began.
            </p>
            <p>
              We built CyaneHub to fix that: a curated, professional platform where every actor gets a
              real brand, a real portfolio, and a real shot at being cast. We collaborate with filmmakers,
              support short film productions, and quietly champion the rise of Rwandan cinema on the world stage.
            </p>
          </div>
        </section>

        {/* Mission / Vision / Values */}
        <section className="mx-auto max-w-6xl px-6 py-12">
          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                Icon: Target,
                title: "Mission",
                body: "Equip every Rwandan actor with the brand, network and opportunities to build a sustainable creative career.",
              },
              {
                Icon: Eye,
                title: "Vision",
                body: "Rwandan acting talent recognized, cast, and celebrated across Africa and the world.",
              },
              {
                Icon: Heart,
                title: "Values",
                body: "Integrity. Discipline. Cultural pride. Excellence on every set, in every role.",
              },
            ].map(({ Icon, title, body }) => (
              <div key={title} className="rounded-3xl border bg-white p-7">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky text-ink">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-display text-xl font-bold text-ink">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section className="mx-auto mt-12 max-w-6xl px-6">
          <div className="relative overflow-hidden rounded-3xl bg-ink p-10 text-white md:p-14">
            <div className="absolute inset-0 imigongo-bg opacity-10" />
            <div className="relative grid gap-10 md:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-sky">Contact</p>
                <h2 className="mt-2 font-display text-4xl font-bold">Let's build your story.</h2>
                <p className="mt-3 max-w-md text-white/80">
                  Actors, producers, partners. Get in touch. We answer fast.
                </p>
              </div>
              <ul className="space-y-4 text-sm">
                <li className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                    <MapPin className="h-4 w-4 text-sky" />
                  </span>
                  Kigali, Rwanda
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                    <Mail className="h-4 w-4 text-sky" />
                  </span>
                  <a href="mailto:hello@cyanehub.rw" className="hover:underline">hello@cyanehub.rw</a>
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                    <Phone className="h-4 w-4 text-sky" />
                  </span>
                  <a href="tel:+250788000000" className="hover:underline">+250 788 000 000</a>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}
