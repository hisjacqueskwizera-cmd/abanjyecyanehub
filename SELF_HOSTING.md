# Self-hosting CyaneHub

This project works on Lovable Cloud out of the box, but the database layer is
just **Supabase + standard SQL migrations**, so you can run it anywhere:
locally, on Vercel/Netlify/Cloudflare/Render/Fly, or on your own server with
self-hosted Supabase.

## 1. Provision a Supabase project

Pick one:

- **Supabase Cloud** — create a free project at <https://supabase.com>.
- **Self-hosted Supabase** — follow <https://supabase.com/docs/guides/self-hosting>.

You'll need three values from **Project Settings → API**:

| Value | Used as |
| --- | --- |
| Project URL | `SUPABASE_URL` / `VITE_SUPABASE_URL` |
| `anon` / publishable key | `SUPABASE_PUBLISHABLE_KEY` / `VITE_SUPABASE_PUBLISHABLE_KEY` |
| `service_role` key (secret) | `SUPABASE_SERVICE_ROLE_KEY` |

## 2. Apply the database schema

All schema, RLS policies, triggers, functions and storage buckets live in
`supabase/migrations/` as plain SQL. Apply them in filename order.

**Option A — Supabase CLI (recommended):**

```bash
npm i -g supabase
supabase link --project-ref YOUR-PROJECT-REF
supabase db push
```

**Option B — psql against any Postgres / self-hosted Supabase:**

```bash
for f in supabase/migrations/*.sql; do
  psql "$DATABASE_URL" -f "$f"
done
```

Then create the storage bucket the app uses for actor photos:

- Bucket name: `actor-photos`
- Public: **Yes**

(Easiest via the Supabase dashboard → Storage → New bucket.)

## 3. Configure environment variables

Copy `.env.example` to `.env` and fill in the values from step 1:

```bash
cp .env.example .env
```

Both the `VITE_*` and the unprefixed versions are required — Vite inlines the
`VITE_*` ones into the browser bundle, while the server runtime reads the
unprefixed ones.

## 4. Run locally

```bash
bun install
bun run dev
```

The app starts at <http://localhost:8080>.

## 5. Deploy elsewhere

Any host that can run a TanStack Start / Vite SSR build works. Build with:

```bash
bun run build
```

Then set the same environment variables in your host's dashboard
(Vercel/Netlify/Cloudflare/etc.) and deploy the `.output` directory per their
TanStack Start / Nitro instructions.

> The browser client and the server client both fall back gracefully between
> `import.meta.env.VITE_*` and `process.env.*`, so the same code runs in
> Lovable, locally, and on third-party hosts without modification.
