CREATE POLICY "Public read actor-photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'actor-photos');

CREATE POLICY "Admins manage actor-photos insert"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'actor-photos' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage actor-photos update"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'actor-photos' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage actor-photos delete"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'actor-photos' AND public.has_role(auth.uid(), 'admin'));