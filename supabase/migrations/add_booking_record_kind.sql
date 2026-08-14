-- Adds an independent classification for real and test bookings.
-- Existing bookings remain real until the psychologist deliberately marks them as test.
alter table public.bookings
  add column if not exists record_kind text not null default 'real';

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.bookings'::regclass
      and conname = 'bookings_record_kind_check'
  ) then
    alter table public.bookings
      add constraint bookings_record_kind_check check (record_kind in ('real', 'test'));
  end if;
end $$;

create index if not exists bookings_record_kind_date_idx
  on public.bookings (record_kind, visit_date desc, visit_time desc);

-- Test and cancelled records remain in the archive, but must not reserve a real slot.
drop index if exists public.bookings_location_date_time_unique_idx;
drop index if exists public.bookings_location_id_date_time_unique_idx;

create unique index bookings_location_date_time_unique_idx
  on public.bookings (location, visit_date, visit_time)
  where record_kind = 'real' and status <> 'Odwołane';

create unique index bookings_location_id_date_time_unique_idx
  on public.bookings (location_id, visit_date, visit_time)
  where location_id is not null
    and record_kind = 'real'
    and status <> 'Odwołane';
