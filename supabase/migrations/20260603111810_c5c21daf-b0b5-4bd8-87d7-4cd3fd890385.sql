
-- 1. Add profile_photo column to actors (auto-displayed when uploaded later)
ALTER TABLE public.actors ADD COLUMN IF NOT EXISTS profile_photo text;

-- 2. Admin authentication scaffold: roles enum + user_roles table + has_role function
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- 3. Allow admins to manage actor content (insert/update/delete) once they sign in
GRANT INSERT, UPDATE, DELETE ON public.actors TO authenticated;

DROP POLICY IF EXISTS "Admins can insert actors" ON public.actors;
CREATE POLICY "Admins can insert actors"
  ON public.actors FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update actors" ON public.actors;
CREATE POLICY "Admins can update actors"
  ON public.actors FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can delete actors" ON public.actors;
CREATE POLICY "Admins can delete actors"
  ON public.actors FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
