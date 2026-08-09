-- Run manually in Supabase before enabling partner booking widgets.
alter table public.bookings add column if not exists source text;
create index if not exists bookings_source_idx on public.bookings(source);
