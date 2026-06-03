import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  LogOut,
  Star,
  Shield,
  Search,
  ExternalLink,
  Save,
  X,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  getAdminStatus,
  claimFirstAdmin,
  listActorsAdmin,
  upsertActor,
  deleteActor,
  type ActorInputType,
} from "@/lib/admin.functions";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin · CyaneHub" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

type ActorRecord = {
  id: string;
  slug: string;
  full_name: string;
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
  sort_order: number;
  profile_photo: string | null;
};

const emptyActor: ActorInputType = {
  slug: "",
  full_name: "",
  nationality: "",
  dob: "",
  tagline: "",
  bio: "",
  genres: [],
  languages: [],
  instagram: "",
  linkedin: "",
  filmography: "",
  journey: "",
  featured: false,
  sort_order: 0,
  profile_photo: "",
};

function AdminPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const getStatus = useServerFn(getAdminStatus);
  const claim = useServerFn(claimFirstAdmin);
  const listAll = useServerFn(listActorsAdmin);
  const upsert = useServerFn(upsertActor);
  const remove = useServerFn(deleteActor);

  const status = useQuery({
    queryKey: ["admin-status"],
    queryFn: () => getStatus(),
    retry: false,
  });

  const actorsQ = useQuery({
    queryKey: ["admin-actors"],
    queryFn: () => listAll(),
    enabled: !!status.data?.isAdmin,
    retry: false,
  });

  const [editing, setEditing] = useState<{ open: boolean; actor: ActorRecord | null }>({
    open: false,
    actor: null,
  });
  const [confirmDelete, setConfirmDelete] = useState<ActorRecord | null>(null);
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const list = (actorsQ.data ?? []) as ActorRecord[];
    const t = q.trim().toLowerCase();
    if (!t) return list;
    return list.filter(
      (a) =>
        a.full_name.toLowerCase().includes(t) ||
        a.slug.toLowerCase().includes(t) ||
        (a.nationality ?? "").toLowerCase().includes(t) ||
        a.genres.some((g) => g.toLowerCase().includes(t)),
    );
  }, [actorsQ.data, q]);

  const claimMut = useMutation({
    mutationFn: () => claim(),
    onSuccess: () => {
      toast.success("You are now admin.");
      qc.invalidateQueries({ queryKey: ["admin-status"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed"),
  });

  const upsertMut = useMutation({
    mutationFn: (data: ActorInputType) => upsert({ data }),
    onSuccess: () => {
      toast.success("Saved");
      setEditing({ open: false, actor: null });
      qc.invalidateQueries({ queryKey: ["admin-actors"] });
      qc.invalidateQueries({ queryKey: ["actors"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Save failed"),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => remove({ data: { id } }),
    onSuccess: () => {
      toast.success("Deleted");
      setConfirmDelete(null);
      qc.invalidateQueries({ queryKey: ["admin-actors"] });
      qc.invalidateQueries({ queryKey: ["actors"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Delete failed"),
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  if (status.isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Loading admin...</p>
      </main>
    );
  }

  if (status.isError) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="text-center">
          <p className="text-sm text-destructive">Could not load admin status.</p>
          <Link to="/auth" className="mt-3 inline-block text-sky underline">Sign in again</Link>
        </div>
      </main>
    );
  }

  if (!status.data?.isAdmin) {
    const canClaim = (status.data?.adminCount ?? 1) === 0;
    return (
      <main className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="max-w-md w-full rounded-3xl border bg-card p-8 text-center shadow-[var(--shadow-elevate)]">
          <Shield className="mx-auto h-10 w-10 text-sky" />
          <h1 className="mt-4 font-display text-2xl font-bold text-ink">
            {canClaim ? "Claim admin access" : "Access pending"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {canClaim
              ? "You're the first user. Click below to become the admin and start managing CyaneHub."
              : "Your account is signed in but doesn't have admin permissions yet. Ask an existing admin to grant you access."}
          </p>
          <div className="mt-6 flex flex-col gap-2">
            {canClaim && (
              <button
                onClick={() => claimMut.mutate()}
                disabled={claimMut.isPending}
                className="rounded-full bg-sky px-4 py-2.5 text-sm font-semibold text-ink hover:opacity-90 disabled:opacity-50"
              >
                {claimMut.isPending ? "Granting..." : "Become first admin"}
              </button>
            )}
            <button
              onClick={handleSignOut}
              className="rounded-full border px-4 py-2.5 text-sm font-semibold text-ink hover:bg-muted"
            >
              Sign out
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 md:px-6">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-xs uppercase tracking-[0.3em] text-sky">CyaneHub</Link>
            <span className="hidden text-xs text-muted-foreground md:inline">·</span>
            <h1 className="font-display text-lg font-bold text-ink md:text-xl">Admin</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/actors"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium text-ink hover:bg-muted"
            >
              <ExternalLink className="h-3.5 w-3.5" /> View site
            </Link>
            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium text-ink hover:bg-muted"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-5 pb-28 md:px-6 md:py-10 md:pb-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-sky">Roster</p>
            <h2 className="mt-1 font-display text-2xl md:text-3xl font-bold text-ink">Actors</h2>
            <p className="mt-1 text-xs md:text-sm text-muted-foreground">
              {(actorsQ.data ?? []).length} actors · tap to edit.
            </p>
          </div>
          <button
            onClick={() => setEditing({ open: true, actor: null })}
            className="hidden sm:inline-flex items-center justify-center gap-1.5 rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90"
          >
            <Plus className="h-4 w-4" /> New actor
          </button>
        </div>

        <div className="mt-5 flex items-center gap-2 rounded-2xl border bg-card px-3 py-2.5">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name, slug, nationality or genre"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border bg-card">
          {actorsQ.isLoading ? (
            <div className="p-8 text-center text-sm text-muted-foreground">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">No actors match.</div>
          ) : (
            <ul className="divide-y">
              {filtered.map((a) => (
                <li key={a.id} className="flex items-center gap-3 p-3 sm:p-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-sky-soft text-sky">
                    {a.profile_photo ? (
                      <img src={a.profile_photo} alt={a.full_name} className="h-full w-full object-cover" />
                    ) : (
                      <span className="font-display text-sm font-bold">
                        {a.full_name.split(/\s+/).slice(0, 2).map((s) => s[0]).join("")}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate font-display text-sm font-semibold text-ink">{a.full_name}</p>
                      {a.featured && (
                        <span className="inline-flex items-center gap-0.5 rounded-full bg-sky px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-ink">
                          <Star className="h-2.5 w-2.5" /> Featured
                        </span>
                      )}
                    </div>
                    <p className="truncate text-[11px] text-muted-foreground">
                      /{a.slug} · {a.genres.slice(0, 3).join(", ") || "no genres"}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <Link
                      to="/actors/$id"
                      params={{ id: a.slug }}
                      target="_blank"
                      aria-label="Open public profile"
                      className="hidden sm:inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-ink"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => setEditing({ open: true, actor: a })}
                      aria-label={`Edit ${a.full_name}`}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-ink"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setConfirmDelete(a)}
                      aria-label={`Delete ${a.full_name}`}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <ActorFormDialog
        open={editing.open}
        actor={editing.actor}
        onClose={() => setEditing({ open: false, actor: null })}
        onSubmit={(data) => upsertMut.mutate(data)}
        busy={upsertMut.isPending}
      />

      <AlertDialog open={!!confirmDelete} onOpenChange={(o) => !o && setConfirmDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {confirmDelete?.full_name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes the actor profile. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => confirmDelete && deleteMut.mutate(confirmDelete.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMut.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}

function ActorFormDialog({
  open,
  actor,
  onClose,
  onSubmit,
  busy,
}: {
  open: boolean;
  actor: ActorRecord | null;
  onClose: () => void;
  onSubmit: (data: ActorInputType) => void;
  busy: boolean;
}) {
  const [form, setForm] = useState<ActorInputType>(emptyActor);
  const [genresInput, setGenresInput] = useState("");
  const [languagesInput, setLanguagesInput] = useState("");

  // Reset when opening
  useMemo(() => {
    if (open) {
      if (actor) {
        setForm({
          id: actor.id,
          slug: actor.slug,
          full_name: actor.full_name,
          nationality: actor.nationality ?? "",
          dob: actor.dob ?? "",
          tagline: actor.tagline ?? "",
          bio: actor.bio ?? "",
          genres: actor.genres ?? [],
          languages: actor.languages ?? [],
          instagram: actor.instagram ?? "",
          linkedin: actor.linkedin ?? "",
          filmography: actor.filmography ?? "",
          journey: actor.journey ?? "",
          featured: actor.featured,
          sort_order: actor.sort_order,
          profile_photo: actor.profile_photo ?? "",
        });
        setGenresInput((actor.genres ?? []).join(", "));
        setLanguagesInput((actor.languages ?? []).join(", "));
      } else {
        setForm(emptyActor);
        setGenresInput("");
        setLanguagesInput("");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, actor?.id]);

  const update = <K extends keyof ActorInputType>(k: K, v: ActorInputType[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const toSlug = (s: string) =>
    s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const genres = genresInput.split(",").map((s) => s.trim()).filter(Boolean);
    const languages = languagesInput.split(",").map((s) => s.trim()).filter(Boolean);
    onSubmit({ ...form, genres, languages });
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] w-[calc(100vw-1.5rem)] max-w-3xl overflow-y-auto sm:w-full">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            {actor ? "Edit actor" : "New actor"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name" required>
              <input
                required
                value={form.full_name}
                onChange={(e) => {
                  const v = e.target.value;
                  update("full_name", v);
                  if (!actor && !form.slug) update("slug", toSlug(v));
                }}
                className={inputClass}
              />
            </Field>
            <Field label="Slug (URL)" required hint="lowercase letters, numbers and hyphens">
              <div className="flex items-center gap-2">
                <input
                  required
                  value={form.slug}
                  onChange={(e) => update("slug", e.target.value)}
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => update("slug", toSlug(form.full_name))}
                  className="shrink-0 rounded-lg border px-2 py-1.5 text-[11px] font-medium text-muted-foreground hover:bg-muted"
                >
                  Auto
                </button>
              </div>
            </Field>
          </div>

          <Field label="Tagline">
            <input
              value={form.tagline ?? ""}
              onChange={(e) => update("tagline", e.target.value)}
              className={inputClass}
              placeholder="A short cinematic one-liner"
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Nationality">
              <input
                value={form.nationality ?? ""}
                onChange={(e) => update("nationality", e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Date of birth" hint="YYYY-MM-DD">
              <input
                type="date"
                value={form.dob ?? ""}
                onChange={(e) => update("dob", e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Sort order" hint="lower numbers appear first">
              <input
                type="number"
                min={0}
                value={form.sort_order}
                onChange={(e) => update("sort_order", Number(e.target.value) || 0)}
                className={inputClass}
              />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Genres" hint="comma separated">
              <input
                value={genresInput}
                onChange={(e) => setGenresInput(e.target.value)}
                placeholder="Drama, Comedy, Thriller"
                className={inputClass}
              />
            </Field>
            <Field label="Languages" hint="comma separated">
              <input
                value={languagesInput}
                onChange={(e) => setLanguagesInput(e.target.value)}
                placeholder="Kinyarwanda, English, French"
                className={inputClass}
              />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Instagram" hint="handle or URL">
              <input
                value={form.instagram ?? ""}
                onChange={(e) => update("instagram", e.target.value)}
                className={inputClass}
                placeholder="@handle or https://instagram.com/..."
              />
            </Field>
            <Field label="LinkedIn URL">
              <input
                value={form.linkedin ?? ""}
                onChange={(e) => update("linkedin", e.target.value)}
                className={inputClass}
                placeholder="https://linkedin.com/in/..."
              />
            </Field>
          </div>

          <Field label="Profile photo URL">
            <input
              value={form.profile_photo ?? ""}
              onChange={(e) => update("profile_photo", e.target.value)}
              className={inputClass}
              placeholder="https://..."
            />
          </Field>

          <Field label="Biography">
            <textarea
              rows={5}
              value={form.bio ?? ""}
              onChange={(e) => update("bio", e.target.value)}
              className={inputClass}
            />
          </Field>

          <Field label="Filmography" hint="one entry per line, e.g. Title | Role | 2024 | https://link">
            <textarea
              rows={5}
              value={form.filmography ?? ""}
              onChange={(e) => update("filmography", e.target.value)}
              className={`${inputClass} font-mono text-xs`}
            />
          </Field>

          <Field label="Journey" hint="one milestone per line">
            <textarea
              rows={4}
              value={form.journey ?? ""}
              onChange={(e) => update("journey", e.target.value)}
              className={inputClass}
            />
          </Field>

          <label className="flex items-center gap-2 rounded-xl border bg-muted/40 px-3 py-2">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => update("featured", e.target.checked)}
              className="h-4 w-4 accent-sky"
            />
            <span className="text-sm font-medium text-ink">Featured on homepage</span>
          </label>

          <DialogFooter className="gap-2 sm:gap-2">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold text-ink hover:bg-muted"
            >
              <X className="h-4 w-4" /> Cancel
            </button>
            <button
              type="submit"
              disabled={busy}
              className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
            >
              <Save className="h-4 w-4" /> {busy ? "Saving..." : actor ? "Save changes" : "Create actor"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

const inputClass =
  "w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-ink outline-none focus:border-sky";

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </span>
      <div className="mt-1.5">{children}</div>
      {hint && <span className="mt-1 block text-[11px] text-muted-foreground">{hint}</span>}
    </label>
  );
}
