-- TEALHOUSE 0013  made to measure
--
-- A fourth way to sell. The piece and its price are known, but it is cut
-- to the customer's own measurements, so it does not come out of stock and
-- it takes longer than a shelf item.
--
--   in_stock        picked off the shelf, stock is decremented
--   pre_order       sells past zero, shows an estimated ship date
--   made_to_measure the Ali swimsuit: standard design, your measurements
--   made_to_order   bespoke, retainer, price agreed afterwards
--
-- Safe to run more than once.

alter table public.products
  drop constraint if exists products_fulfillment_type_check;
alter table public.products
  add constraint products_fulfillment_type_check
  check (fulfillment_type in
    ('in_stock', 'pre_order', 'made_to_measure', 'made_to_order'));

-- Which measurements the customer is asked for, for example
-- {Chest,Waist,Hips} on the Ali swimsuit.
alter table public.products
  add column if not exists measurement_fields text[] not null default '{}';

-- "Allow about six weeks." Shown on the product page and at checkout.
alter table public.products
  add column if not exists lead_time_weeks integer;

-- What the customer actually chose, for example
-- {"Chest":"34\" / 86cm","Waist":"27\" / 69cm"}
alter table public.cart
  add column if not exists measurements jsonb;

-- The stock trigger already skips anything that is not in_stock, so a made
-- to measure order will not decrement. Nothing to change there.

do $r$
begin
  raise notice 'Made to measure ready.';
end
$r$;
