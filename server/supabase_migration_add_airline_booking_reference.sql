-- Adds a place to store the airline-provided booking reference (PNR).
-- Luxel's existing `bookings.booking_reference` remains the internal tracking reference.

alter table public.bookings
  add column if not exists airline_booking_reference text;

-- Optional: capture airline booking timestamp (useful for auditing).
alter table public.bookings
  add column if not exists airline_booking_confirmed_at timestamptz;

create index if not exists bookings_airline_booking_reference_idx
  on public.bookings (airline_booking_reference);

