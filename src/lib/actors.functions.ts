import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export interface ActorRow {
  id: string;
  slug: string;
  fullName: string;
  nationality: string | null;
  dob: string | null;
  tagline: string | null;
  bio: string | null;
  genres: string[];
  languages: string[];
  instagram: string | null;
  linkedin: string | null;
  filmography: string | null;
  journey: string | null;
  featured: boolean;
  profilePhoto: string | null;
  gallery: string[];
}

const SELECT_COLS =
  "id, slug, full_name, nationality, dob, tagline, bio, genres, languages, instagram, linkedin, filmography, journey, featured, profile_photo, gallery";

const mapRow = (r: Record<string, unknown>): ActorRow => ({
  id: r.slug as string,
  slug: r.slug as string,
  fullName: r.full_name as string,
  nationality: (r.nationality as string | null) ?? null,
  dob: (r.dob as string | null) ?? null,
  tagline: (r.tagline as string | null) ?? null,
  bio: (r.bio as string | null) ?? null,
  genres: (r.genres as string[]) ?? [],
  languages: (r.languages as string[]) ?? [],
  instagram: (r.instagram as string | null) ?? null,
  linkedin: (r.linkedin as string | null) ?? null,
  filmography: (r.filmography as string | null) ?? null,
  journey: (r.journey as string | null) ?? null,
  featured: Boolean(r.featured),
  profilePhoto: (r.profile_photo as string | null) ?? null,
  gallery: ((r.gallery as string[]) ?? []).filter(Boolean),
});

// Public, anon-only Supabase client built from the (already committed) publishable values.
// No service-role key required — `actors` has a public SELECT RLS policy.
function publicClient() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key =
    process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Missing Supabase environment variable(s): SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY.",
    );
  }
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
  });
}

export const listActors = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = publicClient();
  const { data, error } = await supabase
    .from("actors")
    .select(SELECT_COLS)
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []).map(mapRow);
});

export const getActorBySlug = createServerFn({ method: "GET" })
  .inputValidator((d) => z.object({ slug: z.string().min(1).max(200) }).parse(d))
  .handler(async ({ data }) => {
    const supabase = publicClient();
    const { data: row, error } = await supabase
      .from("actors")
      .select(SELECT_COLS)
      .eq("slug", data.slug)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return row ? mapRow(row) : null;
  });
