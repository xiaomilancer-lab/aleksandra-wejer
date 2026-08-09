-- psychOLKA Panel Security Hardening v1
-- Run manually in the Supabase SQL editor after create_parent_hub_foundation.sql
-- and the listed clinical-table migrations. This migration intentionally does
-- not create any new tables and does not grant parent access to clinical data.

create or replace function public.is_psychologist()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'psychologist'
  );
$$;

revoke all on function public.is_psychologist() from public;
grant execute on function public.is_psychologist() to authenticated;

do $$
declare
  clinical_table text;
begin
  foreach clinical_table in array array[
    'patients',
    'bookings',
    'patient_notes',
    'patient_tasks',
    'patient_timeline',
    'visit_plan',
    'visit_reflections',
    'followup_reminders',
    'visit_knowledge_materials',
    'reflection_cards',
    'patient_memory',
    'mood_entries',
    'knowledge_library',
    'visit_templates',
    'assistant_templates',
    'availability_rules',
    'availability_exceptions'
  ]
  loop
    if to_regclass('public.' || clinical_table) is not null then
      execute format('alter table public.%I enable row level security', clinical_table);
      execute format('drop policy if exists psychologist_clinical_access on public.%I', clinical_table);
      execute format(
        'create policy psychologist_clinical_access on public.%I for all to authenticated using (public.is_psychologist()) with check (public.is_psychologist())',
        clinical_table
      );
    end if;
  end loop;
end $$;

-- Verification queries for the SQL editor (run after the migration):
-- select tablename, rowsecurity from pg_tables where schemaname = 'public'
--   and tablename in ('patients','bookings','patient_notes','patient_tasks','patient_timeline','visit_plan','visit_reflections','followup_reminders','visit_knowledge_materials');
-- select tablename, policyname, roles from pg_policies where schemaname = 'public'
--   and policyname = 'psychologist_clinical_access';
