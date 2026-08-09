-- Run manually in Supabase. This migration only extends patient records;
-- it does not change booking status handling or send any messages.

alter table public.patients
  add column if not exists review_request_sent boolean not null default false,
  add column if not exists review_request_sent_at timestamptz null,
  add column if not exists review_response text null
    check (review_response in ('google', 'private_feedback')),
  add column if not exists google_review_clicked_at timestamptz null,
  add column if not exists private_feedback text null,
  add column if not exists review_request_scheduled_at timestamptz null;

create index if not exists patients_review_request_schedule_idx
  on public.patients (review_request_scheduled_at)
  where review_request_sent = false;

create index if not exists patients_private_feedback_idx
  on public.patients (updated_at desc)
  where private_feedback is not null;

-- TODO: A background worker should read review_request_scheduled_at, deliver a
-- configured message, then set review_request_sent and review_request_sent_at.
