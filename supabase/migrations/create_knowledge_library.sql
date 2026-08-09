-- Run manually in Supabase before enabling PsychOLKA Knowledge Library.

create extension if not exists pgcrypto;

create table if not exists public.knowledge_library (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null check (category in (
    'ADHD', 'Spektrum autyzmu', 'Mutyzm', 'Lęki', 'Depresja', 'Relacje',
    'Pary', 'Rodzina', 'Dzieci', 'Nastolatki', 'Dorośli', 'Uzależnienia',
    'Rozwój', 'Inne'
  )),
  description text not null default '',
  tags text[] not null default '{}',
  content text not null default '',
  is_pinned boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists knowledge_library_category_idx on public.knowledge_library (category);
create index if not exists knowledge_library_tags_idx on public.knowledge_library using gin (tags);
create index if not exists knowledge_library_pinned_idx on public.knowledge_library (is_pinned) where is_pinned = true;

-- A material can be manually pinned to many separate visits.
create table if not exists public.visit_knowledge_materials (
  visit_id bigint not null references public.bookings(id) on delete cascade,
  knowledge_id uuid not null references public.knowledge_library(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (visit_id, knowledge_id)
);

create index if not exists visit_knowledge_materials_visit_idx on public.visit_knowledge_materials (visit_id, created_at desc);

-- TODO: file/PDF storage should be added with Supabase Storage and a separate
-- attachment metadata table; no files are uploaded by this migration.
