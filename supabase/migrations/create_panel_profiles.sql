-- Panel access foundation. Run manually in Supabase before enabling panel login.
-- This migration does not create users and does not grant psychologist access
-- automatically. A trusted administrator must explicitly assign the role below.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('psychologist', 'parent')),
  display_name text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select to authenticated using (id = auth.uid());

-- Required one-time trusted setup after this migration:
-- insert into public.profiles (id, role, display_name)
-- values ('<AUTH_USER_UUID>', 'psychologist', 'Aleksandra Wejer')
-- on conflict (id) do update set role = excluded.role, display_name = excluded.display_name;
