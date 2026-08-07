-- TEALHOUSE 0011  text sizes on single-size products
--
-- products.sizes was still integer[], so a product that is not multi-part
-- could only ever hold numeric shoe sizes. Selecting Resort Wear still
-- showed 35 to 45 because there was nowhere to put XS or 00.
--
-- A leftover Figma view, products_with_primary_image, depends on that
-- column and blocks the change. Nothing in this codebase reads it, so it
-- is captured, dropped, and rebuilt exactly as it was.
--
-- Safe to run more than once.

do $sizes$
declare
  view_sql text;
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'products'
      and column_name = 'sizes'
      and udt_name = '_int4'
  ) then
    raise notice 'products.sizes is already text[]. Nothing to do.';
    return;
  end if;

  -- Keep the exact definition so the view can be put back untouched.
  select pg_get_viewdef('public.products_with_primary_image'::regclass, true)
    into view_sql;

  if view_sql is not null then
    execute 'drop view public.products_with_primary_image';
    raise notice 'Dropped products_with_primary_image so the column can change';
  end if;

  alter table public.products
    alter column sizes type text[] using sizes::text[];
  raise notice 'products.sizes converted from integer[] to text[]';

  if view_sql is not null then
    execute 'create view public.products_with_primary_image as ' || view_sql;
    raise notice 'Rebuilt products_with_primary_image';
  end if;

exception
  when undefined_table then
    -- No such view, so just change the column.
    alter table public.products
      alter column sizes type text[] using sizes::text[];
    raise notice 'products.sizes converted, no dependent view found';
end
$sizes$;
