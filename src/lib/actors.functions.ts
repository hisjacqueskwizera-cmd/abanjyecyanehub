import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

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

export const listActors = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("actors")
    .select(SELECT_COLS)
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []).map(mapRow);
});

export const getActorBySlug = createServerFn({ method: "GET" })
  .inputValidator((d) => z.object({ slug: z.string().min(1).max(200) }).parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("actors")
      .select(SELECT_COLS)
      .eq("slug", data.slug)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return row ? mapRow(row) : null;
  });
