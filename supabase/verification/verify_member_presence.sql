-- Read-only verification for create_member_presence.sql.

select
  to_regclass('public.member_presence') as relation_name,
  c.relrowsecurity as rls_enabled
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relname = 'member_presence';

select
  column_name,
  data_type,
  is_nullable
from information_schema.columns
where table_schema = 'public'
  and table_name = 'member_presence'
order by ordinal_position;

select
  count(*) filter (where grantee = 'anon') as anon_privileges,
  count(*) filter (where grantee = 'authenticated') as authenticated_privileges,
  count(*) filter (where grantee = 'service_role') as service_role_privileges
from information_schema.role_table_grants
where table_schema = 'public'
  and table_name = 'member_presence';

select count(*) as presence_row_count
from public.member_presence;
