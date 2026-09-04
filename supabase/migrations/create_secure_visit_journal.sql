-- Wizytownik psychOLKI: encrypted visit-note storage.
-- Run this migration manually in the Supabase SQL editor before enabling the app.
-- The note body is encrypted by the application before it reaches this table.

begin;

create extension if not exists pgcrypto;

alter table public.patients
  add column if not exists journal_alias text null;

create table if not exists public.secure_visit_notes (
  id uuid primary key,
  patient_id uuid not null references public.patients(id) on delete cascade,
  visit_id bigint null references public.bookings(id) on delete set null,
  psychologist_id uuid not null,
  occurred_on date not null,
  ciphertext text not null,
  iv text not null,
  auth_tag text not null,
  key_version smallint not null default 1 check (key_version > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (char_length(ciphertext) between 1 and 200000),
  check (char_length(iv) between 12 and 64),
  check (char_length(auth_tag) between 16 and 64)
);

create index if not exists secure_visit_notes_patient_date_idx
  on public.secure_visit_notes(patient_id, occurred_on desc, updated_at desc);

create index if not exists secure_visit_notes_psychologist_idx
  on public.secure_visit_notes(psychologist_id, updated_at desc);

create table if not exists public.secure_journal_audit (
  id bigint generated always as identity primary key,
  psychologist_id uuid not null,
  patient_id uuid null,
  note_id uuid null,
  action text not null check (action in (
    'note_created', 'note_updated', 'note_deleted',
    'history_viewed', 'history_exported', 'patient_created'
  )),
  created_at timestamptz not null default now()
);

create index if not exists secure_journal_audit_actor_time_idx
  on public.secure_journal_audit(psychologist_id, created_at desc);

-- The browser and authenticated Supabase clients never receive direct table access.
-- Every operation goes through a server route which verifies the psychologist role.
alter table public.secure_visit_notes enable row level security;
alter table public.secure_journal_audit enable row level security;

revoke all on table public.secure_visit_notes from public, anon, authenticated;
revoke all on table public.secure_journal_audit from public, anon, authenticated;
grant select, insert, update, delete on table public.secure_visit_notes to service_role;
grant select, insert on table public.secure_journal_audit to service_role;
grant usage, select on sequence public.secure_journal_audit_id_seq to service_role;

commit;

-- Verification (run separately):
-- select tablename, rowsecurity from pg_tables
-- where schemaname = 'public' and tablename in ('secure_visit_notes', 'secure_journal_audit');
-- select grantee, privilege_type from information_schema.role_table_grants
-- where table_schema = 'public' and table_name in ('secure_visit_notes', 'secure_journal_audit');
