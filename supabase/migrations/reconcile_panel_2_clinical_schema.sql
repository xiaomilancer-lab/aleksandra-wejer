-- Panel 2.0 production schema reconciliation.
-- Run as one statement batch in the Supabase SQL editor.
-- PostgreSQL aborts and rolls back the whole transaction on any error.

begin;

do $$
begin
  if to_regclass('public.patients') is null then
    raise exception 'Required table public.patients is missing';
  end if;
  if to_regclass('public.bookings') is null then
    raise exception 'Required table public.bookings is missing';
  end if;
  if to_regclass('public.profiles') is null then
    raise exception 'Required table public.profiles is missing';
  end if;
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'profiles' and column_name = 'role'
  ) then
    raise exception 'Required column public.profiles.role is missing';
  end if;
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'patients' and column_name = 'updated_at'
  ) then
    raise exception 'Required column public.patients.updated_at is missing';
  end if;
end $$;

create extension if not exists pgcrypto;

alter table public.patients
  add column if not exists review_request_sent boolean not null default false,
  add column if not exists review_request_sent_at timestamptz null,
  add column if not exists review_response text null
    check (review_response in ('google', 'private_feedback')),
  add column if not exists google_review_clicked_at timestamptz null,
  add column if not exists private_feedback text null,
  add column if not exists review_request_scheduled_at timestamptz null;

create index if not exists patients_review_request_schedule_idx
  on public.patients (review_request_scheduled_at)
  where review_request_sent = false;
create index if not exists patients_private_feedback_idx
  on public.patients (updated_at desc)
  where private_feedback is not null;

do $$
begin
  create type public.patient_timeline_event_type as enum (
    'visit_created',
    'visit_completed',
    'status_changed',
    'note_created',
    'note_updated',
    'task_created',
    'task_completed',
    'document_added',
    'review_sent',
    'review_received',
    'email_sent',
    'patient_created'
  );
exception
  when duplicate_object then null;
end $$;

create table if not exists public.patient_notes (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  visit_id bigint null references public.bookings(id) on delete set null,
  title text not null,
  content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.patient_notes enable row level security;

create index if not exists patient_notes_patient_updated_at_idx
  on public.patient_notes (patient_id, updated_at desc);

create table if not exists public.patient_tasks (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  visit_id bigint null references public.bookings(id) on delete set null,
  title text not null,
  description text not null default '',
  status text not null default 'todo' check (status in ('todo', 'in_progress', 'completed')),
  due_date date null,
  completed_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.patient_tasks enable row level security;

create index if not exists patient_tasks_patient_updated_at_idx
  on public.patient_tasks (patient_id, updated_at desc);

create table if not exists public.patient_timeline (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  visit_id bigint null references public.bookings(id) on delete set null,
  event_type public.patient_timeline_event_type not null,
  title text not null,
  description text not null default '',
  metadata jsonb null,
  created_at timestamptz not null default now()
);
alter table public.patient_timeline enable row level security;

create index if not exists patient_timeline_patient_created_at_idx
  on public.patient_timeline (patient_id, created_at desc);

create table if not exists public.patient_memory (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  category text not null check (category in ('Rodzina', 'Szkoła', 'Praca', 'Hobby', 'Zdrowie', 'Relacje', 'Cele', 'Inne')),
  title text not null,
  content text not null default '',
  is_pinned boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.patient_memory enable row level security;

create index if not exists patient_memory_patient_pinned_idx
  on public.patient_memory (patient_id, is_pinned, updated_at desc);

create table if not exists public.followup_rules (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  days_after_visit integer not null check (days_after_visit > 0),
  message_template text not null default '',
  is_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.followup_rules enable row level security;

create index if not exists followup_rules_enabled_idx
  on public.followup_rules (is_enabled);

create table if not exists public.followup_reminders (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  visit_id bigint null references public.bookings(id) on delete set null,
  title text not null check (char_length(trim(title)) > 0),
  description text not null default '',
  status text not null default 'open' check (status in ('open', 'done', 'dismissed')),
  created_at timestamptz not null default now(),
  completed_at timestamptz null
);
alter table public.followup_reminders enable row level security;

create index if not exists followup_reminders_patient_status_idx
  on public.followup_reminders (patient_id, status, created_at desc);
create index if not exists followup_reminders_visit_idx
  on public.followup_reminders (visit_id);

create table if not exists public.visit_plan (
  id uuid primary key default gen_random_uuid(),
  visit_id bigint not null unique references public.bookings(id) on delete cascade,
  patient_id uuid not null references public.patients(id) on delete cascade,
  main_goal text not null default '',
  secondary_goal text not null default '',
  topics_to_discuss text not null default '',
  homework_to_review text not null default '',
  materials_to_prepare text not null default '',
  own_notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.visit_plan enable row level security;

create index if not exists visit_plan_patient_idx
  on public.visit_plan (patient_id);

create table if not exists public.visit_reflections (
  id uuid primary key default gen_random_uuid(),
  visit_id bigint not null references public.bookings(id) on delete cascade,
  patient_id uuid not null references public.patients(id) on delete cascade,
  mood_level integer not null check (mood_level between 1 and 5),
  energy_level integer not null check (energy_level between 1 and 5),
  engagement_level integer not null check (engagement_level between 1 and 5),
  reflection text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (visit_id)
);
alter table public.visit_reflections enable row level security;

create index if not exists visit_reflections_patient_created_idx
  on public.visit_reflections (patient_id, created_at desc);

create table if not exists public.reflection_cards (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  visit_id bigint null references public.bookings(id) on delete set null,
  title text not null,
  content text not null default '',
  category text not null,
  is_important boolean not null default false,
  is_pinned_to_next_visit boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.reflection_cards enable row level security;

create index if not exists reflection_cards_patient_created_idx
  on public.reflection_cards (patient_id, created_at desc);
create index if not exists reflection_cards_pinned_idx
  on public.reflection_cards (patient_id, is_pinned_to_next_visit);

create table if not exists public.visit_templates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null default '',
  description text not null default '',
  note_template text not null default '',
  homework_template text not null default '',
  is_favorite boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.visit_templates enable row level security;

create index if not exists visit_templates_favorite_idx
  on public.visit_templates (is_favorite);

create table if not exists public.knowledge_library (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null check (category in (
    'ADHD', 'Spektrum autyzmu', 'Mutyzm', 'Lęki', 'Depresja', 'Relacje',
    'Pary', 'Rodzina', 'Dzieci', 'Nastolatki', 'Dorośli', 'Uzależnienia',
    'Rozwój', 'Inne'
  )),
  description text not null default '',
  tags text[] not null default '{}',
  content text not null default '',
  is_pinned boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.knowledge_library enable row level security;

create index if not exists knowledge_library_category_idx
  on public.knowledge_library (category);
create index if not exists knowledge_library_tags_idx
  on public.knowledge_library using gin (tags);
create index if not exists knowledge_library_pinned_idx
  on public.knowledge_library (is_pinned) where is_pinned = true;

create table if not exists public.visit_knowledge_materials (
  visit_id bigint not null references public.bookings(id) on delete cascade,
  knowledge_id uuid not null references public.knowledge_library(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (visit_id, knowledge_id)
);
alter table public.visit_knowledge_materials enable row level security;

create index if not exists visit_knowledge_materials_visit_idx
  on public.visit_knowledge_materials (visit_id, created_at desc);

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

revoke all on function public.is_psychologist() from public, anon, authenticated;
grant execute on function public.is_psychologist() to authenticated, service_role;

revoke all on type public.patient_timeline_event_type from public, anon, authenticated;
grant usage on type public.patient_timeline_event_type to authenticated, service_role;

do $$
declare
  clinical_table text;
begin
  foreach clinical_table in array array[
    'patient_notes',
    'patient_tasks',
    'patient_timeline',
    'patient_memory',
    'followup_rules',
    'followup_reminders',
    'visit_plan',
    'visit_reflections',
    'reflection_cards',
    'visit_templates',
    'knowledge_library',
    'visit_knowledge_materials'
  ]
  loop
    execute format('alter table public.%I enable row level security', clinical_table);
    execute format('revoke all on table public.%I from public, anon, authenticated', clinical_table);
    execute format('grant select, insert, update, delete on table public.%I to authenticated', clinical_table);
    execute format('grant select, insert, update, delete on table public.%I to service_role', clinical_table);
    execute format('drop policy if exists psychologist_clinical_access on public.%I', clinical_table);
    execute format(
      'create policy psychologist_clinical_access on public.%I for all to authenticated using (public.is_psychologist()) with check (public.is_psychologist())',
      clinical_table
    );
  end loop;
end $$;

commit;
