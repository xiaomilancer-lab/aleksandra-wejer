-- Read-only verification for create_member_room_foundation.sql.

select
  to_regclass('public.member_patient_access') as member_patient_access,
  to_regclass('public.member_access_invites') as member_access_invites,
  to_regclass('public.member_room_items') as member_room_items,
  to_regclass('public.member_bulletins') as member_bulletins,
  to_regclass('public.member_room_item_receipts') as member_room_item_receipts,
  to_regclass('public.appointment_change_requests') as appointment_change_requests,
  to_regclass('public.family_content_cache') as family_content_cache;

select
  conname,
  pg_get_constraintdef(oid) as definition
from pg_constraint
where conrelid = 'public.profiles'::regclass
  and contype = 'c'
order by conname;

select
  trigger_name,
  event_manipulation,
  action_timing
from information_schema.triggers
where event_object_schema = 'auth'
  and event_object_table = 'users'
  and trigger_name = 'on_auth_user_created_member_profile';

select
  c.relname as table_name,
  c.relrowsecurity as rls_enabled,
  count(p.policyname) as policy_count
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
left join pg_policies p
  on p.schemaname = n.nspname
 and p.tablename = c.relname
where n.nspname = 'public'
  and c.relname in (
    'member_patient_access',
    'member_access_invites',
    'member_room_items',
    'member_bulletins',
    'member_room_item_receipts',
    'appointment_change_requests',
    'family_content_cache'
  )
group by c.relname, c.relrowsecurity
order by c.relname;

select
  tablename,
  policyname,
  roles,
  cmd,
  qual,
  with_check
from pg_policies
where schemaname = 'public'
  and tablename in (
    'member_patient_access',
    'member_access_invites',
    'member_room_items',
    'member_bulletins',
    'member_room_item_receipts',
    'appointment_change_requests',
    'family_content_cache'
  )
order by tablename, policyname;

select
  table_name,
  count(*) filter (where grantee = 'anon') as anon_privileges,
  count(*) filter (
    where grantee = 'authenticated'
      and privilege_type not in ('SELECT', 'INSERT', 'UPDATE')
  ) as authenticated_unexpected,
  string_agg(
    privilege_type,
    ', ' order by privilege_type
  ) filter (where grantee = 'authenticated') as authenticated_privileges
from information_schema.role_table_grants
where table_schema = 'public'
  and table_name in (
    'member_patient_access',
    'member_access_invites',
    'member_room_items',
    'member_bulletins',
    'member_room_item_receipts',
    'appointment_change_requests',
    'family_content_cache'
  )
  and grantee in ('anon', 'authenticated')
group by table_name
order by table_name;

select
  routine_name,
  grantee,
  privilege_type
from information_schema.role_routine_grants
where routine_schema = 'public'
  and routine_name in (
    'has_member_patient_access',
    'current_member_role',
    'can_read_member_audience',
    'can_request_booking_change',
    'handle_new_member_profile'
  )
  and grantee in ('PUBLIC', 'anon', 'authenticated', 'service_role')
order by routine_name, grantee;

select
  (select count(*) from public.member_patient_access) as access_count,
  (select count(*) from public.member_access_invites) as invite_count,
  (select count(*) from public.member_room_items) as private_item_count,
  (select count(*) from public.member_bulletins) as bulletin_count,
  (select count(*) from public.appointment_change_requests) as change_request_count,
  (select count(*) from public.family_content_cache) as cache_count;
