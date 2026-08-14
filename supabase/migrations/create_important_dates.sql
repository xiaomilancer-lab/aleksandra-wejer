-- Private, non-clinical important dates for the psychologist.
-- Run manually in Supabase only after the application Preview has been verified.
begin;

create extension if not exists "pgcrypto";

create table if not exists public.important_dates (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 120),
  person_name text not null default '' check (char_length(person_name) <= 120),
  occasion text not null check (occasion in ('birthday', 'anniversary', 'holiday', 'celebration', 'other')),
  event_date date not null,
  recurs_yearly boolean not null default true,
  reminder_days integer[] not null default array[14, 7, 1],
  gift_notes text not null default '',
  notes text not null default '',
  last_completed_occurrence date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint important_dates_reminder_days_check check (
    reminder_days <@ array[30, 14, 7, 1, 0]
    and cardinality(reminder_days) <= 5
  )
);

create index if not exists important_dates_event_date_idx on public.important_dates (event_date);

alter table public.important_dates enable row level security;

drop policy if exists psychologist_important_dates_access on public.important_dates;
create policy psychologist_important_dates_access
  on public.important_dates
  for all
  to authenticated
  using (public.is_psychologist())
  with check (public.is_psychologist());

revoke all on table public.important_dates from anon;
revoke all on table public.important_dates from authenticated;
grant select, insert, update, delete on table public.important_dates to authenticated;
grant select, insert, update, delete on table public.important_dates to service_role;

commit;
