-- TRUNCATE all data in tables, resetting identity counters and cascading to dependents.
-- WARNING: This will permanently delete all testing data from these tables.
-- Note: auth.users is managed by Supabase Auth and should be cleared through 
-- the Supabase dashboard (Authentication -> Users) to ensure the identity 
-- provider stays in sync with your database state.

BEGIN;

TRUNCATE TABLE 
    public.requests, 
    public.bookings, 
    public.profiles 
RESTART IDENTITY CASCADE;

COMMIT;
