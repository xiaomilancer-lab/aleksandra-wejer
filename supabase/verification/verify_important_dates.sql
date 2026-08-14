-- Read-only verification for the Important Dates foundation.
select
  to_regclass('public.important_dates') as relation_name,
  to_regclass('public.important_dates') is not null as exists;

select column_name, data_type, is_nullable, column_default
from information_schema.columns
where table_schema = 'public' and table_name = 'important_dates'
order by ordinal_position;

select c.relrowsecurity as rls_enabled, c.relforcerowsecurity as rls_forced
from pg_class c join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public' and c.relname = 'important_dates';

select policyname, roles, cmd, qual, with_check
from pg_policies
where schemaname = 'public' and tablename = 'important_dates';

select grantee, privilege_type
from information_schema.role_table_grants
where table_schema = 'public' and table_name = 'important_dates'
order by grantee, privilege_type;

select indexname, indexdef
from pg_indexes
where schemaname = 'public' and tablename = 'important_dates'
order by indexname;

select count(*) as row_count from public.important_dates;
