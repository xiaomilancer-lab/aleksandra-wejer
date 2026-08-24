select
  conname as constraint_name,
  pg_get_constraintdef(oid) as definition,
  pg_get_constraintdef(oid) ilike '%deal%' as allows_deal
from pg_constraint
where conrelid = 'public.family_content_cache'::regclass
  and conname = 'family_content_cache_category_check';
