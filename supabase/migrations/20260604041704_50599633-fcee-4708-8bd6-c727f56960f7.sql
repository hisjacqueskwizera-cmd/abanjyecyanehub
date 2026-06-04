
CREATE TABLE public.actor_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid NOT NULL REFERENCES public.actors(id) ON DELETE CASCADE,
  anon_id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (actor_id, anon_id)
);

GRANT SELECT, INSERT, DELETE ON public.actor_likes TO anon, authenticated;
GRANT ALL ON public.actor_likes TO service_role;

ALTER TABLE public.actor_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Likes are publicly viewable" ON public.actor_likes
  FOR SELECT USING (true);
CREATE POLICY "Anyone can like" ON public.actor_likes
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can remove a like" ON public.actor_likes
  FOR DELETE USING (true);

CREATE INDEX actor_likes_actor_id_idx ON public.actor_likes(actor_id);

CREATE TABLE public.actor_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid NOT NULL REFERENCES public.actors(id) ON DELETE CASCADE,
  anon_id text NOT NULL,
  anon_name text,
  body text NOT NULL CHECK (char_length(body) BETWEEN 1 AND 1000),
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.actor_comments TO anon, authenticated;
GRANT DELETE ON public.actor_comments TO authenticated;
GRANT ALL ON public.actor_comments TO service_role;

ALTER TABLE public.actor_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Comments are publicly viewable" ON public.actor_comments
  FOR SELECT USING (true);
CREATE POLICY "Anyone can post a comment" ON public.actor_comments
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can delete comments" ON public.actor_comments
  FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX actor_comments_actor_id_created_idx ON public.actor_comments(actor_id, created_at DESC);
