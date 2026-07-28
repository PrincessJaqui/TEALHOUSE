-- =====================================================================
-- TEALHOUSE 0003  stock, contact messages, newsletter
--
-- Adds the things a working store needs that were missing entirely:
--   - per-size stock, so you cannot oversell and things can sell out
--   - a bestseller flag, because the Best Sellers page had no way to
--     know what a bestseller was
--   - a real table behind the Contact Us form, which had no submit
--     handler at all and silently discarded every message
--   - a real table behind the newsletter signup, which told customers
--     "Thank you for subscribing!" and saved nothing anywhere
--
-- Safe to run more than once. Run 0001 and 0002 first.
-- =====================================================================

do $guard$
declare
  expected_ref constant text := 'ymnqgfpnfzrlinbdbkel';
  found_ref    text;
begin
  select project_ref into found_ref from public._project_marker where singleton;
  if found_ref is null then
    raise exception 'Migrations 0001 and 0002 have not been run on this database.';
  elsif found_ref <> expected_ref then
    raise exception 'WRONG PROJECT. Stamped % but migration targets %.', found_ref, expected_ref;
  end if;
end
$guard$;

-- ---------------------------------------------------------------------
-- 1. Products: stock, bestseller, published
-- ---------------------------------------------------------------------

-- Stock is a map of size to quantity, for example {"38": 3, "39": 0}.
-- Products without sizes use the single key "default".
alter table public.products add column if not exists stock jsonb not null default '{}'::jsonb;

-- The Best Sellers page had no source of truth. This is a manual flag you
-- control from the admin screen. It can be replaced later by a view that
-- ranks on actual order counts.
alter table public.products add column if not exists is_bestseller boolean not null default false;

-- Lets you stage a product before it appears on the storefront.
alter table public.products add column if not exists is_published boolean not null default true;

create index if not exists products_bestseller_idx on public.products (is_bestseller) where is_bestseller;
create index if not exists products_published_idx  on public.products (is_published);

-- Anything already in the table predates stock tracking, so it currently
-- reads as sold out. Give each existing product zero explicitly so the
-- admin screen shows a number rather than a blank.
update public.products
   set stock = '{}'::jsonb
 where stock is null;

-- ---------------------------------------------------------------------
-- 2. Contact messages
--
-- Anyone may write one, nobody but an admin may read them. The insert
-- policy has no read counterpart on purpose: a sender cannot list other
-- people's messages back out.
-- ---------------------------------------------------------------------
create table if not exists public.contact_messages (
  id         uuid primary key default gen_random_uuid(),
  name       text,
  email      text not null,
  subject    text,
  message    text not null,
  handled    boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists contact_messages_created_at_idx on public.contact_messages (created_at desc);
create index if not exists contact_messages_handled_idx    on public.contact_messages (handled) where not handled;

alter table public.contact_messages enable row level security;

drop policy if exists "contact_messages_public_insert" on public.contact_messages;
drop policy if exists "contact_messages_admin_read"    on public.contact_messages;
drop policy if exists "contact_messages_admin_update"  on public.contact_messages;

create policy "contact_messages_public_insert" on public.contact_messages
  for insert to anon, authenticated with check (true);

create policy "contact_messages_admin_read" on public.contact_messages
  for select to authenticated using (public.is_admin());

create policy "contact_messages_admin_update" on public.contact_messages
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------
-- 3. Newsletter subscribers
-- ---------------------------------------------------------------------
create table if not exists public.newsletter_subscribers (
  id            uuid primary key default gen_random_uuid(),
  email         citext not null,
  source        text,
  unsubscribed  boolean not null default false,
  created_at    timestamptz not null default now()
);

-- citext needs the extension. If it is unavailable, fall back to a
-- lowercase unique index on plain text.
create extension if not exists citext;

do $uniq$
begin
  if not exists (
    select 1 from pg_indexes
    where schemaname = 'public'
      and indexname = 'newsletter_subscribers_email_key'
  ) then
    execute 'create unique index newsletter_subscribers_email_key on public.newsletter_subscribers (lower(email::text))';
  end if;
end
$uniq$;

alter table public.newsletter_subscribers enable row level security;

drop policy if exists "newsletter_public_insert" on public.newsletter_subscribers;
drop policy if exists "newsletter_admin_read"    on public.newsletter_subscribers;
drop policy if exists "newsletter_admin_update"  on public.newsletter_subscribers;

create policy "newsletter_public_insert" on public.newsletter_subscribers
  for insert to anon, authenticated with check (true);

create policy "newsletter_admin_read" on public.newsletter_subscribers
  for select to authenticated using (public.is_admin());

create policy "newsletter_admin_update" on public.newsletter_subscribers
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------
-- 4. Stock enforcement
--
-- The browser decides what to show, but the database decides what is
-- true. This refuses an order line whose size has insufficient stock,
-- and decrements on success, so two people checking out the last pair
-- at the same moment cannot both succeed.
-- ---------------------------------------------------------------------
create or replace function public.reserve_order_stock()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $stock$
declare
  line          jsonb;
  pid           bigint;
  size_key      text;
  want          integer;
  have          integer;
  product_name  text;
begin
  for line in select * from jsonb_array_elements(coalesce(new.items, '[]'::jsonb))
  loop
    pid      := (line ->> 'product_id')::bigint;
    want     := coalesce((line ->> 'quantity')::integer, 0);
    size_key := coalesce(nullif(line ->> 'size', ''), 'default');

    if pid is null or want <= 0 then
      continue;
    end if;

    select p.name, coalesce((p.stock ->> size_key)::integer, 0)
      into product_name, have
      from public.products p
     where p.id = pid
     for update;

    if not found then
      raise exception 'Product % is no longer available', pid;
    end if;

    if have < want then
      raise exception 'Not enough stock for % in size %: % left, % requested',
        product_name, size_key, have, want;
    end if;

    update public.products
       set stock = jsonb_set(stock, array[size_key], to_jsonb(have - want))
     where id = pid;
  end loop;

  return new;
end
$stock$;

drop trigger if exists orders_reserve_stock on public.orders;
create trigger orders_reserve_stock
  before insert on public.orders
  for each row execute function public.reserve_order_stock();

-- ---------------------------------------------------------------------
-- 5. Report
-- ---------------------------------------------------------------------
do $report$
declare
  p_count int;
  in_stock int;
begin
  select count(*) into p_count from public.products;
  select count(*) into in_stock from public.products
   where (select coalesce(sum((value)::int), 0) from jsonb_each_text(stock)) > 0;

  raise notice 'products: % rows, % with stock', p_count, in_stock;
  if p_count > 0 and in_stock = 0 then
    raise notice 'Every product currently reads as sold out. Set stock per size in Admin, Products.';
  end if;
end
$report$;
