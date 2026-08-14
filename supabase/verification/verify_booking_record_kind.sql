select
  cols.column_name,
  cols.data_type,
  cols.is_nullable,
  cols.column_default,
  (cols.column_name is not null) as exists
from (values ('record_kind')) as required(column_name)
left join information_schema.columns cols
  on cols.table_schema = 'public'
 and cols.table_name = 'bookings'
 and cols.column_name = required.column_name;

select
  (select count(*) from pg_constraint
   where conrelid = 'public.bookings'::regclass
     and conname = 'bookings_record_kind_check') as check_constraint_count,
  (select count(*) from pg_indexes
   where schemaname = 'public'
     and tablename = 'bookings'
     and indexname = 'bookings_record_kind_date_idx') as index_count;

select record_kind, count(*) as booking_count
from public.bookings
group by record_kind
order by record_kind;

select
  indexname,
  indexdef,
  (indexdef ilike '%record_kind%real%'
    and indexdef ilike '%status%Odwołane%') as ignores_test_and_cancelled
from pg_indexes
where schemaname = 'public'
  and tablename = 'bookings'
  and indexname in (
    'bookings_location_date_time_unique_idx',
    'bookings_location_id_date_time_unique_idx'
  )
order by indexname;
