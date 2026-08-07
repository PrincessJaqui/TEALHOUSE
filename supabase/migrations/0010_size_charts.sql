-- TEALHOUSE 0010  real size charts
--
-- `sizes` holds the labels used on buttons and in stock keys.
-- `conversions` holds the full chart the size guide renders.
-- Upsert, so running this twice is safe.

alter table public.size_scales
  add column if not exists conversions jsonb not null default '[]'::jsonb;
alter table public.size_scales
  add column if not exists note text;


insert into public.size_scales
  (key, label, sizes, categories, sort_order, note, conversions)
values (
  'alpha',
  'Alpha Sizing (XXS to 3XL)',
  array['XXS','XS','S','M','L','XL','XXL','3XL'],
  array['apparel','resort-wear','accessories'],
  1,
  'Commonly used across unisex, contemporary, and relaxed tailored garments.',
  '[
  {"Alpha":"XXS","Women US":"00","Men US Chest":"32\"","EU":"42"},
  {"Alpha":"XS","Women US":"0-2","Men US Chest":"34\"","EU":"44"},
  {"Alpha":"S","Women US":"4-6","Men US Chest":"36\"-38\"",
   "EU":"46-48"},
  {"Alpha":"M","Women US":"8-10","Men US Chest":"40\"","EU":"50"},
  {"Alpha":"L","Women US":"12-14","Men US Chest":"42\"-44\"",
   "EU":"52-54"},
  {"Alpha":"XL","Women US":"16-18","Men US Chest":"46\"",
   "EU":"56"},
  {"Alpha":"XXL / 2XL","Women US":"20-22",
   "Men US Chest":"48\"-50\"","EU":"58-60"},
  {"Alpha":"3XL","Women US":"24+","Men US Chest":"52\"","EU":"62"}
]'::jsonb
)
on conflict (key) do update set
  label = excluded.label,
  sizes = excluded.sizes,
  categories = excluded.categories,
  sort_order = excluded.sort_order,
  note = excluded.note,
  conversions = excluded.conversions;


insert into public.size_scales
  (key, label, sizes, categories, sort_order, note, conversions)
values (
  'us-womens',
  'Women''s Clothing (US 00 to 18)',
  array['00','0','2','4','6','8','10','12','14','16','18'],
  array['apparel','resort-wear'],
  2,
  'US numeric with EU, Italian and UK equivalents.',
  '[
  {"Alpha":"XXS","US":"00","EU/FR":"30","IT":"34","UK":"2",
   "Bust":"31\"","Waist":"23\"-24\"","Hips":"33\"-34\""},
  {"Alpha":"XS","US":"0","EU/FR":"32","IT":"36","UK":"4",
   "Bust":"32\"","Waist":"25\"","Hips":"35\""},
  {"Alpha":"XS","US":"2","EU/FR":"34","IT":"38","UK":"6",
   "Bust":"33\"","Waist":"26\"","Hips":"36\""},
  {"Alpha":"S","US":"4","EU/FR":"36","IT":"40","UK":"8",
   "Bust":"34\"","Waist":"27\"","Hips":"37\""},
  {"Alpha":"S","US":"6","EU/FR":"38","IT":"42","UK":"10",
   "Bust":"35\"","Waist":"28\"","Hips":"38\""},
  {"Alpha":"M","US":"8","EU/FR":"40","IT":"44","UK":"12",
   "Bust":"36\"","Waist":"29\"","Hips":"39\""},
  {"Alpha":"M","US":"10","EU/FR":"42","IT":"46","UK":"14",
   "Bust":"37.5\"","Waist":"30.5\"","Hips":"40.5\""},
  {"Alpha":"L","US":"12","EU/FR":"44","IT":"48","UK":"16",
   "Bust":"39\"","Waist":"32\"","Hips":"42\""},
  {"Alpha":"L","US":"14","EU/FR":"46","IT":"50","UK":"18",
   "Bust":"40.5\"","Waist":"33.5\"","Hips":"43.5\""},
  {"Alpha":"XL","US":"16","EU/FR":"48","IT":"52","UK":"20",
   "Bust":"42\"","Waist":"35\"","Hips":"45\""},
  {"Alpha":"XXL","US":"18","EU/FR":"50","IT":"54","UK":"22",
   "Bust":"44\"","Waist":"37\"","Hips":"47\""}
]'::jsonb
)
on conflict (key) do update set
  label = excluded.label,
  sizes = excluded.sizes,
  categories = excluded.categories,
  sort_order = excluded.sort_order,
  note = excluded.note,
  conversions = excluded.conversions;


insert into public.size_scales
  (key, label, sizes, categories, sort_order, note, conversions)
values (
  'us-mens',
  'Men''s Bottoms (Trousers & Denim)',
  array['XS','S','M','L','XL','XXL'],
  array['apparel'],
  3,
  null,
  '[
  {"Alpha":"XS","US Waist":"28-29","EU":"44"},
  {"Alpha":"S","US Waist":"30-31","EU":"46"},
  {"Alpha":"M","US Waist":"32-33","EU":"48"},
  {"Alpha":"L","US Waist":"34-36","EU":"50-52"},
  {"Alpha":"XL","US Waist":"38","EU":"54"},
  {"Alpha":"XXL","US Waist":"40-42","EU":"56-58"}
]'::jsonb
)
on conflict (key) do update set
  label = excluded.label,
  sizes = excluded.sizes,
  categories = excluded.categories,
  sort_order = excluded.sort_order,
  note = excluded.note,
  conversions = excluded.conversions;


insert into public.size_scales
  (key, label, sizes, categories, sort_order, note, conversions)
values (
  'mens-tops',
  'Men''s Tops & Tailoring',
  array['XS','S','M','L','XL','XXL'],
  array['apparel'],
  4,
  null,
  '[
  {"Alpha":"XS","Chest":"34","EU":"44","Collar":"14\"-14.5\""},
  {"Alpha":"S","Chest":"36-38","EU":"46-48",
   "Collar":"15\"-15.5\""},
  {"Alpha":"M","Chest":"40","EU":"50","Collar":"16\"-16.5\""},
  {"Alpha":"L","Chest":"42-44","EU":"52-54",
   "Collar":"17\"-17.5\""},
  {"Alpha":"XL","Chest":"46","EU":"56","Collar":"18\"-18.5\""},
  {"Alpha":"XXL","Chest":"48-50","EU":"58-60",
   "Collar":"19\"-19.5\""}
]'::jsonb
)
on conflict (key) do update set
  label = excluded.label,
  sizes = excluded.sizes,
  categories = excluded.categories,
  sort_order = excluded.sort_order,
  note = excluded.note,
  conversions = excluded.conversions;


insert into public.size_scales
  (key, label, sizes, categories, sort_order, note, conversions)
values (
  'footwear-us-womens',
  'Women''s Shoes (US 5 to 12)',
  array['5','5.5','6','6.5','7','7.5','8','8.5','9','9.5','10','10.5','11','12'],
  array['shoes'],
  5,
  null,
  '[
  {"US":"5","EU":"35","Inches":"8.5\"","CM":"21.6"},
  {"US":"5.5","EU":"35.5","Inches":"8.75\"","CM":"22.2"},
  {"US":"6","EU":"36","Inches":"8.875\"","CM":"22.5"},
  {"US":"6.5","EU":"36.5","Inches":"9.06\"","CM":"23.0"},
  {"US":"7","EU":"37","Inches":"9.25\"","CM":"23.5"},
  {"US":"7.5","EU":"37.5","Inches":"9.375\"","CM":"23.8"},
  {"US":"8","EU":"38","Inches":"9.5\"","CM":"24.1"},
  {"US":"8.5","EU":"38.5","Inches":"9.687\"","CM":"24.6"},
  {"US":"9","EU":"39","Inches":"9.875\"","CM":"25.1"},
  {"US":"9.5","EU":"39.5","Inches":"10.0\"","CM":"25.4"},
  {"US":"10","EU":"40","Inches":"10.187\"","CM":"25.9"},
  {"US":"10.5","EU":"40.5","Inches":"10.312\"","CM":"26.2"},
  {"US":"11","EU":"41","Inches":"10.5\"","CM":"26.7"},
  {"US":"12","EU":"42","Inches":"10.812\"","CM":"27.5"}
]'::jsonb
)
on conflict (key) do update set
  label = excluded.label,
  sizes = excluded.sizes,
  categories = excluded.categories,
  sort_order = excluded.sort_order,
  note = excluded.note,
  conversions = excluded.conversions;


insert into public.size_scales
  (key, label, sizes, categories, sort_order, note, conversions)
values (
  'footwear-us-mens',
  'Men''s Shoes (US 7 to 13)',
  array['7','7.5','8','8.5','9','9.5','10','10.5','11','11.5','12','13'],
  array['shoes'],
  6,
  null,
  '[
  {"US":"7","EU":"40","Inches":"9.625\"","CM":"24.4"},
  {"US":"7.5","EU":"40.5","Inches":"9.75\"","CM":"24.8"},
  {"US":"8","EU":"41","Inches":"9.937\"","CM":"25.2"},
  {"US":"8.5","EU":"41.5","Inches":"10.125\"","CM":"25.7"},
  {"US":"9","EU":"42","Inches":"10.25\"","CM":"26.0"},
  {"US":"9.5","EU":"42.5","Inches":"10.437\"","CM":"26.5"},
  {"US":"10","EU":"43","Inches":"10.562\"","CM":"26.8"},
  {"US":"10.5","EU":"43.5","Inches":"10.75\"","CM":"27.3"},
  {"US":"11","EU":"44","Inches":"10.937\"","CM":"27.8"},
  {"US":"11.5","EU":"44.5","Inches":"11.125\"","CM":"28.3"},
  {"US":"12","EU":"45","Inches":"11.25\"","CM":"28.6"},
  {"US":"13","EU":"46","Inches":"11.562\"","CM":"29.4"}
]'::jsonb
)
on conflict (key) do update set
  label = excluded.label,
  sizes = excluded.sizes,
  categories = excluded.categories,
  sort_order = excluded.sort_order,
  note = excluded.note,
  conversions = excluded.conversions;


-- The EU-only footwear scale is superseded by the two shoe charts above,
-- which carry EU as a conversion. Left active. Hide it if you want with:
--   update public.size_scales set is_active = false
--    where key = 'footwear-eu';
