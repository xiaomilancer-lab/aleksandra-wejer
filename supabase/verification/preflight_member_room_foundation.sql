-- Read-only preflight. Safe to run before create_member_room_foundation.sql.
-- Every statement below is SELECT-only.

select
  current_database() as database_name,
  current_user as database_user,
  current_schema() as current_schema,
  now() as checked_at,
  version() as postgres_version;

select
  required.relation_name,
  to_regclass('public.' || required.relation_name) as actual_relation,
  to_regclass('public.' || required.relation_name) is not null as exists
from (
  values
    ('profiles'),
    ('patients'),
    ('bookings')
) as required(relation_name)
order by required.relation_name;

select
  required.table_name,
  required.column_name,
  required.expected_type,
  columns.data_type as actual_type,
  columns.is_nullable,
  columns.column_default,
  columns.column_name is not null as exists,
  columns.data_type = required.expected_type as type_matches
from (
  values
    ('profiles', 'id', 'uuid'),
    ('profiles', 'role', 'text'),
    ('profiles', 'display_name', 'text'),
    ('patients', 'id', 'uuid'),
    ('bookings', 'id', 'bigint'),
    ('bookings', 'patient_id', 'uuid')
) as required(table_name, column_name, expected_type)
left join information_schema.columns columns
  on columns.table_schema = 'public'
 and columns.table_name = required.table_name
 and columns.column_name = required.column_name
order by required.table_name, required.column_name;

select
  role,
  count(*) as profile_count
from public.profiles
group by role
order by role nulls first;

select
  conname as constraint_name,
  pg_get_constraintdef(oid) as definition
from pg_constraint
where conrelid = 'public.profiles'::regclass
  and contype = 'c'
order by conname;

select
  target.relation_name,
  to_regclass('public.' || target.relation_name) as actual_relation,
  to_regclass('public.' || target.relation_name) is not null as already_exists
from (
  values
    ('member_patient_access'),
    ('member_access_invites'),
    ('member_room_items'),
    ('member_bulletins'),
    ('member_room_item_receipts'),
    ('appointment_change_requests'),
    ('family_content_cache')
) as target(relation_name)
order by target.relation_name;

select
  trigger_name,
  event_manipulation,
  action_timing,
  action_statement
from information_schema.triggers
where event_object_schema = 'auth'
  and event_object_table = 'users'
order by trigger_name;

select
  target.function_name,
  to_regprocedure(target.signature) as actual_function,
  to_regprocedure(target.signature) is not null as already_exists
from (
  values
    ('handle_new_member_profile', 'public.handle_new_member_profile()'),
    ('has_member_patient_access', 'public.has_member_patient_access(uuid)'),
    ('current_member_role', 'public.current_member_role()'),
    ('can_read_member_audience', 'public.can_read_member_audience(text)'),
    ('can_request_booking_change', 'public.can_request_booking_change(bigint,uuid)')
) as target(function_name, signature)
order by target.function_name;

select
  to_regprocedure('gen_random_uuid()') as gen_random_uuid_function,
  exists (
    select 1
    from pg_extension
    where extname = 'pgcrypto'
  ) as pgcrypto_installed;

select
  count(*) as booking_count,
  count(*) filter (where patient_id is not null) as bookings_linked_to_patient,
  count(*) filter (where patient_id is null) as bookings_without_patient
from public.bookings;
