-- Run manually in Supabase before enabling PsychOLKA Assistant templates.
create extension if not exists "pgcrypto";

create table if not exists public.assistant_templates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null default '',
  age_group text not null default '',
  problem_keywords text[] not null default '{}',
  description text not null default '',
  interview_checklist text not null default '',
  observation_points text not null default '',
  recommended_materials text not null default '',
  homework_examples text not null default '',
  notes text not null default '',
  is_favorite boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists assistant_templates_category_idx on public.assistant_templates (category);
create index if not exists assistant_templates_age_group_idx on public.assistant_templates (age_group);
create index if not exists assistant_templates_problem_keywords_idx on public.assistant_templates using gin (problem_keywords);
