-- Secure mirror of inbound email for the psychologist panel.
-- OVH remains the primary mailbox. Run manually in Supabase SQL Editor.

begin;

create table if not exists public.inbound_emails (
  id uuid primary key default gen_random_uuid(),
  resend_email_id text not null unique,
  webhook_id text null unique,
  message_id text null,
  sender text not null,
  recipients text[] not null default '{}',
  cc text[] not null default '{}',
  reply_to text[] not null default '{}',
  subject text not null default '(bez tematu)',
  body_text text not null default '',
  attachment_metadata jsonb not null default '[]'::jsonb,
  received_at timestamptz not null,
  is_read boolean not null default false,
  read_at timestamptz null,
  archived_at timestamptz null,
  retention_until timestamptz not null default (now() + interval '90 days'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint inbound_emails_sender_length_check check (char_length(sender) between 1 and 1000),
  constraint inbound_emails_subject_length_check check (char_length(subject) between 1 and 1000),
  constraint inbound_emails_body_length_check check (char_length(body_text) <= 200000),
  constraint inbound_emails_attachment_metadata_check check (jsonb_typeof(attachment_metadata) = 'array')
);

create index if not exists inbound_emails_received_at_idx
  on public.inbound_emails (received_at desc);

create index if not exists inbound_emails_unread_idx
  on public.inbound_emails (received_at desc)
  where is_read = false and archived_at is null;

create index if not exists inbound_emails_retention_idx
  on public.inbound_emails (retention_until)
  where archived_at is null;

alter table public.inbound_emails enable row level security;

-- The browser never receives direct table access. Verified server routes use service_role.
revoke all on table public.inbound_emails from anon, authenticated, service_role;
grant select, insert, update, delete on table public.inbound_emails to service_role;

commit;
