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
