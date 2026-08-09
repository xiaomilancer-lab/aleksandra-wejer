-- Run manually in Supabase before enabling PsychOLKA Memory.
create extension if not exists "pgcrypto";

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

create index if not exists patient_memory_patient_pinned_idx on public.patient_memory (patient_id, is_pinned, updated_at desc);
