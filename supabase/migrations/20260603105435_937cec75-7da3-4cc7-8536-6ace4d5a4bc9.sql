
CREATE TABLE public.actors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  nationality TEXT,
  dob DATE,
  tagline TEXT,
  bio TEXT,
  genres TEXT[] NOT NULL DEFAULT '{}',
  languages TEXT[] NOT NULL DEFAULT '{}',
  instagram TEXT,
  linkedin TEXT,
  filmography TEXT,
  journey TEXT,
  featured BOOLEAN NOT NULL DEFAULT false,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.actors TO anon, authenticated;
GRANT ALL ON public.actors TO service_role;

ALTER TABLE public.actors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Actors are publicly viewable"
  ON public.actors FOR SELECT
  USING (true);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_actors_updated_at
BEFORE UPDATE ON public.actors
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_actors_featured ON public.actors(featured) WHERE featured = true;
CREATE INDEX idx_actors_sort ON public.actors(sort_order);
