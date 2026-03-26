# Production Reset & Clean Slate Procedure

This document outlines the best-practice flow for resetting your Supabase database from a testing state to a clean production state.

## 1. Clear Database Data (Keep Tables)
Run the following SQL in your Supabase SQL Editor. This removes all test data while keeping your table structures intact.

```sql
BEGIN;

-- Remove data in order of dependency to avoid constraint issues
TRUNCATE TABLE 
    public.flight_price_overrides,
    public.tour_bookings,
    public.tours,
    public.requests, 
    public.bookings, 
    public.profiles 
RESTART IDENTITY CASCADE;

COMMIT;
```

## 2. Prepare Database for User Cleanup
The `auth.users` table is managed by Supabase. If you encounter "Database error deleting user", it means other tables still have references to that user. Run this in your SQL Editor to allow automatic cleanup:

```sql
-- Fix Bookings
ALTER TABLE public.bookings 
DROP CONSTRAINT IF EXISTS bookings_user_id_fkey,
ADD CONSTRAINT bookings_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Fix Tours
ALTER TABLE public.tours 
DROP CONSTRAINT IF EXISTS tours_agent_id_fkey,
ADD CONSTRAINT tours_agent_id_fkey 
  FOREIGN KEY (agent_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Fix Tour Bookings
ALTER TABLE public.tour_bookings 
DROP CONSTRAINT IF EXISTS tour_bookings_user_id_fkey,
ADD CONSTRAINT tour_bookings_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Fix Flight Overrides
ALTER TABLE public.flight_price_overrides 
DROP CONSTRAINT IF EXISTS flight_price_overrides_agent_id_fkey,
ADD CONSTRAINT flight_price_overrides_agent_id_fkey 
  FOREIGN KEY (agent_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Fix Profiles
ALTER TABLE public.profiles 
DROP CONSTRAINT IF EXISTS profiles_id_fkey,
ADD CONSTRAINT profiles_id_fkey 
  FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
```

## 3. Clean Up Auth Users
Once constraints are updated:
1. Go to your **Supabase Dashboard**.
2. Navigate to **Authentication** > **Users**.
3. Manually delete your test users. They will now be deleted successfully.

## 4. Final Reset
Once the database is empty:
1. Ensure your `supabase_schema.sql` is up to date in your project.
2. If you added any new functions or policies during testing, make sure they are included in your `supabase_schema.sql`.
3. Your database is now ready for production users.
