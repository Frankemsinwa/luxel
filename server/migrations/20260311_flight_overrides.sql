-- Migration: Create flight_price_overrides table
CREATE TABLE IF NOT EXISTS public.flight_price_overrides (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    origin text NOT NULL,
    destination text NOT NULL,
    airline_code text NOT NULL,
    override_price numeric NOT NULL,
    is_active boolean DEFAULT true,
    agent_id uuid REFERENCES auth.users(id),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(origin, destination, airline_code)
);

-- Enable RLS
ALTER TABLE public.flight_price_overrides ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Agents can manage flight overrides" ON public.flight_price_overrides
    FOR ALL USING (
        (auth.jwt() -> 'user_metadata' ->> 'role') IN ('AGENT', 'ADMIN')
    );

CREATE POLICY "Public can view active flight overrides" ON public.flight_price_overrides
    FOR SELECT USING (is_active = true);
