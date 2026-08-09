-- Run manually in Supabase before enabling therapy templates in production.
create extension if not exists "pgcrypto";

create table if not exists public.visit_templates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null default '',
  description text not null default '',
  note_template text not null default '',
  homework_template text not null default '',
  is_favorite boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists visit_templates_favorite_idx
  on public.visit_templates (is_favorite);
