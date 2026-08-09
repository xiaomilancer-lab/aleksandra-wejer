-- This migration is prepared for manual execution in Supabase.
-- It creates homework tasks without modifying existing patient or booking data.

create extension if not exists pgcrypto;

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

-- The patient workspace loads tasks for one patient, newest updates first.
create index if not exists patient_tasks_patient_updated_at_idx
  on public.patient_tasks(patient_id, updated_at desc);

-- Optional control query after the migration:
-- select status, count(*) from public.patient_tasks group by status;
