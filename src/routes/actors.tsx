import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { FloatingNav } from "@/components/FloatingNav";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { ActorCard } from "@/components/ActorCard";
import { actors } from "@/data/actors";

export const Route = createFileRoute("/actors")({
  head: () => ({
    meta: [
      { title: "Actors — CyaneHub" },
      { name: "description", content: "Browse Rwandan acting talent on CyaneHub. Filter by genre, language and nationality." },
      { property: "og:title", content: "Actors — CyaneHub" },
      { property: "og:description", content: "Browse Rwandan acting talent on CyaneHub." },
      { property: "og:url", content: "/actors" },
    ],
    links: [{ rel: "canonical", href: "/actors" }],
  }),
  component: ActorsPage,
});

function ActorsPage() {
  const [q, setQ] = useState("");
  const [genre, setGenre] = useState<string>("All");

  const allGenres = useMemo(() => {
    const s = new Set<string>();
    actors.forEach((a) => a.genres.forEach((g) => s.add(g)));
    return ["All", ...Array.from(s).sort()];
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return actors.filter((a) => {
      if (genre !== "All" && !a.genres.includes(genre)) return false;
      if (!term) return true;
      return (
        a.fullName.toLowerCase().includes(term) ||
        a.nationality.toLowerCase().includes(term) ||
        a.languages.some((l) => l.toLowerCase().includes(term)) ||
        a.genres.some((g) => g.toLowerCase().includes(term))
      );
    });
  }, [q, genre]);

  return (
    <>
      <FloatingNav />
      <main className="pt-24 md:pt-32 pb-32">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <header className="mb-8">
            <p className="text-xs uppercase tracking-[0.3em] text-sky">CyaneHub Roster</p>
            <h1 className="mt-2 font-display text-4xl font-bold text-ink md:text-5xl">Discover Actors</h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Rwandan talent ready for casting — from emerging voices to established names.
            </p>
          </header>

          <div className="sticky top-20 z-30 mb-6 -mx-4 px-4 md:static md:mx-0 md:px-0">
            <div className="glass flex flex-col gap-3 rounded-2xl p-3 md:flex-row md:items-center">
              <div className="flex flex-1 items-center gap-2 rounded-xl bg-white/80 px-3 py-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search by name, language, nationality..."
                  className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {allGenres.map((g) => (
                  <button
                    key={g}
                    onClick={() => setGenre(g)}
                    className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition ${
                      genre === g ? "bg-ink text-white" : "bg-white/80 text-ink hover:bg-white"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <p className="mb-4 text-sm text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? "actor" : "actors"}
          </p>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {filtered.map((a) => (
              <ActorCard key={a.id} actor={a} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="rounded-2xl border bg-muted/40 p-12 text-center text-muted-foreground">
              No actors match your search.
            </div>
          )}
        </div>
      </main>
      <MobileBottomNav />
    </>
  );
}
