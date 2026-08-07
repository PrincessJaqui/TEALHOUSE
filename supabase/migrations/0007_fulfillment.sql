-- TEALHOUSE 0007  pre-order and made to order
--
-- Three ways a product can be sold:
--   in_stock       today's behaviour, stock is checked and decremented
--   pre_order      sells past zero stock, shows an estimated ship date
--   made_to_order  bespoke. No stock at all. PayPal charges the retainer,
--                  not the price, because the final price is not known
--                  until the specification is agreed.
--
-- Safe to run more than once.

alter table public.products
  add column if not exists fulfillment_type text not null default 'in_stock';

alter table public.products
  drop constraint if exists products_fulfillment_type_check;
alter table public.products
  add constraint products_fulfillment_type_check
  check (fulfillment_type in ('in_stock', 'pre_order', 'made_to_order'));

-- Fixed retainer taken at checkout for a bespoke piece. It counts toward
-- the final price, which is invoiced separately once specified.
alter table public.products
  add column if not exists retainer_amount numeric(10,2);

-- Estimated only, and the storefront says so.
alter table public.products
  add column if not exists preorder_ships_on date;

-- The customer's specification for a bespoke piece.
alter table public.cart
  add column if not exists notes text;

alter table public.orders
  add column if not exists has_bespoke boolean not null default false;

create index if not exists products_fulfillment_idx
  on public.products (fulfillment_type)
  where fulfillment_type <> 'in_stock';

-- Stock enforcement, now skipping anything not sold from stock.
create or replace function public.reserve_order_stock()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $s$
declare
  line     jsonb;
  pid      bigint;
  want     integer;
  have     integer;
  pname    text;
  ftype    text;
  size_key text;
  grp      text;
  val      text;
  keys     text[];
begin
  for line in
    select * from jsonb_array_elements(coalesce(new.items, '[]'::jsonb))
  loop
    pid  := (line ->> 'product_id')::bigint;
    want := coalesce((line ->> 'quantity')::integer, 0);

    if pid is null or want <= 0 then
      continue;
    end if;

    -- Read the type from the product, not the order line, so a crafted
    -- request cannot claim pre-order to bypass the stock check.
    select p.fulfillment_type into ftype
      from public.products p where p.id = pid;

    if ftype is distinct from 'in_stock' then
      continue;
    end if;

    keys := '{}';

    if jsonb_typeof(line -> 'sizes') = 'object' then
      for grp, val in
        select key, value from jsonb_each_text(line -> 'sizes')
      loop
        keys := keys || (grp || ':' || val);
      end loop;
    else
      keys := array[coalesce(nullif(line ->> 'size', ''), 'default')];
    end if;

    foreach size_key in array keys loop
      select p.name, coalesce((p.stock ->> size_key)::integer, 0)
        into pname, have
        from public.products p
       where p.id = pid
       for update;

      if not found then
        raise exception 'Product % is no longer available', pid;
      end if;

      if have < want then
        raise exception
          'Not enough stock for % (%): % left, % requested',
          pname, size_key, have, want;
      end if;

      update public.products
         set stock = jsonb_set(stock, array[size_key], to_jsonb(have - want))
       where id = pid;
    end loop;
  end loop;

  return new;
end
$s$;

drop trigger if exists orders_reserve_stock on public.orders;
create trigger orders_reserve_stock
  before insert on public.orders
  for each row execute function public.reserve_order_stock();

do $r$
begin
  raise notice 'Pre-order and made to order ready.';
end
$r$;
