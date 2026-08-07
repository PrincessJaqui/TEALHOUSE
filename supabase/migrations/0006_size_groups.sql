-- TEALHOUSE 0006  multi-part sizing
--
-- Lets one product carry more than one size choice, for example a bikini
-- where the customer picks a top size and a bottom size independently.
--
-- Stock is held PER PIECE, so six tops in S and two bottoms in M are two
-- separate counts. Buying S top with M bottom takes one from each. Stock
-- keys become "Top:S" and "Bottom:M". Single-size products keep their
-- existing plain keys ("38") and sizeless products keep "default".
--
-- Safe to run more than once.

alter table public.products
  add column if not exists size_groups jsonb not null default '[]'::jsonb;

alter table public.products
  add column if not exists size_scale text;

-- size was an integer everywhere, which cannot hold XS, 00 or 34DD.
alter table public.products
  add column if not exists size_labels text[] default '{}';

do $cart$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'cart'
      and column_name = 'size' and data_type = 'integer'
  ) then
    alter table public.cart
      alter column size type text using size::text;
    raise notice 'cart.size converted from integer to text';
  end if;
end
$cart$;

alter table public.cart
  add column if not exists sizes jsonb;

-- Stock enforcement, now aware of per-piece decrements.
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

    keys := '{}';

    -- Multi-part product: one key per piece, for example Top:S plus
    -- Bottom:M. Each is decremented separately.
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
  raise notice 'Multi-part sizing ready. Stock is held per piece.';
end
$r$;
