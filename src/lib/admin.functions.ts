import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const ActorInput = z.object({
  id: z.string().uuid().optional(),
  slug: z
    .string()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9-]+$/, "lowercase letters, numbers, and hyphens only"),
  full_name: z.string().min(1).max(200),
  nationality: z.string().max(120).nullable().optional(),
  dob: z.string().max(20).nullable().optional(),
  tagline: z.string().max(500).nullable().optional(),
  bio: z.string().max(5000).nullable().optional(),
  genres: z.array(z.string().min(1).max(60)).max(30),
  languages: z.array(z.string().min(1).max(60)).max(30),
  instagram: z.string().max(300).nullable().optional(),
  linkedin: z.string().max(500).nullable().optional(),
  filmography: z.string().max(10000).nullable().optional(),
  journey: z.string().max(10000).nullable().optional(),
  featured: z.boolean(),
  sort_order: z.number().int().min(0).max(100000),
  profile_photo: z.string().max(1000).nullable().optional(),
  gallery: z.array(z.string().min(1).max(1000)).max(20).default([]),
});

export type ActorInputType = z.infer<typeof ActorInput>;

const cleanNullable = (v: string | null | undefined) => {
  if (v === undefined) return undefined;
  if (v === null) return null;
  const t = v.trim();
  return t.length === 0 ? null : t;
};

export const getAdminStatus = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const [{ data: mine }, { data: exists }] = await Promise.all([
      supabase.from("user_roles").select("role").eq("user_id", userId),
      supabase.rpc("admin_exists"),
    ]);
    const isAdmin = (mine ?? []).some((r) => r.role === "admin");
    return { isAdmin, adminCount: exists ? 1 : 0, userId };
  });

export const claimFirstAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { error } = await context.supabase.rpc("claim_first_admin");
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const upsertActor = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => ActorInput.parse(d))
  .handler(async ({ data, context }) => {
    const payload = {
      slug: data.slug,
      full_name: data.full_name,
      nationality: cleanNullable(data.nationality ?? null),
      dob: cleanNullable(data.dob ?? null),
      tagline: cleanNullable(data.tagline ?? null),
      bio: cleanNullable(data.bio ?? null),
      genres: data.genres,
      languages: data.languages,
      instagram: cleanNullable(data.instagram ?? null),
      linkedin: cleanNullable(data.linkedin ?? null),
      filmography: cleanNullable(data.filmography ?? null),
      journey: cleanNullable(data.journey ?? null),
      featured: data.featured,
      sort_order: data.sort_order,
      profile_photo: cleanNullable(data.profile_photo ?? null),
      gallery: data.gallery ?? [],
    };
    if (data.id) {
      const { data: row, error } = await context.supabase
        .from("actors")
        .update(payload)
        .eq("id", data.id)
        .select("id, slug")
        .single();
      if (error) throw new Error(error.message);
      return row;
    }
    const { data: row, error } = await context.supabase
      .from("actors")
      .insert(payload)
      .select("id, slug")
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const deleteActor = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("actors").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const listActorsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("actors")
      .select(
        "id, slug, full_name, nationality, dob, tagline, bio, genres, languages, instagram, linkedin, filmography, journey, featured, sort_order, profile_photo, gallery",
      )
      .order("sort_order", { ascending: true });
    if (error) throw new Error(error.message);
    return data ?? [];
  });
