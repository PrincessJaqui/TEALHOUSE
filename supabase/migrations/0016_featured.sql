-- TEALHOUSE 0016  featured on the landing page
--
-- The landing page showed the entire catalogue. Featuring is its own
-- decision, separate from Best Seller, so it gets its own flag.

alter table public.products
  add column if not exists is_featured boolean not null default false;

create index if not exists products_featured_idx
  on public.products (is_featured)
  where is_featured;

do $r$
begin
  raise notice 'Nothing is featured yet. Tick pieces in the admin.';
end
$r$;
