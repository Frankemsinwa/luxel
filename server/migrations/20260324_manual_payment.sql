-- Add manual payment support to flight and tour bookings

-- 1. Updates for flight bookings
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS receipt_url text,
ADD COLUMN IF NOT EXISTS payment_method text DEFAULT 'PAYSTACK';

-- Update status check for bookings if it exists (assuming it might be a check constraint)
-- Note: Depending on existing constraints, this might need an ALTER TABLE ... DROP CONSTRAINT then ADD.
-- For now we just allow the value in logic.

-- 2. Updates for tour bookings
ALTER TABLE public.tour_bookings
ADD COLUMN IF NOT EXISTS receipt_url text,
ADD COLUMN IF NOT EXISTS payment_method text DEFAULT 'PAYSTACK';

-- Update status check for tour_bookings
ALTER TABLE public.tour_bookings 
DROP CONSTRAINT IF EXISTS tour_bookings_status_check;

ALTER TABLE public.tour_bookings 
ADD CONSTRAINT tour_bookings_status_check 
CHECK (status IN ('PENDING', 'CONFIRMED', 'CANCELLED', 'AWAITING_VERIFICATION'));
