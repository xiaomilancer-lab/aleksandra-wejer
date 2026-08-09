-- Follow-up reminders are private prompts for the psychologist to revisit a topic.
-- `visit_id` identifies the visit where the reminder was created; the next visit
-- is resolved dynamically from the patient's upcoming bookings.
create extension if not exists pgcrypto;

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

create index if not exists followup_reminders_patient_status_idx
  on public.followup_reminders (patient_id, status, created_at desc);

create index if not exists followup_reminders_visit_idx
  on public.followup_reminders (visit_id);

-- TODO: add the project's standard RLS policies before exposing this data outside
-- the authenticated psychologist workspace.
