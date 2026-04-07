-- =========================================================
-- ADMIN ENHANCEMENTS: AGENT MANAGEMENT & LOGGING
-- =========================================================

-- 1. Add is_banned to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS is_banned BOOLEAN DEFAULT FALSE;

-- 2. Create Agent Logs table (using actor_id for clarity)
CREATE TABLE IF NOT EXISTS public.agent_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    actor_id UUID REFERENCES public.profiles(id),
    action TEXT NOT NULL, -- e.g., 'PUBLISH_TOUR', 'APPROVE_FLIGHT', 'BAN_AGENT'
    entity_type TEXT,    -- e.g., 'TOUR', 'BOOKING', 'PROFILE'
    entity_id UUID,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable RLS
ALTER TABLE public.agent_logs ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
DROP POLICY IF EXISTS "Admins can view all logs" ON public.agent_logs;
CREATE POLICY "Admins can view all logs" ON public.agent_logs
    FOR SELECT USING (
        (auth.jwt() -> 'user_metadata' ->> 'role') = 'ADMIN'
    );
