-- =====================================================================
-- TEALHOUSE 0001  baseline security
--
-- Supersedes every loose file in src/app/lib/*.sql. Those thirteen files
-- contradicted each other: three defined different policies on products,
-- one disabled RLS partway through, and the storage policies granted
-- public delete. Do not run those files again.
--
-- Safe to run more than once. Safe to run before all tables exist: any
-- table that is missing is reported and skipped rather than aborting.
-- Read the NOTICE output at the end to see what was skipped.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 0. Wrong-project guard.
--
-- Postgres cannot see which Supabase project it belongs to, so the guard
-- in the previous version of this file was decorative: it read a setting
-- that is always null here, so it could never fire. This uses a sentinel
-- row instead. The first run stamps the project ref into the database and
-- every later migration checks against that stamp and aborts on mismatch.
-- ---------------------------------------------------------------------
create table if not exists public._project_marker (
  singleton   boolean primary key default true,
  project_ref text not null,
  stamped_at  timestamptz not null default now(),
  constraint  _project_marker_singleton check (singleton)
);

do $guard$
declare
  expected_ref constant text := 'ymnqgfpnfzrlinbdbkel';
  found_ref    text;
begin
  select project_ref into found_ref from public._project_marker where singleton;

  if found_ref is null then
    insert into public._project_marker (singleton, project_ref)
    values (true, expected_ref);
    raise notice 'Project stamped as %. Later migrations will refuse to run anywhere else.', expected_ref;
  elsif found_ref <> expected_ref then
    raise exception
      'WRONG PROJECT. This database is stamped % but the migration targets %. Nothing was changed.',
      found_ref, expected_ref;
  end if;
end
$guard$;

-- ---------------------------------------------------------------------
-- 1. Admin registry, and the single source of truth for "is this an admin"
-- ---------------------------------------------------------------------
create table if not exists public.admin_users (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null unique references auth.users (id) on delete cascade,
  email      text not null,
  full_name  text,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

-- security definer so it can read admin_users without the caller needing
-- permission to, which is what avoids the classic RLS infinite recursion.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $fn$
  select exists (
    select 1 from public.admin_users a where a.user_id = auth.uid()
  );
$fn$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

drop policy if exists "Only admins can view admin users" on public.admin_users;
drop policy if exists "Only admins can create admin users" on public.admin_users;
drop policy if exists "Only admins can update admin users" on public.admin_users;
drop policy if exists "admin_users_select" on public.admin_users;

create policy "admin_users_select"
  on public.admin_users for select
  to authenticated
  using (public.is_admin());

-- Deliberately no insert, update or delete policy. Granting admin is a
-- manual act you perform in the SQL editor, not something the app can do.

-- ---------------------------------------------------------------------
-- 2. Everything below applies only to tables that already exist.
-- ---------------------------------------------------------------------
do $apply$
declare
  missing text[] := '{}';
begin

  ------------------------------------------------------------------
  -- Products. Public read, admin write.
  ------------------------------------------------------------------
  if to_regclass('public.products') is not null then
    execute 'alter table public.products enable row level security';

    execute 'drop policy if exists "Anyone can view products" on public.products';
    execute 'drop policy if exists "Authenticated users can insert products" on public.products';
    execute 'drop policy if exists "Authenticated users can update products" on public.products';
    execute 'drop policy if exists "Authenticated users can delete products" on public.products';
    execute 'drop policy if exists "Admin can insert products" on public.products';
    execute 'drop policy if exists "Admin can update products" on public.products';
    execute 'drop policy if exists "Admin can delete products" on public.products';
    execute 'drop policy if exists "products_public_read" on public.products';
    execute 'drop policy if exists "products_admin_insert" on public.products';
    execute 'drop policy if exists "products_admin_update" on public.products';
    execute 'drop policy if exists "products_admin_delete" on public.products';

    execute 'create policy "products_public_read" on public.products for select to anon, authenticated using (true)';
    execute 'create policy "products_admin_insert" on public.products for insert to authenticated with check (public.is_admin())';
    execute 'create policy "products_admin_update" on public.products for update to authenticated using (public.is_admin()) with check (public.is_admin())';
    execute 'create policy "products_admin_delete" on public.products for delete to authenticated using (public.is_admin())';
  else
    missing := missing || 'products';
  end if;

  ------------------------------------------------------------------
  -- Cart and wishlist. Each user reaches only their own rows.
  ------------------------------------------------------------------
  if to_regclass('public.cart') is not null then
    execute 'alter table public.cart enable row level security';
    execute 'drop policy if exists "cart_own" on public.cart';
    execute 'create policy "cart_own" on public.cart for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id)';
  else
    missing := missing || 'cart';
  end if;

  if to_regclass('public.wishlist') is not null then
    execute 'alter table public.wishlist enable row level security';
    execute 'drop policy if exists "wishlist_own" on public.wishlist';
    execute 'create policy "wishlist_own" on public.wishlist for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id)';
  else
    missing := missing || 'wishlist';
  end if;

  ------------------------------------------------------------------
  -- Orders. Customers read their own, admins read and write all.
  -- No customer insert policy on purpose: orders get created server side
  -- once Stripe confirms payment, never straight from the browser.
  ------------------------------------------------------------------
  if to_regclass('public.orders') is not null then
    execute 'alter table public.orders enable row level security';

    execute 'drop policy if exists "Users can view own orders" on public.orders';
    execute 'drop policy if exists "Admins can view all orders" on public.orders';
    execute 'drop policy if exists "Admins can insert orders" on public.orders';
    execute 'drop policy if exists "Admins can update orders" on public.orders';
    execute 'drop policy if exists "orders_own_read" on public.orders';
    execute 'drop policy if exists "orders_admin_read" on public.orders';
    execute 'drop policy if exists "orders_admin_write" on public.orders';
    execute 'drop policy if exists "orders_admin_update" on public.orders';

    execute 'create policy "orders_own_read" on public.orders for select to authenticated using (auth.uid() = user_id)';
    execute 'create policy "orders_admin_read" on public.orders for select to authenticated using (public.is_admin())';
    execute 'create policy "orders_admin_write" on public.orders for insert to authenticated with check (public.is_admin())';
    execute 'create policy "orders_admin_update" on public.orders for update to authenticated using (public.is_admin()) with check (public.is_admin())';
  else
    missing := missing || 'orders';
  end if;

  ------------------------------------------------------------------
  -- The Figma scaffold key/value table. Checkout currently writes orders
  -- into this. Lock it to admins so a guest cannot read every order.
  ------------------------------------------------------------------
  if to_regclass('public.kv_store_d1960f17') is not null then
    execute 'alter table public.kv_store_d1960f17 enable row level security';
    execute 'drop policy if exists "kv_admin_only" on public.kv_store_d1960f17';
    execute 'create policy "kv_admin_only" on public.kv_store_d1960f17 for all to authenticated using (public.is_admin()) with check (public.is_admin())';
  else
    missing := missing || 'kv_store_d1960f17';
  end if;

  if array_length(missing, 1) is null then
    raise notice 'All application tables found and secured.';
  else
    raise notice 'SKIPPED, these tables do not exist yet: %', array_to_string(missing, ', ');
    raise notice 'Re-run this file after creating them, or they will have no policies.';
  end if;
end
$apply$;

-- ---------------------------------------------------------------------
-- 3. Storage. Public read of product images, admin write only.
--    The old policies let anyone on the internet upload, overwrite and
--    delete your product photography.
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

drop policy if exists "Public Access" on storage.objects;
drop policy if exists "Allow public uploads" on storage.objects;
drop policy if exists "Allow public updates" on storage.objects;
drop policy if exists "Allow public deletes" on storage.objects;
drop policy if exists "Anyone can view product images" on storage.objects;
drop policy if exists "Authenticated users can upload product images" on storage.objects;
drop policy if exists "Authenticated users can update product images" on storage.objects;
drop policy if exists "Authenticated users can delete product images" on storage.objects;
drop policy if exists "product_images_public_read" on storage.objects;
drop policy if exists "product_images_admin_insert" on storage.objects;
drop policy if exists "product_images_admin_update" on storage.objects;
drop policy if exists "product_images_admin_delete" on storage.objects;

create policy "product_images_public_read"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'product-images');

create policy "product_images_admin_insert"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'product-images' and public.is_admin());

create policy "product_images_admin_update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'product-images' and public.is_admin());

create policy "product_images_admin_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'product-images' and public.is_admin());
