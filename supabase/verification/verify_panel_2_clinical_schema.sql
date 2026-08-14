-- Read-only postflight for reconcile_panel_2_clinical_schema.sql.

select
  required.table_name,
  to_regclass('public.' || required.table_name) as relation_name,
  to_regclass('public.' || required.table_name) is not null as exists
from (values
  ('patient_notes'),
  ('patient_tasks'),
  ('patient_timeline'),
  ('patient_memory'),
  ('followup_rules'),
  ('followup_reminders'),
  ('visit_plan'),
  ('visit_reflections'),
  ('reflection_cards'),
  ('visit_templates'),
  ('knowledge_library'),
  ('visit_knowledge_materials')
) as required(table_name)
order by required.table_name;

with required(column_name) as (values
  ('review_request_sent'),
  ('review_request_sent_at'),
  ('review_request_scheduled_at'),
  ('review_response'),
  ('google_review_clicked_at'),
  ('private_feedback')
)
select
  required.column_name,
  columns.data_type,
  columns.is_nullable,
  columns.column_default,
  columns.column_name is not null as exists
from required
left join information_schema.columns columns
  on columns.table_schema = 'public'
 and columns.table_name = 'patients'
 and columns.column_name = required.column_name
order by required.column_name;

select
  tables.tablename,
  tables.rowsecurity as rls_enabled,
  policies.policyname,
  policies.roles,
  policies.cmd,
  policies.qual,
  policies.with_check
from pg_tables tables
left join pg_policies policies
  on policies.schemaname = tables.schemaname
 and policies.tablename = tables.tablename
 and policies.policyname = 'psychologist_clinical_access'
where tables.schemaname = 'public'
  and tables.tablename in (
    'patient_notes', 'patient_tasks', 'patient_timeline', 'patient_memory',
    'followup_rules', 'followup_reminders', 'visit_plan', 'visit_reflections',
    'reflection_cards', 'visit_templates', 'knowledge_library', 'visit_knowledge_materials'
  )
order by tables.tablename;

select
  table_name,
  grantee,
  privilege_type
from information_schema.role_table_grants
where table_schema = 'public'
  and table_name in (
    'patient_notes', 'patient_tasks', 'patient_timeline', 'patient_memory',
    'followup_rules', 'followup_reminders', 'visit_plan', 'visit_reflections',
    'reflection_cards', 'visit_templates', 'knowledge_library', 'visit_knowledge_materials'
  )
  and grantee in ('anon', 'authenticated', 'service_role')
order by table_name, grantee, privilege_type;

select
  routine_schema,
  routine_name,
  grantee,
  privilege_type
from information_schema.role_routine_grants
where routine_schema = 'public'
  and routine_name = 'is_psychologist'
  and grantee in ('PUBLIC', 'anon', 'authenticated', 'service_role')
order by grantee;

select
  enumlabel,
  enumsortorder
from pg_enum
where enumtypid = to_regtype('public.patient_timeline_event_type')
order by enumsortorder;

select
  tables.relname as table_name,
  constraints.conname as constraint_name,
  case constraints.contype
    when 'p' then 'PRIMARY KEY'
    when 'u' then 'UNIQUE'
    when 'f' then 'FOREIGN KEY'
    when 'c' then 'CHECK'
    else constraints.contype::text
  end as constraint_type,
  pg_get_constraintdef(constraints.oid, true) as definition
from pg_constraint constraints
join pg_class tables
  on tables.oid = constraints.conrelid
join pg_namespace schemas
  on schemas.oid = tables.relnamespace
where schemas.nspname = 'public'
  and tables.relname in (
    'patients', 'patient_notes', 'patient_tasks', 'patient_timeline', 'patient_memory',
    'followup_rules', 'followup_reminders', 'visit_plan', 'visit_reflections',
    'reflection_cards', 'visit_templates', 'knowledge_library', 'visit_knowledge_materials'
  )
order by tables.relname, constraint_type, constraint_name;

select
  tablename,
  indexname,
  indexdef
from pg_indexes
where schemaname = 'public'
  and tablename in (
    'patients', 'patient_notes', 'patient_tasks', 'patient_timeline', 'patient_memory',
    'followup_rules', 'followup_reminders', 'visit_plan', 'visit_reflections',
    'reflection_cards', 'visit_templates', 'knowledge_library', 'visit_knowledge_materials'
  )
order by tablename, indexname;

select
  table_name,
  grantee,
  privilege_type
from information_schema.role_table_grants
where table_schema = 'public'
  and table_name in (
    'patient_notes', 'patient_tasks', 'patient_timeline', 'patient_memory',
    'followup_rules', 'followup_reminders', 'visit_plan', 'visit_reflections',
    'reflection_cards', 'visit_templates', 'knowledge_library', 'visit_knowledge_materials'
  )
  and grantee = 'anon';
