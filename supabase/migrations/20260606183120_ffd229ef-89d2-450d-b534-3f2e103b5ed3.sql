ALTER TABLE public.actor_likes DROP CONSTRAINT IF EXISTS actor_likes_actor_id_fkey;
ALTER TABLE public.actor_comments DROP CONSTRAINT IF EXISTS actor_comments_actor_id_fkey;
ALTER TABLE public.actor_likes ALTER COLUMN actor_id TYPE text USING actor_id::text;
ALTER TABLE public.actor_comments ALTER COLUMN actor_id TYPE text USING actor_id::text;
CREATE INDEX IF NOT EXISTS actor_likes_actor_id_idx ON public.actor_likes (actor_id);
CREATE INDEX IF NOT EXISTS actor_comments_actor_id_idx ON public.actor_comments (actor_id, created_at DESC);