-- TEALHOUSE 0009  colour-aware stock, optional parts
--
-- Stock keys gain an optional colour prefix, and the trigger reads the
-- colour from the order line. Parts may now be optional and priced
-- individually, so an order can contain one bikini top on its own.

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
  prefix   text;
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

    prefix := coalesce(nullif(line ->> 'color', '') || '|', '');
    keys := '{}';

    if jsonb_typeof(line -> 'sizes') = 'object' then
      for grp, val in
        select key, value from jsonb_each_text(line -> 'sizes')
      loop
        keys := keys || (prefix || grp || ':' || val);
      end loop;
    else
      keys := array[
        prefix || coalesce(nullif(line ->> 'size', ''), 'default')
      ];
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
          pname, replace(size_key, '|', ' '), have, want;
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
