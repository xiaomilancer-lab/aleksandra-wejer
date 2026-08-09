-- Mood Journey records a patient's self-reported daily mood without interpretation.
create extension if not exists pgcrypto;

create table if not exists public.mood_entries (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  date date not null default current_date,
  mood text not null check (mood in ('happy', 'good', 'neutral', 'sad', 'angry', 'anxious')),
  note text null,
  created_at timestamptz not null default now(),
  unique (patient_id, date)
);

create index if not exists mood_entries_patient_date_idx
  on public.mood_entries (patient_id, date desc);

-- TODO: before a patient-facing screen is enabled, add RLS policies bound to the
-- authenticated patient/parent relationship. Do not expose mood_entries directly
-- through a public client.
