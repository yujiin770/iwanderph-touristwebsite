-- 1. CLEANUP: Remove all existing policies to ensure no conflicts or duplicates
DO $$ 
BEGIN
    EXECUTE (
        SELECT string_agg('DROP POLICY IF EXISTS ' || quote_ident(policyname) || ' ON storage.objects;', ' ')
        FROM pg_policies 
        WHERE tablename = 'objects' AND schemaname = 'storage'
    );
END $$;

-- 2. BUCKET INITIALIZATION
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('gallery', 'gallery', true),
  ('hero', 'hero', true),
  ('destinations', 'destinations', true),
  ('activities', 'activities', true)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;

-- 3. BUCKET-SPECIFIC POLICIES (Matches your Screenshots)

-- ACTIVITIES
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'activities');
CREATE POLICY "Admin Upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'activities');
CREATE POLICY "Admin Delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'activities');

-- DESTINATIONS
CREATE POLICY "Public Read" ON storage.objects FOR SELECT USING (bucket_id = 'destinations');
CREATE POLICY "Authenticated Upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'destinations');

-- HERO
CREATE POLICY "hero-policy-select" ON storage.objects FOR SELECT USING (bucket_id = 'hero');
CREATE POLICY "hero-policy-insert" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'hero');
CREATE POLICY "hero-policy-update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'hero');

-- GALLERY
CREATE POLICY "gallery-policy-select" ON storage.objects FOR SELECT USING (bucket_id = 'gallery');
CREATE POLICY "gallery-policy-insert" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'gallery');
CREATE POLICY "gallery-policy-update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'gallery');
CREATE POLICY "Allow public reads only from known paths" ON storage.objects FOR SELECT USING (bucket_id = 'gallery');

-- 4. GLOBAL POLICIES (From your "Other Policies" Screenshot)
-- These act as a "Catch-all" for any authenticated user
CREATE POLICY "Allow authenticated uploads" ON storage.objects FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated Update" ON storage.objects FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated Delete" ON storage.objects FOR DELETE TO authenticated USING (true);