-- UPGRADE FLIGHT OVERRIDES AND ADD MANUAL FLIGHTS
-- Run this in your Supabase SQL Editor

-- 1. Create or Update flight_price_overrides
CREATE TABLE IF NOT EXISTS flight_price_overrides (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    origin TEXT NOT NULL,
    destination TEXT NOT NULL,
    airline_code TEXT NOT NULL,
    override_price DECIMAL NOT NULL,
    departure_date DATE, -- NULL means global override for this route/airline
    valid_until TIMESTAMP WITH TIME ZONE, -- For duration control
    is_active BOOLEAN DEFAULT TRUE,
    agent_id UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(origin, destination, airline_code, departure_date)
);

-- 2. Create manual_flights table
CREATE TABLE IF NOT EXISTS manual_flights (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    origin TEXT NOT NULL,
    destination TEXT NOT NULL,
    departure_date DATE NOT NULL,
    airline_code TEXT NOT NULL,
    airline_name TEXT NOT NULL,
    departure_time TEXT NOT NULL,
    arrival_time TEXT NOT NULL,
    duration TEXT NOT NULL,
    stops TEXT NOT NULL,
    price DECIMAL NOT NULL,
    currency TEXT DEFAULT 'NGN',
    agent_id UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Enable RLS
ALTER TABLE flight_price_overrides ENABLE ROW LEVEL SECURITY;
ALTER TABLE manual_flights ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
CREATE POLICY "Agents can manage overrides" ON flight_price_overrides 
FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('AGENT', 'ADMIN'))
);

CREATE POLICY "Agents can manage manual flights" ON manual_flights 
FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('AGENT', 'ADMIN'))
);

CREATE POLICY "Public can view active overrides" ON flight_price_overrides 
FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view manual flights" ON manual_flights 
FOR SELECT USING (true);
