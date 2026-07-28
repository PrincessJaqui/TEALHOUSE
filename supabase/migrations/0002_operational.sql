-- =====================================================================
-- TEALHOUSE 0002  make the store operational
--
-- Creates or repairs the three tables the app actually reads and writes:
-- products, customers, orders. Adds a trigger so every signup lands in
-- customers automatically, which is what lets the admin page list people
-- without a server holding a service role key.
--
-- Safe to run more than once. Every statement is guarded.
-- Run 0001 first if you have not.
-- =====================================================================

do $guard$
declare
  expected_ref constant text := 'ymnqgfpnfzrlinbdbkel';
  found_ref    text;
begin
  select project_ref into found_ref from public._project_marker where singleton;
  if found_ref is null then
    raise exception 'Migration 0001 has not been run on this database. Run it first.';
  elsif found_ref <> expected_ref then
    raise exception 'WRONG PROJECT. Stamped % but migration targets %.', found_ref, expected_ref;
  end if;
end
$guard$;

-- ---------------------------------------------------------------------
-- 1. Products
--
-- create if absent, and top up any missing columns if it already exists,
-- because create table if not exists does nothing to an existing table
-- with the wrong shape.
-- ---------------------------------------------------------------------
create table if not exists public.products (
  id          bigserial primary key,
  name        text not null,
  price       numeric(10,2) not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.products add column if not exists image       text;
alter table public.products add column if not exists images      text[]  default '{}';
alter table public.products add column if not exists video       text;
alter table public.products add column if not exists category    text;
alter table public.products add column if not exists categories  text[]  default '{}';
alter table public.products add column if not exists audience    text[]  default '{}';
alter table public.products add column if not exists description text    default '';
alter table public.products add column if not exists materials   text[]  default '{}';
alter table public.products add column if not exists sizes       integer[] default '{}';
alter table public.products add column if not exists updated_at  timestamptz not null default now();

create index if not exists products_created_at_idx on public.products (created_at desc);
create index if not exists products_categories_idx on public.products using gin (categories);
create index if not exists products_audience_idx   on public.products using gin (audience);

-- ---------------------------------------------------------------------
-- 2. Customers
--
-- One row per auth user. The admin page reads this instead of calling
-- the auth admin API, which would need a service role key in a server.
-- ---------------------------------------------------------------------
create table if not exists public.customers (
  id               uuid primary key references auth.users (id) on delete cascade,
  email            text,
  full_name        text,
  phone            text,
  is_anonymous     boolean not null default false,
  banned           boolean not null default false,
  marketing_opt_in boolean not null default false,
  created_at       timestamptz not null default now(),
  last_sign_in_at  timestamptz
);

create index if not exists customers_created_at_idx on public.customers (created_at desc);
create index if not exists customers_email_idx      on public.customers (lower(email));

-- Populate on signup. security definer so it can write regardless of the
-- signing-up user's own permissions.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $fn$
begin
  insert into public.customers (id, email, full_name, phone, is_anonymous, created_at)
  values (
    new.id,
    new.email,
    nullif(trim(coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', '')), ''),
    nullif(trim(coalesce(new.raw_user_meta_data ->> 'phone', '')), ''),
    (new.email is null),
    coalesce(new.created_at, now())
  )
  on conflict (id) do update
    set email     = coalesce(excluded.email, public.customers.email),
        full_name = coalesce(excluded.full_name, public.customers.full_name);
  return new;
end
$fn$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill anyone who signed up before this migration.
insert into public.customers (id, email, full_name, phone, is_anonymous, created_at, last_sign_in_at)
select
  u.id,
  u.email,
  nullif(trim(coalesce(u.raw_user_meta_data ->> 'full_name', u.raw_user_meta_data ->> 'name', '')), ''),
  nullif(trim(coalesce(u.raw_user_meta_data ->> 'phone', '')), ''),
  (u.email is null),
  u.created_at,
  u.last_sign_in_at
from auth.users u
on conflict (id) do nothing;

-- ---------------------------------------------------------------------
-- 3. Orders
--
-- The legacy schema used capitalised statuses (Processing, Shipped) but
-- every admin screen sends lowercase, so changing an order's status would
-- have failed the check constraint. Standardising on lowercase.
-- ---------------------------------------------------------------------
create table if not exists public.orders (
  id                     uuid primary key default gen_random_uuid(),
  user_id                uuid references auth.users (id) on delete set null,
  customer_name          text,
  customer_email         text not null,
  customer_phone         text,
  shipping_address_line1 text,
  shipping_address_line2 text,
  shipping_city          text,
  shipping_state         text,
  shipping_postal_code   text,
  shipping_country       text default 'US',
  status                 text not null default 'pending',
  total                  numeric(10,2) not null default 0,
  subtotal               numeric(10,2),
  tax                    numeric(10,2),
  shipping_cost          numeric(10,2) default 0,
  items                  jsonb not null default '[]'::jsonb,
  items_count            integer default 0,
  payment_status         text not null default 'unpaid',
  payment_method         text,
  tracking_number        text,
  notes                  text,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now(),
  shipped_at             timestamptz,
  delivered_at           timestamptz
);

alter table public.orders add column if not exists user_id        uuid references auth.users (id) on delete set null;
alter table public.orders add column if not exists payment_status text not null default 'unpaid';
alter table public.orders add column if not exists items_count    integer default 0;
alter table public.orders add column if not exists updated_at     timestamptz not null default now();

-- normalise existing values, then swap the constraints
update public.orders set status = lower(status) where status <> lower(status);
update public.orders set payment_status = lower(payment_status) where payment_status <> lower(payment_status);
update public.orders set status = 'pending' where status is null or status not in
  ('pending','processing','confirmed','shipped','delivered','cancelled');
update public.orders set payment_status = 'unpaid' where payment_status is null or payment_status not in
  ('unpaid','paid','failed','refunded');

alter table public.orders drop constraint if exists orders_status_check;
alter table public.orders drop constraint if exists orders_payment_status_check;

alter table public.orders add constraint orders_status_check
  check (status in ('pending','processing','confirmed','shipped','delivered','cancelled'));
alter table public.orders add constraint orders_payment_status_check
  check (payment_status in ('unpaid','paid','failed','refunded'));

create index if not exists orders_user_id_idx    on public.orders (user_id);
create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists orders_status_idx     on public.orders (status);

-- keep updated_at honest
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $t$
begin
  new.updated_at = now();
  return new;
end
$t$;

drop trigger if exists orders_touch_updated_at on public.orders;
create trigger orders_touch_updated_at before update on public.orders
  for each row execute function public.touch_updated_at();

drop trigger if exists products_touch_updated_at on public.products;
create trigger products_touch_updated_at before update on public.products
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------
-- 4. Row level security
-- ---------------------------------------------------------------------
alter table public.products  enable row level security;
alter table public.customers enable row level security;
alter table public.orders    enable row level security;

-- products: public read, admin write (re-stated so 0002 is self-sufficient)
drop policy if exists "products_public_read"   on public.products;
drop policy if exists "products_admin_insert"  on public.products;
drop policy if exists "products_admin_update"  on public.products;
drop policy if exists "products_admin_delete"  on public.products;

create policy "products_public_read"  on public.products for select to anon, authenticated using (true);
create policy "products_admin_insert" on public.products for insert to authenticated with check (public.is_admin());
create policy "products_admin_update" on public.products for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "products_admin_delete" on public.products for delete to authenticated using (public.is_admin());

-- customers: you see yourself, admins see everyone
drop policy if exists "customers_self_read"    on public.customers;
drop policy if exists "customers_self_update"  on public.customers;
drop policy if exists "customers_admin_read"   on public.customers;
drop policy if exists "customers_admin_update" on public.customers;

create policy "customers_self_read"   on public.customers for select to authenticated using (auth.uid() = id);
create policy "customers_admin_read"  on public.customers for select to authenticated using (public.is_admin());

-- a customer may edit their own name, phone and marketing choice.
-- the banned flag is protected by the trigger below, not by this policy.
create policy "customers_self_update" on public.customers for update to authenticated
  using (auth.uid() = id) with check (auth.uid() = id);

create policy "customers_admin_update" on public.customers for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- stop a customer un-banning themselves through their own update policy
create or replace function public.protect_customer_flags()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $p$
begin
  if not public.is_admin() then
    new.banned := old.banned;
    new.email  := old.email;
    new.id     := old.id;
  end if;
  return new;
end
$p$;

drop trigger if exists customers_protect_flags on public.customers;
create trigger customers_protect_flags before update on public.customers
  for each row execute function public.protect_customer_flags();

-- orders: customers read their own and create their own, admins do everything.
-- the insert policy is intentionally narrow. Once Stripe is in, order
-- creation moves server side and this policy should be dropped.
drop policy if exists "orders_own_read"     on public.orders;
drop policy if exists "orders_admin_read"   on public.orders;
drop policy if exists "orders_admin_write"  on public.orders;
drop policy if exists "orders_admin_update" on public.orders;
drop policy if exists "orders_own_insert"   on public.orders;

create policy "orders_own_read"   on public.orders for select to authenticated using (auth.uid() = user_id);
create policy "orders_admin_read" on public.orders for select to authenticated using (public.is_admin());

create policy "orders_own_insert" on public.orders for insert to authenticated
  with check (
    auth.uid() = user_id
    and payment_status = 'unpaid'
    and status = 'pending'
  );

create policy "orders_admin_write"  on public.orders for insert to authenticated with check (public.is_admin());
create policy "orders_admin_update" on public.orders for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------
-- 5. Report
-- ---------------------------------------------------------------------
do $report$
declare
  p_count int;
  c_count int;
  o_count int;
  a_count int;
begin
  select count(*) into p_count from public.products;
  select count(*) into c_count from public.customers;
  select count(*) into o_count from public.orders;
  select count(*) into a_count from public.admin_users;

  raise notice 'products: % rows', p_count;
  raise notice 'customers: % rows', c_count;
  raise notice 'orders: % rows', o_count;
  raise notice 'admin_users: % rows', a_count;

  if a_count = 0 then
    raise notice 'NO ADMINS. You cannot reach /admin until you insert yourself into admin_users. See the end of migration 0001.';
  end if;
end
$report$;
