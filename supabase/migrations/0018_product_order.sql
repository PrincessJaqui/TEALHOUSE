-- TEALHOUSE 0018  manual product order
--
-- Alphabetical was a fallback, not a merchandising decision. This lets the
-- order be chosen by hand, and the first product in a collection becomes
-- that collection's share image.

alter table public.products
  add column if not exists sort_order integer not null default 0;

-- Seed the current alphabetical order so nothing jumps on first load.
with ranked as (
  select id, row_number() over (order by name) * 10 as position
    from public.products
)
update public.products p
   set sort_order = ranked.position
  from ranked
 where p.id = ranked.id
   and p.sort_order = 0;

create index if not exists products_sort_order_idx
  on public.products (sort_order);
