-- This migration is prepared for manual execution in Supabase.
-- It creates therapeutic notes without changing existing patient or booking data.

create extension if not exists pgcrypto;

-- Each note belongs to one patient and can optionally be connected to a visit.
create table if not exists public.patient_notes (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  visit_id bigint null references public.bookings(id) on delete set null,
  title text not null,
  content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Patient cards load their notes by patient and newest modification first.
create index if not exists patient_notes_patient_updated_at_idx
  on public.patient_notes(patient_id, updated_at desc);

-- Optional control query after the migration:
-- select count(*) as patient_notes_count from public.patient_notes;
