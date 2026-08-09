-- Run manually in Supabase before enabling Parent Hub.
-- This migration deliberately creates no parent accounts and no parent-child links.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('psychologist', 'parent')),
  display_name text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.parent_child_access (
  id uuid primary key default gen_random_uuid(),
  parent_user_id uuid not null references public.profiles(id) on delete cascade,
  patient_id uuid not null references public.patients(id) on delete cascade,
  relationship_label text null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  created_by uuid null references auth.users(id) on delete set null,
  unique (parent_user_id, patient_id)
);

create index if not exists parent_child_access_parent_active_idx
  on public.parent_child_access (parent_user_id, patient_id)
  where is_active = true;

-- Future classification only. Existing records remain unclassified.
alter table public.patients
  add column if not exists date_of_birth date null,
  add column if not exists patient_type text null
    check (patient_type in ('child', 'teen', 'adult', 'couple', 'family'));

-- Only explicitly shared data may ever be read through Parent Hub.
create table if not exists public.parent_shared_items (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  type text not null check (type in ('material', 'homework', 'appointment_info', 'parent_message')),
  title text not null,
  content text not null default '',
  created_at timestamptz not null default now(),
  created_by uuid null references auth.users(id) on delete set null,
  is_visible boolean not null default false
);

create index if not exists parent_shared_items_visible_patient_idx
  on public.parent_shared_items (patient_id, created_at desc)
  where is_visible = true;

-- RLS: only own profile, active own access links, and explicitly shared items.
alter table public.profiles enable row level security;
alter table public.parent_child_access enable row level security;
alter table public.parent_shared_items enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select to authenticated using (id = auth.uid());

create policy "parent_child_access_select_own_active" on public.parent_child_access
  for select to authenticated using (parent_user_id = auth.uid() and is_active = true);

create policy "parent_shared_items_select_authorized" on public.parent_shared_items
  for select to authenticated using (
    is_visible = true
    and exists (
      select 1 from public.parent_child_access access
      where access.patient_id = parent_shared_items.patient_id
        and access.parent_user_id = auth.uid()
        and access.is_active = true
    )
  );

-- No parent write policies are intentionally added. Profiles, links and shared
-- items must be provisioned by trusted staff/backend code. Service role retains
-- its server-side administrative access and must never reach the browser.

-- Never add parent RLS policies directly to patient_notes, clinical_reflections,
-- reflection_cards, patient_memory, visit_plan or any therapist-private table.
