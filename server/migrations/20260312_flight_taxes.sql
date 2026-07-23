-- Migration: Create flight_taxes table
CREATE TABLE IF NOT EXISTS public.flight_taxes (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    amount numeric NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.flight_taxes ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public can view flight taxes" ON public.flight_taxes
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage flight taxes" ON public.flight_taxes
    FOR ALL USING (
        (auth.jwt() -> 'user_metadata' ->> 'role') = 'ADMIN'
    );

-- Seed initial data
INSERT INTO public.flight_taxes (name, amount) VALUES
('VAT (Value Added Tax)', 12500),
('Passenger Service Charge (PSC)', 15000),
('Airport Tax & Security Fee', 10000),
('Fuel Surcharge', 7500);
