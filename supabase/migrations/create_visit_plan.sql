-- Run manually in Supabase before enabling Smart Session Planner.
create extension if not exists "pgcrypto";

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

create index if not exists visit_plan_patient_idx on public.visit_plan (patient_id);
