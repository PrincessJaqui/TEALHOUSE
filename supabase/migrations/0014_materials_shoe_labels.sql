-- TEALHOUSE 0014  materials and shoe labels
--
-- Two materials she asked for, and shoe sizes that read US and EU together
-- on the button rather than making a customer consult the chart.
--
-- Safe to run more than once.

insert into public.materials (name, sort_order) values
  ('Premium Polyester', 5),
  ('Lycra Lining', 6)
on conflict (name) do update set is_active = true;

-- Labels now carry both systems. The conversion charts on the size guide
-- are unchanged and still hold foot length in inches and centimetres.
update public.size_scales
   set sizes = array[
    'US 5 / EU 35','US 5.5 / EU 35.5','US 6 / EU 36',
    'US 6.5 / EU 36.5','US 7 / EU 37','US 7.5 / EU 37.5',
    'US 8 / EU 38','US 8.5 / EU 38.5','US 9 / EU 39',
    'US 9.5 / EU 39.5','US 10 / EU 40','US 10.5 / EU 40.5',
    'US 11 / EU 41','US 12 / EU 42'
  ]
 where key = 'footwear-us-womens';

update public.size_scales
   set sizes = array[
    'US 7 / EU 40','US 7.5 / EU 40.5','US 8 / EU 41',
    'US 8.5 / EU 41.5','US 9 / EU 42','US 9.5 / EU 42.5',
    'US 10 / EU 43','US 10.5 / EU 43.5','US 11 / EU 44',
    'US 11.5 / EU 44.5','US 12 / EU 45','US 13 / EU 46'
  ]
 where key = 'footwear-us-mens';

do $r$
declare
  n int;
begin
  select count(*) into n from public.products
   where sizes && array['5','6','7','8','9','10','11','12'];
  if n > 0 then
    raise notice 'HEADS UP: % product(s) hold plain US shoe labels.', n;
    raise notice 'Reopen each and re-tick its sizes.';
  end if;
end
$r$;
