-- Run manually after resolving any existing duplicate bookings.
create unique index if not exists bookings_location_date_time_unique_idx on public.bookings(location, visit_date, visit_time);
