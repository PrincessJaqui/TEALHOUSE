-- TEALHOUSE 0020  invitation keys and per-product dispatch
--
-- Two things.
--
-- 1. discount_codes. The pricing code already knows how to apply these;
--    this is the table it reads. A 'fixed_total' code sets the order total
--    outright, which is what a $1 test key needs.
--
-- 2. products.ships_in_days, so a delivery estimate reflects the piece
--    rather than one figure for the whole catalogue.

create table if not exists public.discount_codes (
  id          bigserial primary key,
  code        text not null unique,
  kind        text not null,
  value       numeric(10,2) not null,
  label       text,
  is_active   boolean not null default true,
  max_uses    integer,
  times_used  integer not null default 0,
  expires_at  timestamptz,
  created_at  timestamptz not null default now()
);

alter table public.discount_codes
  drop constraint if exists discount_codes_kind_check;
alter table public.discount_codes
  add constraint discount_codes_kind_check
  check (kind in ('percent', 'amount', 'fixed_total'));

-- Codes are matched case-insensitively, so store them one way.
create unique index if not exists discount_codes_code_key
  on public.discount_codes (upper(code));

alter table public.discount_codes enable row level security;

-- No public read. A customer proves a code by using it at checkout, where
-- the server looks it up with the service role. Listing every code to the
-- browser would hand out the keys.
drop policy if exists discount_codes_admin on public.discount_codes;
create policy discount_codes_admin
  on public.discount_codes for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- How long this piece takes to leave the atelier, in business days, before
-- shipping time is added. Null falls back to the store default.
alter table public.products
  add column if not exists ships_in_days integer;
