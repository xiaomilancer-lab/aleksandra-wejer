begin;

alter table public.bookings
  add column if not exists visit_fee numeric(10, 2) null;

alter table public.bookings
  alter column visit_fee set default 150.00;

-- Uzupełnia zarówno odbyte, jak i nadchodzące prawdziwe wizyty.
-- Odwołane i testowe rekordy celowo nie otrzymują domyślnej kwoty.
update public.bookings
set visit_fee = 150.00
where visit_fee is null
  and record_kind = 'real'
  and status is distinct from 'Odwołane';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.bookings'::regclass
      and conname = 'bookings_visit_fee_check'
  ) then
    alter table public.bookings
      add constraint bookings_visit_fee_check
      check (visit_fee is null or (visit_fee >= 0 and visit_fee <= 999999.99));
  end if;
end $$;

comment on column public.bookings.visit_fee is
  'Orientacyjna kwota wizyty w PLN, domyślnie 150. Nie jest dokumentem księgowym ani potwierdzeniem płatności.';

commit;
