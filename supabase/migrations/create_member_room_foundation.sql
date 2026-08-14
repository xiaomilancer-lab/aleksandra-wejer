-- Foundation for the future PsychOLKA mobile/web member room.
-- Run manually in Supabase only after reviewing verify_member_room_foundation.sql.
-- This migration creates no patient links, sends no messages and exposes no
-- therapist-private clinical data.

begin;

create extension if not exists pgcrypto;

do $$
begin
  if to_regclass('public.profiles') is null then
    raise exception 'Required table public.profiles is missing';
  end if;
  if to_regclass('public.patients') is null then
    raise exception 'Required table public.patients is missing';
  end if;
  if to_regclass('public.bookings') is null then
    raise exception 'Required table public.bookings is missing';
  end if;
end
$$;

-- Public registration may request only patient or parent. The psychologist
-- role remains a trusted, manually assigned role.
alter table public.profiles
  drop constraint if exists profiles_role_check;

alter table public.profiles
  add constraint profiles_role_check
  check (role in ('psychologist', 'patient', 'parent'));

create or replace function public.handle_new_member_profile()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  requested_role text := new.raw_user_meta_data ->> 'requested_role';
  requested_name text := nullif(trim(new.raw_user_meta_data ->> 'display_name'), '');
begin
  -- Never accept psychologist from user-controlled sign-up metadata.
  if requested_role is null or requested_role not in ('patient', 'parent') then
    return new;
  end if;

  insert into public.profiles (id, role, display_name)
  values (
    new.id,
    requested_role,
    left(coalesce(requested_name, split_part(coalesce(new.email, ''), '@', 1)), 120)
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

revoke all on function public.handle_new_member_profile() from public, anon, authenticated;

drop trigger if exists on_auth_user_created_member_profile on auth.users;
create trigger on_auth_user_created_member_profile
  after insert on auth.users
  for each row execute function public.handle_new_member_profile();

-- One account may represent an adult patient or a parent/guardian. Access is
-- inactive until a trusted staff action links it to a patient record.
create table if not exists public.member_patient_access (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  patient_id uuid not null references public.patients(id) on delete cascade,
  access_role text not null check (access_role in ('patient', 'parent')),
  relationship_label text null,
  status text not null default 'pending' check (status in ('pending', 'active', 'revoked')),
  created_at timestamptz not null default now(),
  approved_at timestamptz null,
  revoked_at timestamptz null,
  created_by uuid null references auth.users(id) on delete set null,
  unique (user_id, patient_id)
);

create index if not exists member_patient_access_user_active_idx
  on public.member_patient_access (user_id, patient_id)
  where status = 'active';

create index if not exists member_patient_access_patient_active_idx
  on public.member_patient_access (patient_id, user_id)
  where status = 'active';

-- Invite codes are stored only as hashes. They are created and claimed through
-- trusted server code, never listed directly to a signed-in member.
create table if not exists public.member_access_invites (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  intended_email text not null,
  access_role text not null check (access_role in ('patient', 'parent')),
  relationship_label text null,
  token_hash text not null unique,
  status text not null default 'pending' check (status in ('pending', 'claimed', 'expired', 'revoked')),
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  claimed_at timestamptz null,
  claimed_by uuid null references public.profiles(id) on delete set null,
  created_by uuid null references auth.users(id) on delete set null,
  check (char_length(token_hash) >= 32),
  check (expires_at > created_at)
);

create index if not exists member_access_invites_pending_email_idx
  on public.member_access_invites (lower(intended_email), expires_at)
  where status = 'pending';

-- Preserve any already configured Parent Hub links without removing the
-- legacy table. The new room will use the unified access table.
do $$
begin
  if to_regclass('public.parent_child_access') is not null then
    insert into public.member_patient_access (
      user_id,
      patient_id,
      access_role,
      relationship_label,
      status,
      created_at,
      approved_at,
      created_by
    )
    select
      parent_user_id,
      patient_id,
      'parent',
      relationship_label,
      case when is_active then 'active' else 'revoked' end,
      created_at,
      case when is_active then created_at else null end,
      created_by
    from public.parent_child_access
    on conflict (user_id, patient_id) do nothing;
  end if;
end
$$;

-- Private items are visible only inside one linked patient room. Aleksandra
-- may publish a message, material, discount, contest or individual reward.
create table if not exists public.member_room_items (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  item_type text not null check (
    item_type in (
      'message',
      'notification',
      'material',
      'appointment_info',
      'discount',
      'contest',
      'reward'
    )
  ),
  title text not null check (char_length(title) between 1 and 160),
  content text not null default '',
  action_label text null,
  action_url text null,
  is_visible boolean not null default false,
  visible_from timestamptz not null default now(),
  expires_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid null references auth.users(id) on delete set null,
  check (expires_at is null or expires_at > visible_from)
);

create index if not exists member_room_items_patient_visible_idx
  on public.member_room_items (patient_id, visible_from desc)
  where is_visible = true;

-- Shared announcements are stored once and reused for all matching members.
create table if not exists public.member_bulletins (
  id uuid primary key default gen_random_uuid(),
  audience text not null default 'all' check (audience in ('all', 'patient', 'parent')),
  bulletin_type text not null check (
    bulletin_type in ('announcement', 'discount', 'contest', 'attraction', 'event')
  ),
  title text not null check (char_length(title) between 1 and 160),
  content text not null default '',
  action_label text null,
  action_url text null,
  is_published boolean not null default false,
  visible_from timestamptz not null default now(),
  expires_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid null references auth.users(id) on delete set null,
  check (expires_at is null or expires_at > visible_from)
);

create index if not exists member_bulletins_active_idx
  on public.member_bulletins (audience, visible_from desc)
  where is_published = true;

-- Per-user state never leaks member identity to another room.
create table if not exists public.member_room_item_receipts (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.member_room_items(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  opened_at timestamptz not null default now(),
  claimed_at timestamptz null,
  unique (item_id, user_id)
);

-- A request never edits a booking directly. Aleksandra must approve or reject
-- it through trusted panel/backend code.
create table if not exists public.appointment_change_requests (
  id uuid primary key default gen_random_uuid(),
  booking_id bigint not null references public.bookings(id) on delete cascade,
  patient_id uuid not null references public.patients(id) on delete cascade,
  requester_user_id uuid not null references public.profiles(id) on delete cascade,
  request_type text not null check (request_type in ('reschedule', 'cancel')),
  requested_date date null,
  requested_time time without time zone null,
  message text not null default '' check (char_length(message) <= 1000),
  status text not null default 'pending' check (status in ('pending', 'approved', 'declined', 'withdrawn')),
  created_at timestamptz not null default now(),
  resolved_at timestamptz null,
  resolved_by uuid null references auth.users(id) on delete set null,
  resolution_note text null,
  check (
    request_type = 'cancel'
    or (request_type = 'reschedule' and requested_date is not null and requested_time is not null)
  )
);

create index if not exists appointment_change_requests_member_idx
  on public.appointment_change_requests (requester_user_id, created_at desc);

create index if not exists appointment_change_requests_pending_idx
  on public.appointment_change_requests (status, created_at)
  where status = 'pending';

-- One AI/editorial refresh may serve every room. The payload contains only
-- public family recommendations and must never contain clinical data.
create table if not exists public.family_content_cache (
  id uuid primary key default gen_random_uuid(),
  cache_key text not null unique check (char_length(cache_key) between 1 and 160),
  category text not null check (category in ('attraction', 'event', 'restaurant', 'hotel', 'cinema', 'netflix')),
  area text not null default 'pomorskie',
  title text not null,
  payload jsonb not null default '{}'::jsonb,
  source_label text null,
  source_url text null,
  is_published boolean not null default false,
  refreshed_at timestamptz not null default now(),
  expires_at timestamptz not null,
  check (expires_at > refreshed_at)
);

create index if not exists family_content_cache_active_idx
  on public.family_content_cache (category, area, expires_at desc)
  where is_published = true;

create or replace function public.has_member_patient_access(requested_patient_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.member_patient_access access
    join public.profiles profile on profile.id = access.user_id
    where access.user_id = auth.uid()
      and access.patient_id = requested_patient_id
      and access.status = 'active'
      and profile.role in ('patient', 'parent')
  );
$$;

create or replace function public.current_member_role()
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select profile.role
  from public.profiles profile
  where profile.id = auth.uid()
    and profile.role in ('patient', 'parent');
$$;

-- The registration choice is the initial room context, not a permanent
-- limitation. One account may later receive both patient and parent access.
create or replace function public.can_read_member_audience(requested_audience text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select
    requested_audience = 'all'
    or exists (
      select 1
      from public.profiles profile
      where profile.id = auth.uid()
        and profile.role = requested_audience
        and profile.role in ('patient', 'parent')
    )
    or exists (
      select 1
      from public.member_patient_access access
      where access.user_id = auth.uid()
        and access.status = 'active'
        and access.access_role = requested_audience
    );
$$;

create or replace function public.can_request_booking_change(
  requested_booking_id bigint,
  requested_patient_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select
    public.has_member_patient_access(requested_patient_id)
    and exists (
      select 1
      from public.bookings booking
      where booking.id = requested_booking_id
        and booking.patient_id = requested_patient_id
    );
$$;

revoke all on function public.has_member_patient_access(uuid) from public, anon;
revoke all on function public.current_member_role() from public, anon;
revoke all on function public.can_read_member_audience(text) from public, anon;
revoke all on function public.can_request_booking_change(bigint, uuid) from public, anon;
grant execute on function public.has_member_patient_access(uuid) to authenticated, service_role;
grant execute on function public.current_member_role() to authenticated, service_role;
grant execute on function public.can_read_member_audience(text) to authenticated, service_role;
grant execute on function public.can_request_booking_change(bigint, uuid) to authenticated, service_role;

alter table public.member_patient_access enable row level security;
alter table public.member_access_invites enable row level security;
alter table public.member_room_items enable row level security;
alter table public.member_bulletins enable row level security;
alter table public.member_room_item_receipts enable row level security;
alter table public.appointment_change_requests enable row level security;
alter table public.family_content_cache enable row level security;

drop policy if exists member_patient_access_select_own_active on public.member_patient_access;
create policy member_patient_access_select_own_active on public.member_patient_access
  for select to authenticated
  using (user_id = auth.uid() and status = 'active');

drop policy if exists member_room_items_select_authorized on public.member_room_items;
create policy member_room_items_select_authorized on public.member_room_items
  for select to authenticated
  using (
    is_visible = true
    and visible_from <= now()
    and (expires_at is null or expires_at > now())
    and public.has_member_patient_access(patient_id)
  );

drop policy if exists member_bulletins_select_matching_role on public.member_bulletins;
create policy member_bulletins_select_matching_role on public.member_bulletins
  for select to authenticated
  using (
    is_published = true
    and visible_from <= now()
    and (expires_at is null or expires_at > now())
    and public.current_member_role() is not null
    and public.can_read_member_audience(audience)
  );

drop policy if exists member_room_item_receipts_select_own on public.member_room_item_receipts;
create policy member_room_item_receipts_select_own on public.member_room_item_receipts
  for select to authenticated
  using (user_id = auth.uid());

drop policy if exists member_room_item_receipts_insert_own_authorized on public.member_room_item_receipts;
create policy member_room_item_receipts_insert_own_authorized on public.member_room_item_receipts
  for insert to authenticated
  with check (
    user_id = auth.uid()
    and exists (
      select 1
      from public.member_room_items item
      where item.id = item_id
        and public.has_member_patient_access(item.patient_id)
    )
  );

drop policy if exists member_room_item_receipts_update_own_authorized on public.member_room_item_receipts;
create policy member_room_item_receipts_update_own_authorized on public.member_room_item_receipts
  for update to authenticated
  using (user_id = auth.uid())
  with check (
    user_id = auth.uid()
    and exists (
      select 1
      from public.member_room_items item
      where item.id = item_id
        and public.has_member_patient_access(item.patient_id)
    )
  );

drop policy if exists appointment_change_requests_select_own on public.appointment_change_requests;
create policy appointment_change_requests_select_own on public.appointment_change_requests
  for select to authenticated
  using (requester_user_id = auth.uid());

drop policy if exists appointment_change_requests_insert_own_booking on public.appointment_change_requests;
create policy appointment_change_requests_insert_own_booking on public.appointment_change_requests
  for insert to authenticated
  with check (
    requester_user_id = auth.uid()
    and status = 'pending'
    and public.can_request_booking_change(booking_id, patient_id)
  );

drop policy if exists family_content_cache_select_active on public.family_content_cache;
create policy family_content_cache_select_active on public.family_content_cache
  for select to authenticated
  using (
    is_published = true
    and expires_at > now()
    and public.current_member_role() is not null
  );

revoke all on table public.member_patient_access from anon, authenticated;
revoke all on table public.member_access_invites from anon, authenticated;
revoke all on table public.member_room_items from anon, authenticated;
revoke all on table public.member_bulletins from anon, authenticated;
revoke all on table public.member_room_item_receipts from anon, authenticated;
revoke all on table public.appointment_change_requests from anon, authenticated;
revoke all on table public.family_content_cache from anon, authenticated;

grant select on table public.member_patient_access to authenticated;
grant select on table public.member_room_items to authenticated;
grant select on table public.member_bulletins to authenticated;
grant select, insert, update on table public.member_room_item_receipts to authenticated;
grant select, insert on table public.appointment_change_requests to authenticated;
grant select on table public.family_content_cache to authenticated;

grant select, insert, update, delete on table public.member_patient_access to service_role;
grant select, insert, update, delete on table public.member_access_invites to service_role;
grant select, insert, update, delete on table public.member_room_items to service_role;
grant select, insert, update, delete on table public.member_bulletins to service_role;
grant select, insert, update, delete on table public.member_room_item_receipts to service_role;
grant select, insert, update, delete on table public.appointment_change_requests to service_role;
grant select, insert, update, delete on table public.family_content_cache to service_role;

commit;
