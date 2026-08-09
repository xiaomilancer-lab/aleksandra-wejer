-- This migration is prepared for manual execution in Supabase.
-- It creates an immutable-style event feed for the patient workspace.

create extension if not exists pgcrypto;

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

create index if not exists patient_timeline_patient_created_at_idx
  on public.patient_timeline(patient_id, created_at desc);

-- Optional control query after the migration:
-- select event_type, count(*) from public.patient_timeline group by event_type;
