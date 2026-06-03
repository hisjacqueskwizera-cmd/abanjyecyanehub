import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { useMemo, useState } from "react";
import { ArrowLeft, Search, X } from "lucide-react";
import { FloatingNav } from "@/components/FloatingNav";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { ActorCard } from "@/components/ActorCard";
import { Footer } from "@/components/Footer";
import { actorsQueryOptions } from "@/lib/actors-query";

const searchSchema = z.object({
  q: fallback(z.string(), "").default(""),
});

export const Route = createFileRoute("/search")({
  validateSearch: zodValidator(searchSchema),
  loader: ({ context }) => context.queryClient.ensureQueryData(actorsQueryOptions),
  head: () => ({
    meta: [
      { title: "Search | CyaneHub" },
      { name: "description", content: "Search Rwandan actors by name, genre, language or nationality." },
    ],
  }),
  errorComponent: ({ error }) => (
    <div className="flex min-h-screen items-center justify-center px-4 text-center">
      <p className="text-sm text-muted-foreground">Couldn't load search: {error.message}</p>
    </div>
  ),
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const navigate = useNavigate({ from: "/search" });
  const { data: actors } = useSuspenseQuery(actorsQueryOptions);
  const [term, setTerm] = useState(q);

  const results = useMemo(() => {
    const t = term.trim().toLowerCase();
    if (!t) return [];
    return actors.filter((a) =>
      a.fullName.toLowerCase().includes(t) ||
      (a.nationality ?? "").toLowerCase().includes(t) ||
      a.languages.some((l) => l.toLowerCase().includes(t)) ||
      a.genres.some((g) => g.toLowerCase().includes(t)),
    );
  }, [actors, term]);

  const onChange = (v: string) => {
    setTerm(v);
    navigate({ search: { q: v }, replace: true });
  };

  const groups = useMemo(() => {
    const all = new Set<string>();
    actors.forEach((a) => a.genres.forEach((g) => all.add(g)));
    return Array.from(all).sort().slice(0, 8);
  }, [actors]);

  return (
    <>
      <FloatingNav />
      <main className="min-h-screen pt-20 pb-32 md:pt-32">
        <div className="mx-auto max-w-5xl px-4 md:px-6">
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => history.back()}
              aria-label="Back"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-ink"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Search</p>
          </div>

          <div className="mt-4 glass flex items-center gap-2 rounded-2xl px-4 py-3">
            <Search className="h-5 w-5 text-sky" />
            <input
              autoFocus
              value={term}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Search by name, genre, language, nationality..."
              className="flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
            />
            {term && (
              <button
                onClick={() => onChange("")}
                aria-label="Clear"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {!term && (
            <section className="mt-10">
              <p className="text-xs uppercase tracking-[0.3em] text-sky">Try searching</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {groups.map((g) => (
                  <button
                    key={g}
                    onClick={() => onChange(g)}
                    className="rounded-full border bg-white px-4 py-2 text-sm font-medium text-ink hover:bg-sky-soft"
                  >
                    {g}
                  </button>
                ))}
                {["Kinyarwanda", "English", "Rwanda"].map((g) => (
                  <button
                    key={g}
                    onClick={() => onChange(g)}
                    className="rounded-full border bg-white px-4 py-2 text-sm font-medium text-ink hover:bg-sky-soft"
                  >
                    {g}
                  </button>
                ))}
              </div>
            </section>
          )}

          {term && (
            <p className="mt-6 text-sm text-muted-foreground">
              {results.length} {results.length === 1 ? "result" : "results"} for "{term}"
            </p>
          )}

          {term && results.length === 0 && (
            <div className="mt-10 rounded-2xl border bg-muted/40 p-12 text-center">
              <p className="font-display text-lg font-semibold text-ink">No matches found.</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Try a different name, genre or language.
              </p>
              <Link to="/actors" className="mt-6 inline-block text-sm font-semibold text-sky hover:underline">
                Browse all actors
              </Link>
            </div>
          )}

          {results.length > 0 && (
            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {results.map((a) => (
                <ActorCard key={a.id} actor={a} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}
