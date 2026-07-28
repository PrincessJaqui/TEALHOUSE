-- =====================================================================
-- TEALHOUSE 0004  PayPal
--
-- Orders are now created server side, after PayPal confirms payment, by
-- a Vercel function holding the service role key. That is a meaningful
-- security improvement: the browser no longer needs permission to insert
-- an order at all, so it can no longer invent one.
--
-- Safe to run more than once. Run 0001 through 0003 first.
-- =====================================================================

do $guard$
declare
  expected_ref constant text := 'ymnqgfpnfzrlinbdbkel';
  found_ref    text;
begin
  select project_ref into found_ref from public._project_marker where singleton;
  if found_ref is null then
    raise exception 'Earlier migrations have not been run on this database.';
  elsif found_ref <> expected_ref then
    raise exception 'WRONG PROJECT. Stamped % but migration targets %.', found_ref, expected_ref;
  end if;
end
$guard$;

alter table public.orders add column if not exists paypal_order_id   text;
alter table public.orders add column if not exists paypal_capture_id text;

create unique index if not exists orders_paypal_order_id_key
  on public.orders (paypal_order_id) where paypal_order_id is not null;

create index if not exists orders_paypal_capture_id_idx
  on public.orders (paypal_capture_id) where paypal_capture_id is not null;

-- 'failed' was not in the original set and the webhook needs it.
alter table public.orders drop constraint if exists orders_payment_status_check;
alter table public.orders add constraint orders_payment_status_check
  check (payment_status in ('unpaid','paid','failed','refunded'));

-- The browser used to insert its own orders because there was nowhere else
-- to put them. There is now. Removing this closes the door on a customer
-- creating an order for any amount they like.
drop policy if exists "orders_own_insert" on public.orders;

do $report$
declare
  unpaid_count int;
begin
  select count(*) into unpaid_count from public.orders where payment_status = 'unpaid';
  if unpaid_count > 0 then
    raise notice '% order(s) are still unpaid from before PayPal. They were never charged and can be deleted if they were tests.', unpaid_count;
  end if;
  raise notice 'PayPal columns ready. Browser-side order insert has been revoked.';
end
$report$;
