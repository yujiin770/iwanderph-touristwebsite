# Database Schema SQL for Supabase

## Create All Tables

Run these SQL commands in your Supabase SQL editor:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Destinations Table
CREATE TABLE IF NOT EXISTS destinations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  label VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  rating DECIMAL(3,1) DEFAULT 4.5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Gallery Table
CREATE TABLE IF NOT EXISTS gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Hero Content Table
CREATE TABLE IF NOT EXISTS hero_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT,
  description TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- If table already exists, add images column for carousel support
ALTER TABLE hero_content
ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;

-- Contact Info Table
CREATE TABLE IF NOT EXISTS contact_info (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone VARCHAR(20),
  email VARCHAR(100),
  address TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Contact Messages Table
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Indexes
CREATE INDEX idx_destinations_created_at ON destinations(created_at DESC);
CREATE INDEX idx_gallery_created_at ON gallery(created_at DESC);
CREATE INDEX idx_admin_email ON admin_users(email);
CREATE INDEX idx_contact_email ON contact_messages(email);
```

## Insert Sample Data

```sql
-- Insert admin user (use bcrypted password)
INSERT INTO admin_users (email, password) 
VALUES ('admin@iwander.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36gZvWFm');
-- Note: The above is a bcrypt hash. Generate your own at https://bcrypt.online/

-- Insert sample hero content
INSERT INTO hero_content (title, description, images)
VALUES (
  'Explore The Islands of The Philippines',
  'Discover the stunning beaches, vibrant coral reefs, and breathtaking landscapes of the Pearl of the Orient.',
  '[
    "https://images.pexels.com/photos/1632242/pexels-photo-1632242.jpeg",
    "https://images.pexels.com/photos/11995818/pexels-photo-11995818.jpeg",
    "https://images.pexels.com/photos/1598991/pexels-photo-1598991.jpeg"
  ]'::jsonb
);

-- Insert sample contact info
INSERT INTO contact_info (phone, email, address)
VALUES (
  '+63 917 123 4567',
  'info@iwanderph.com',
  'Manila, Philippines'
);

-- Insert sample destinations
INSERT INTO destinations (name, label, description, image, rating)
VALUES 
  (
    'Boracay Island',
    'Beach Paradise',
    'Experience the white sandy beaches and crystal-clear waters of Boracay, perfect for water sports and relaxation.',
    'https://images.pexels.com/photos/1632242/pexels-photo-1632242.jpeg',
    4.8
  ),
  (
    'Chocolate Hills',
    'Natural Wonder',
    'Visit the famous Chocolate Hills in Bohol, a mesmerizing landscape of over 1,200 hills covered in green vegetation.',
    'https://images.pexels.com/photos/11995818/pexels-photo-11995818.jpeg',
    4.7
  ),
  (
    'Siargao Island',
    'Surfer Paradise',
    'The surfing capital of the Philippines with pristine beaches, lagoons, and a vibrant beach culture.',
    'https://images.pexels.com/photos/1598991/pexels-photo-1598991.jpeg',
    4.6
  );

-- Insert sample gallery photos
INSERT INTO gallery (title, url)
VALUES 
  ('Sunset at Boracay', 'https://images.pexels.com/photos/1632242/pexels-photo-1632242.jpeg'),
  ('Chocolate Hills Landscape', 'https://images.pexels.com/photos/11995818/pexels-photo-11995818.jpeg'),
  ('Siargao Island Shores', 'https://images.pexels.com/photos/1598991/pexels-photo-1598991.jpeg');
```

## Row Level Security (Optional but Recommended)

```sql
-- Enable RLS on tables
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

-- Public read access for destinations and gallery
CREATE POLICY "Enable read access for all users" ON destinations FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON gallery FOR SELECT USING (true);
```
