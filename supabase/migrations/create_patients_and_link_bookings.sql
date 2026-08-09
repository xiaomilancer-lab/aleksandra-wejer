-- This migration is intentionally prepared for manual execution in Supabase.
-- It does not delete or overwrite existing records in public.bookings.

-- 1. gen_random_uuid() is provided by pgcrypto.
create extension if not exists pgcrypto;

-- 2. Create the canonical patient record. No UNIQUE constraints are added here,
-- because existing booking data can contain inconsistent email addresses or phones.
create table if not exists public.patients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. Add an optional relation from a booking to its patient.
-- PostgreSQL supports IF NOT EXISTS for ADD COLUMN in supported Supabase versions.
alter table public.bookings
  add column if not exists patient_id uuid null
  references public.patients(id) on delete set null;

-- 4. Keep lookups by patient efficient.
create index if not exists bookings_patient_id_idx
  on public.bookings(patient_id);

-- 5. Backfill patients from existing bookings. Normalization is used only for
-- matching: emails are trimmed and lower-cased, phones are reduced to digits.
-- A patient is first created for each normalized email address.
with booking_contacts as (
  select
    b.id,
    nullif(btrim(b.name), '') as name,
    nullif(btrim(b.email), '') as email,
    nullif(btrim(b.phone), '') as phone,
    nullif(lower(btrim(b.email)), '') as normalized_email,
    nullif(regexp_replace(coalesce(b.phone, ''), '\D', '', 'g'), '') as normalized_phone
  from public.bookings b
  where b.patient_id is null
)
insert into public.patients (name, phone, email)
select distinct on (normalized_email)
  coalesce(name, 'Nieznany pacjent'),
  phone,
  email
from booking_contacts bc
where normalized_email is not null
  and not exists (
    select 1
    from public.patients p
    where lower(btrim(coalesce(p.email, ''))) = bc.normalized_email
  )
order by normalized_email, id;

-- 6. For bookings without an email, create one patient per normalized phone.
-- The NOT EXISTS condition also avoids a duplicate when an email-backed patient
-- already has the same phone number.
with booking_contacts as (
  select
    b.id,
    nullif(btrim(b.name), '') as name,
    nullif(btrim(b.phone), '') as phone,
    nullif(lower(btrim(b.email)), '') as normalized_email,
    nullif(regexp_replace(coalesce(b.phone, ''), '\D', '', 'g'), '') as normalized_phone
  from public.bookings b
  where b.patient_id is null
)
insert into public.patients (name, phone, email)
select distinct on (normalized_phone)
  coalesce(name, 'Nieznany pacjent'),
  phone,
  null
from booking_contacts bc
where normalized_email is null
  and normalized_phone is not null
  and not exists (
    select 1
    from public.patients p
    where nullif(regexp_replace(coalesce(p.phone, ''), '\D', '', 'g'), '') = bc.normalized_phone
  )
order by normalized_phone, id;

-- 7. Link each email-backed booking to the matching patient. Existing links
-- are left unchanged. LIMIT 1 makes the update safe even if old duplicates exist.
with booking_matches as (
  select
    b.id,
    (
      select p.id
      from public.patients p
      where lower(btrim(coalesce(p.email, ''))) = lower(btrim(coalesce(b.email, '')))
        and nullif(lower(btrim(coalesce(b.email, ''))), '') is not null
      order by p.created_at, p.id
      limit 1
    ) as patient_id
  from public.bookings b
  where b.patient_id is null
)
update public.bookings b
set patient_id = booking_matches.patient_id
from booking_matches
where b.id = booking_matches.id
  and booking_matches.patient_id is not null;

-- 8. Link the remaining phone-backed bookings. Existing links remain intact.
with booking_matches as (
  select
    b.id,
    (
      select p.id
      from public.patients p
      where nullif(regexp_replace(coalesce(p.phone, ''), '\D', '', 'g'), '') =
            nullif(regexp_replace(coalesce(b.phone, ''), '\D', '', 'g'), '')
        and nullif(regexp_replace(coalesce(b.phone, ''), '\D', '', 'g'), '') is not null
      order by p.created_at, p.id
      limit 1
    ) as patient_id
  from public.bookings b
  where b.patient_id is null
)
update public.bookings b
set patient_id = booking_matches.patient_id
from booking_matches
where b.id = booking_matches.id
  and booking_matches.patient_id is not null;

-- Control queries (run manually after the migration):
-- select count(*) as patients_count from public.patients;
-- select count(*) as visits_with_patient_id from public.bookings where patient_id is not null;
-- select count(*) as visits_without_patient_id from public.bookings where patient_id is null;
-- select lower(btrim(email)) as normalized_email, count(*)
-- from public.patients where nullif(btrim(email), '') is not null
-- group by lower(btrim(email)) having count(*) > 1;
-- select regexp_replace(phone, '\D', '', 'g') as normalized_phone, count(*)
-- from public.patients where nullif(regexp_replace(phone, '\D', '', 'g'), '') is not null
-- group by regexp_replace(phone, '\D', '', 'g') having count(*) > 1;
