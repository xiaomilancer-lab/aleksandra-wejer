-- Read-only verification for create_inbound_email_inbox.sql.

select
  to_regclass('public.inbound_emails') as relation_name,
  c.relrowsecurity as rls_enabled
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relname = 'inbound_emails';

select
  count(*) as column_count,
  count(*) filter (where column_name = 'resend_email_id' and data_type = 'text' and is_nullable = 'NO') as resend_id_column_count,
  count(*) filter (where column_name = 'body_text' and data_type = 'text' and is_nullable = 'NO') as body_column_count,
  count(*) filter (where column_name = 'retention_until' and data_type = 'timestamp with time zone' and is_nullable = 'NO') as retention_column_count
from information_schema.columns
where table_schema = 'public'
  and table_name = 'inbound_emails';

select
  count(*) filter (where grantee = 'anon') as anon_privileges,
  count(*) filter (where grantee = 'authenticated') as authenticated_privileges,
  count(*) filter (where grantee = 'service_role') as service_role_privileges
from information_schema.role_table_grants
where table_schema = 'public'
  and table_name = 'inbound_emails';

select
  count(*) as email_count,
  count(*) filter (where is_read = false and archived_at is null) as unread_count
from public.inbound_emails;
