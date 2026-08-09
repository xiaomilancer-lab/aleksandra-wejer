-- Run manually in Supabase before enabling Clinical Reflection.
create extension if not exists "pgcrypto";

create table if not exists public.reflection_cards (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  visit_id bigint references public.bookings(id) on delete set null,
  title text not null,
  content text not null default '',
  category text not null,
  is_important boolean not null default false,
  is_pinned_to_next_visit boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists reflection_cards_patient_created_idx
  on public.reflection_cards (patient_id, created_at desc);
create index if not exists reflection_cards_pinned_idx
  on public.reflection_cards (patient_id, is_pinned_to_next_visit);
