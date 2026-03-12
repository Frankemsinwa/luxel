-- Guest booking tracking (no-login flow)
-- Run this in Supabase SQL editor.

alter table public.bookings
  add column if not exists guest_access_token text;

-- Only guests will have this token; ensure uniqueness when present.
create unique index if not exists bookings_guest_access_token_unique
  on public.bookings (guest_access_token)
  where guest_access_token is not null;

