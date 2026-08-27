select
  exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'bookings'
      and column_name = 'visit_fee'
      and data_type = 'numeric'
  ) as visit_fee_exists,
  exists (
    select 1
    from pg_constraint
    where conrelid = 'public.bookings'::regclass
      and conname = 'bookings_visit_fee_check'
  ) as visit_fee_constraint_exists;

select column_default
from information_schema.columns
where table_schema = 'public'
  and table_name = 'bookings'
  and column_name = 'visit_fee';

select
  count(*) filter (where visit_fee is not null) as visits_with_fee,
  count(*) filter (where status is distinct from 'Odwołane' and visit_fee is null) as active_visits_without_fee,
  coalesce(sum(visit_fee) filter (where status = 'Zrealizowane'), 0) as completed_visit_value
from public.bookings
where record_kind = 'real';
