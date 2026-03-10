-- =========================================================
-- LUXEL TOUR CORE SCHEMA (PHASE 1)
-- =========================================================

-- 1. Initialize Tours Table
-- This table stores all metadata for the premium tour experiences.
CREATE TABLE IF NOT EXISTS public.tours (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    slug text UNIQUE NOT NULL,
    title text NOT NULL,
    description text,
    location text NOT NULL,
    price numeric NOT NULL DEFAULT 0,
    duration text NOT NULL,
    rating float DEFAULT 5.0,
    hero_image text,
    images text[] DEFAULT '{}'::text[],
    tags text[] DEFAULT '{}'::text[],
    themes text[] DEFAULT '{}'::text[],
    itinerary jsonb DEFAULT '[]'::jsonb, -- Array of objects: {day, title, content, etc.}
    guides jsonb DEFAULT '[]'::jsonb,    -- Array of objects: {name, role, image}
    included jsonb DEFAULT '[]'::jsonb,  -- Array of objects: {label, icon_name}
    excluded jsonb DEFAULT '[]'::jsonb,  -- Array of objects: {label}
    status text DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
    start_date timestamptz,
    available_slots int DEFAULT 0,
    agent_id uuid REFERENCES auth.users(id),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 2. Initialize Tour Bookings Table
-- Tracks guest reservations and their specific preferences.
CREATE TABLE IF NOT EXISTS public.tour_bookings (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    tour_id uuid REFERENCES public.tours(id) ON DELETE CASCADE,
    user_id uuid REFERENCES auth.users(id),
    guest_count int NOT NULL DEFAULT 1,
    total_price numeric NOT NULL,
    status text DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'CONFIRMED', 'CANCELLED')),
    contact_info jsonb DEFAULT '{}'::jsonb,   -- {email, phone, fullName}
    preferences jsonb DEFAULT '{}'::jsonb,    -- {dietary, specialRequests}
    booking_date timestamptz DEFAULT now(),
    created_at timestamptz DEFAULT now()
);

-- 3. Security & Row Level Security (RLS) policies
-- Note: You may need to run these as 'postgres' or the 'service_role' in the SQL Editor.

ALTER TABLE public.tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tour_bookings ENABLE ROW LEVEL SECURITY;

-- 3.1 Tours - Read Access: Everyone can see published tours
DROP POLICY IF EXISTS "Public can view published tours" ON public.tours;
CREATE POLICY "Public can view published tours" ON public.tours
    FOR SELECT USING (status = 'PUBLISHED');

-- 3.2 Tours - Admin Access: Agents manage their own listings
DROP POLICY IF EXISTS "Agents can manage their own tours" ON public.tours;
CREATE POLICY "Agents can manage their own tours" ON public.tours
    FOR ALL USING (
        auth.uid() = agent_id OR 
        (auth.jwt() -> 'user_metadata' ->> 'role') = 'ADMIN'
    );

-- 3.3 Bookings - Owner Access: Users see their own bookings
DROP POLICY IF EXISTS "Users can view their own tour bookings" ON public.tour_bookings;
CREATE POLICY "Users can view their own tour bookings" ON public.tour_bookings
    FOR SELECT USING (auth.uid() = user_id);

-- 4. Utility: Automatic 'updated_at' Timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS trigger_update_tours_updated_at ON public.tours;
CREATE TRIGGER trigger_update_tours_updated_at BEFORE UPDATE ON public.tours
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- 5. Seed Data: Initial Elite Tours
-- Only insert if the table is empty to avoid duplicates
INSERT INTO public.tours (slug, title, location, price, duration, hero_image, images, tags, themes, status, description)
SELECT 'tuscan-silk-road', 'The Tuscan Silk Road', 'Tuscany, Italy', 1850000, '7 Days', '/tour-img/img-1.jpg', ARRAY['/tour-img/img-1.jpg', '/tour-img/img-2.jpg'], ARRAY['Limited Edition', 'Culinary'], ARRAY['Culinary Expeditions'], 'PUBLISHED', 'Curated culinary journey through rolling hills focusing on fine wines and truffles.'
WHERE NOT EXISTS (SELECT 1 FROM public.tours WHERE slug = 'tuscan-silk-road');

INSERT INTO public.tours (slug, title, location, price, duration, hero_image, images, tags, themes, status, description)
SELECT 'kyoto-zen-retreat', 'Kyoto Zen Retreat', 'Kyoto, Japan', 2450000, '5 Days', '/tour-img/img-2.jpg', ARRAY['/tour-img/img-2.jpg', '/tour-img/img-1.jpg'], ARRAY['Limited Edition', 'Wellness'], ARRAY['Wellness Retreats'], 'PUBLISHED', 'Mindful immersion in the ancient temples of Japan with exclusive tea ceremonies.'
WHERE NOT EXISTS (SELECT 1 FROM public.tours WHERE slug = 'kyoto-zen-retreat');

INSERT INTO public.tours (slug, title, location, price, duration, hero_image, images, tags, themes, status, description)
SELECT 'wilderness-refined', 'Wilderness Refined', 'Serengeti, Tanzania', 4500000, '10 Days', '/tour-img/img-3.jpg', ARRAY['/tour-img/img-3.jpg', '/tour-img/img-2.jpg'], ARRAY['Premium', 'Safari'], ARRAY['Active Escapes'], 'PUBLISHED', 'Ultimate luxury safari experience in the Serengeti with private guides.'
WHERE NOT EXISTS (SELECT 1 FROM public.tours WHERE slug = 'wilderness-refined');
