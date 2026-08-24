begin;

alter table public.family_content_cache
  drop constraint if exists family_content_cache_category_check;

alter table public.family_content_cache
  add constraint family_content_cache_category_check
  check (category in (
    'attraction',
    'event',
    'restaurant',
    'hotel',
    'cinema',
    'netflix',
    'deal'
  ));

commit;
