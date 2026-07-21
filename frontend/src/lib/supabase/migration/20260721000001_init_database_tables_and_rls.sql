-- 3. ENABLE RLS ON ALL TABLES
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_story_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_story_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_content ENABLE ROW LEVEL SECURITY;

-- 4. APPLY POLICIES (Matching your Screenshots exactly)

-- Table: activities
CREATE POLICY "Enable read access for all users" ON activities FOR SELECT TO public USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON activities FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users only" ON activities FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Enable delete for authenticated users only" ON activities FOR DELETE TO authenticated USING (true);

-- Table: admin_users
CREATE POLICY "Allow authenticated read" ON admin_users FOR SELECT TO authenticated USING (true);

-- Table: brand_story_content
CREATE POLICY "Public Read Content" ON brand_story_content FOR SELECT TO public USING (true);
CREATE POLICY "Admin Update Content" ON brand_story_content FOR ALL TO authenticated USING (true);

-- Table: brand_story_features
CREATE POLICY "Public Read Features" ON brand_story_features FOR SELECT TO public USING (true);
CREATE POLICY "Admin Manage Features" ON brand_story_features FOR ALL TO authenticated USING (true);

-- Table: contact_info
CREATE POLICY "Public read access" ON contact_info FOR SELECT TO public USING (true);
CREATE POLICY "Enable all for authenticated users" ON contact_info FOR ALL TO authenticated USING (true);

-- Table: destinations
CREATE POLICY "Public read access" ON destinations FOR SELECT TO public USING (true);
CREATE POLICY "Enable all for authenticated users" ON destinations FOR ALL TO authenticated USING (true);

-- Table: gallery
CREATE POLICY "Public read access" ON gallery FOR SELECT TO public USING (true);
CREATE POLICY "Enable all for authenticated users" ON gallery FOR ALL TO authenticated USING (true);

-- Table: hero_content
CREATE POLICY "Public read access" ON hero_content FOR SELECT TO public USING (true);
CREATE POLICY "Enable all for authenticated users" ON hero_content FOR ALL TO authenticated USING (true);