-- TEALHOUSE 0005  product SEO
-- Safe to run more than once.

alter table public.products
  add column if not exists slug text;
alter table public.products
  add column if not exists meta_title text;
alter table public.products
  add column if not exists meta_description text;
alter table public.products
  add column if not exists image_alt text;

-- Turns "Lexi Pump / Teal" into "lexi-pump-teal".
create or replace function public.slugify(value text)
returns text
language sql
immutable
as $slug$
  -- unaccent via translate so "Eclair" survives instead of becoming "clair"
  select trim(both '-' from
    regexp_replace(
      regexp_replace(
        lower(translate(coalesce(value, ''),
          'ÀÁÂÃÄÅàáâãäåÈÉÊËèéêëÌÍÎÏìíîïÒÓÔÕÖòóôõöÙÚÛÜùúûüÑñÇç',
          'aaaaaaaaaaaaeeeeeeeeiiiiiiiioooooooooouuuuuuuunncc')),
        '[^a-z0-9]+', '-', 'g'),
      '-{2,}', '-', 'g')
  );
$slug$;

-- Fills the slug from the product name when it is left blank, and keeps it
-- unique by appending a number. Editing the slug by hand is respected.
create or replace function public.ensure_product_slug()
returns trigger
language plpgsql
as $fn$
declare
  base      text;
  candidate text;
  n         integer := 1;
begin
  base := public.slugify(coalesce(nullif(trim(new.slug), ''), new.name));

  if base = '' then
    base := 'product';
  end if;

  candidate := base;

  while exists (
    select 1 from public.products p
    where p.slug = candidate
      and (new.id is null or p.id <> new.id)
  ) loop
    n := n + 1;
    candidate := base || '-' || n;
  end loop;

  new.slug := candidate;
  return new;
end
$fn$;

drop trigger if exists products_ensure_slug on public.products;
create trigger products_ensure_slug
  before insert or update on public.products
  for each row execute function public.ensure_product_slug();

-- Backfill anything that predates this.
update public.products
   set slug = null
 where slug is null or trim(slug) = '';

create unique index if not exists products_slug_key
  on public.products (slug);

do $r$
declare
  n int;
begin
  select count(*) into n from public.products where slug is not null;
  raise notice 'products with a slug: %', n;
end
$r$;
