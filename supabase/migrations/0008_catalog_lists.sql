-- TEALHOUSE 0008  materials, colours and managed size scales
--
-- Materials become optional and managed rather than hardcoded.
-- Colours are new, and carry their own stock: a teal bikini top in S and a
-- black one in S are separate counts.
-- Size scales become rows you can add to, filtered by category.
--
-- Stock keys gain an optional colour prefix:
--   "38"              single size, no colour  (unchanged)
--   "Top:S"           one part, no colour     (unchanged)
--   "Teal|38"         single size in a colour
--   "Teal|Top:S"      one part in a colour
--   "default"         no size at all          (unchanged)
--
-- Safe to run more than once.

create table if not exists public.materials (
  id         bigserial primary key,
  name       text not null unique,
  is_active  boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.colors (
  id         bigserial primary key,
  name       text not null unique,
  hex        text,
  is_active  boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.size_scales (
  id         bigserial primary key,
  key        text not null unique,
  label      text not null,
  sizes      text[] not null default '{}',
  categories text[] not null default '{}',
  is_active  boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- Which colours a product comes in.
alter table public.products
  add column if not exists colors text[] not null default '{}';

alter table public.cart
  add column if not exists color text;

-- Seed the lists that were previously hardcoded.
insert into public.materials (name, sort_order) values
  ('Cactus Leather', 1),
  ('Natural Rubber', 2),
  ('Bamboo', 3),
  ('Flax', 4)
on conflict (name) do nothing;

insert into public.size_scales (key, label, sizes, categories, sort_order) values
  ('alpha', 'Alpha (XS to XXL)',
   array['XS','S','M','L','XL','XXL'],
   array['apparel','resort-wear','accessories'], 1),
  ('us-womens', 'US Womens (00 to 24)',
   array['00','0','2','4','6','8','10','12','14','16','18','20','22','24'],
   array['apparel','resort-wear'], 2),
  ('footwear-eu', 'Footwear EU (35 to 45)',
   array['35','36','37','38','39','40','41','42','43','44','45'],
   array['shoes'], 3),
  ('footwear-us-womens', 'Footwear US Womens (5 to 12)',
   array['5','5.5','6','6.5','7','7.5','8','8.5','9','9.5','10','11','12'],
   array['shoes'], 4),
  ('us-mens', 'US Mens waist (28 to 44)',
   array['28','30','32','34','36','38','40','42','44'],
   array['apparel'], 5),
  ('one-size', 'One size', array['One Size'], array[]::text[], 7)
on conflict (key) do nothing;

-- Bra sizes, generated rather than typed out.
do $bra$
declare
  bands int[] := array[30,32,34,36,38,40,42];
  cups  text[] := array['A','B','C','D','DD','DDD'];
  b int;
  c text;
  out text[] := '{}';
begin
  foreach b in array bands loop
    foreach c in array cups loop
      out := out || (b::text || c);
    end loop;
  end loop;

  insert into public.size_scales (key, label, sizes, categories, sort_order)
  values ('bra', 'Bra (30A to 42DDD)', out,
          array['resort-wear','apparel'], 6)
  on conflict (key) do nothing;
end
$bra$;

alter table public.materials   enable row level security;
alter table public.colors      enable row level security;
alter table public.size_scales enable row level security;

do $pol$
declare
  t text;
begin
  foreach t in array array['materials','colors','size_scales'] loop
    execute format(
      'drop policy if exists "%s_public_read" on public.%I', t, t);
    execute format(
      'drop policy if exists "%s_admin_write" on public.%I', t, t);
    execute format(
      'create policy "%s_public_read" on public.%I for select
         to anon, authenticated using (true)', t, t);
    execute format(
      'create policy "%s_admin_write" on public.%I for all
         to authenticated using (public.is_admin())
         with check (public.is_admin())', t, t);
  end loop;
end
$pol$;
