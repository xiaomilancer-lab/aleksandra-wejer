-- Lightweight online presence for authenticated PsychOLKA member rooms.
-- No clinical data is stored here. Run manually in Supabase SQL Editor.

begin;

create table if not exists public.member_presence (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  last_seen_at timestamptz not null default now(),
  current_path text null,
  check (current_path is null or (char_length(current_path) between 1 and 200))
);

create index if not exists member_presence_last_seen_idx
  on public.member_presence (last_seen_at desc);

alter table public.member_presence enable row level security;

-- Presence is written and read only by verified server routes using service_role.
-- Members cannot enumerate or alter the presence of other accounts directly.
revoke all on table public.member_presence from anon, authenticated;
grant select, insert, update, delete on table public.member_presence to service_role;

commit;
