-- Read-only verification for create_member_legal_acceptances.sql.

select
  to_regclass('public.member_legal_acceptances') as relation_name,
  c.relrowsecurity as rls_enabled
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relname = 'member_legal_acceptances';

select
  trigger_name,
  event_manipulation,
  action_timing
from information_schema.triggers
where event_object_schema = 'auth'
  and event_object_table = 'users'
  and trigger_name = 'on_auth_user_created_legal_acceptance';

select
  count(*) filter (where grantee = 'anon') as anon_privileges,
  count(*) filter (where grantee = 'authenticated') as authenticated_privileges,
  string_agg(privilege_type, ', ' order by privilege_type) filter (where grantee = 'service_role') as service_role_privileges
from information_schema.role_table_grants
where table_schema = 'public'
  and table_name = 'member_legal_acceptances'
  and grantee in ('anon', 'authenticated', 'service_role');

select count(*) as acceptance_count
from public.member_legal_acceptances;
