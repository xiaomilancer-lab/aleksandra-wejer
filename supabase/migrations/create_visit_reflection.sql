-- Run manually in Supabase before enabling Emotion Journey.
create extension if not exists "pgcrypto";

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

create index if not exists visit_reflections_patient_created_idx
  on public.visit_reflections (patient_id, created_at desc);
