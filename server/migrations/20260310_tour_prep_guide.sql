-- LUXEL TOUR PREPARATION FIELDS (PHASE 2 ENHANCEMENT)
-- Adds Meeting Point and Packing List (Essential Items) to Tours table

ALTER TABLE public.tours 
ADD COLUMN IF NOT EXISTS meeting_point text;

ALTER TABLE public.tours 
ADD COLUMN IF NOT EXISTS packing_list jsonb DEFAULT '[]'::jsonb;

-- Seed existing tours if needed, or just leave null
UPDATE public.tours SET 
meeting_point = 'Luxel Priority Lounge - Terminal 1, Gate B-12',
packing_list = '["Valid Passport & Visa", "Sunscreen (SPF 50+)", "Comfortable walking shoes", "Light jacket for evenings", "Camera or mobile lens extensions"]'::jsonb
WHERE meeting_point IS NULL;
