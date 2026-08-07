-- TEALHOUSE 0011  text sizes on single-size products
--
-- products.sizes was still integer[], so a product that is not multi-part
-- could only ever hold numeric shoe sizes. Selecting Resort Wear still
-- showed 35 to 45 because there was nowhere to put XS or 00.
--
-- Safe to run more than once.

do $sizes$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'products'
      and column_name = 'sizes'
      and udt_name = '_int4'
  ) then
    alter table public.products
      alter column sizes type text[] using sizes::text[];
    raise notice 'products.sizes converted from integer[] to text[]';
  else
    raise notice 'products.sizes is already text[]';
  end if;
end
$sizes$;
