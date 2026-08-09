-- Run manually in Supabase before enabling Follow-up rules.
create extension if not exists "pgcrypto";

create table if not exists public.followup_rules (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  days_after_visit integer not null check (days_after_visit > 0),
  message_template text not null default '',
  is_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists followup_rules_enabled_idx
  on public.followup_rules (is_enabled);
