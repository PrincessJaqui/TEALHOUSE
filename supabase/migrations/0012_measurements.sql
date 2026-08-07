-- TEALHOUSE 0012  inches and centimetres
--
-- Every body measurement now carries both units side by side, and there
-- are measurement scales covering 18 to 100 inches for anything sized by
-- the body rather than by an alpha or numeric label.
--
-- Upsert, so running this twice is safe.


update public.size_scales
   set conversions = '[
  {"Alpha":"XXS","US":"00","EU/FR":"30","IT":"34","UK":"2",
   "Bust":"31\" / 79cm","Waist":"23-24\" / 58-61cm",
   "Hips":"33-34\" / 84-86cm"},
  {"Alpha":"XS","US":"0","EU/FR":"32","IT":"36","UK":"4",
   "Bust":"32\" / 81cm","Waist":"25\" / 64cm",
   "Hips":"35\" / 89cm"},
  {"Alpha":"XS","US":"2","EU/FR":"34","IT":"38","UK":"6",
   "Bust":"33\" / 84cm","Waist":"26\" / 66cm",
   "Hips":"36\" / 91cm"},
  {"Alpha":"S","US":"4","EU/FR":"36","IT":"40","UK":"8",
   "Bust":"34\" / 86cm","Waist":"27\" / 69cm",
   "Hips":"37\" / 94cm"},
  {"Alpha":"S","US":"6","EU/FR":"38","IT":"42","UK":"10",
   "Bust":"35\" / 89cm","Waist":"28\" / 71cm",
   "Hips":"38\" / 97cm"},
  {"Alpha":"M","US":"8","EU/FR":"40","IT":"44","UK":"12",
   "Bust":"36\" / 91cm","Waist":"29\" / 74cm",
   "Hips":"39\" / 99cm"},
  {"Alpha":"M","US":"10","EU/FR":"42","IT":"46","UK":"14",
   "Bust":"37.5\" / 95cm","Waist":"30.5\" / 77cm",
   "Hips":"40.5\" / 103cm"},
  {"Alpha":"L","US":"12","EU/FR":"44","IT":"48","UK":"16",
   "Bust":"39\" / 99cm","Waist":"32\" / 81cm",
   "Hips":"42\" / 107cm"},
  {"Alpha":"L","US":"14","EU/FR":"46","IT":"50","UK":"18",
   "Bust":"40.5\" / 103cm","Waist":"33.5\" / 85cm",
   "Hips":"43.5\" / 110cm"},
  {"Alpha":"XL","US":"16","EU/FR":"48","IT":"52","UK":"20",
   "Bust":"42\" / 107cm","Waist":"35\" / 89cm",
   "Hips":"45\" / 114cm"},
  {"Alpha":"XXL","US":"18","EU/FR":"50","IT":"54","UK":"22",
   "Bust":"44\" / 112cm","Waist":"37\" / 94cm",
   "Hips":"47\" / 119cm"}
]'::jsonb
 where key = 'us-womens';


update public.size_scales
   set conversions = '[
  {"Alpha":"XS","Chest":"34\" / 86cm","EU":"44",
   "Collar":"14-14.5\" / 36-37cm"},
  {"Alpha":"S","Chest":"36-38\" / 91-97cm","EU":"46-48",
   "Collar":"15-15.5\" / 38-39cm"},
  {"Alpha":"M","Chest":"40\" / 102cm","EU":"50",
   "Collar":"16-16.5\" / 41-42cm"},
  {"Alpha":"L","Chest":"42-44\" / 107-112cm","EU":"52-54",
   "Collar":"17-17.5\" / 43-44cm"},
  {"Alpha":"XL","Chest":"46\" / 117cm","EU":"56",
   "Collar":"18-18.5\" / 46-47cm"},
  {"Alpha":"XXL","Chest":"48-50\" / 122-127cm","EU":"58-60",
   "Collar":"19-19.5\" / 48-50cm"}
]'::jsonb
 where key = 'mens-tops';


update public.size_scales
   set conversions = '[
  {"Alpha":"XS","Waist":"28-29\" / 71-74cm","EU":"44"},
  {"Alpha":"S","Waist":"30-31\" / 76-79cm","EU":"46"},
  {"Alpha":"M","Waist":"32-33\" / 81-84cm","EU":"48"},
  {"Alpha":"L","Waist":"34-36\" / 86-91cm","EU":"50-52"},
  {"Alpha":"XL","Waist":"38\" / 97cm","EU":"54"},
  {"Alpha":"XXL","Waist":"40-42\" / 102-107cm","EU":"56-58"}
]'::jsonb
 where key = 'us-mens';


insert into public.size_scales
  (key, label, sizes, categories, sort_order, note, conversions)
values (
  'waist-inches',
  'Waist / Jeans (18 to 100 inches)',
  array[
    '18" / 46cm','19" / 48cm','20" / 51cm','21" / 53cm','22" / 56cm',
    '23" / 58cm','24" / 61cm','25" / 64cm','26" / 66cm','27" / 69cm',
    '28" / 71cm','29" / 74cm','30" / 76cm','31" / 79cm','32" / 81cm',
    '33" / 84cm','34" / 86cm','35" / 89cm','36" / 91cm','37" / 94cm',
    '38" / 97cm','39" / 99cm','40" / 102cm','41" / 104cm','42" / 107cm',
    '43" / 109cm','44" / 112cm','45" / 114cm','46" / 117cm','47" / 119cm',
    '48" / 122cm','49" / 124cm','50" / 127cm','51" / 130cm','52" / 132cm',
    '53" / 135cm','54" / 137cm','55" / 140cm','56" / 142cm','57" / 145cm',
    '58" / 147cm','59" / 150cm','60" / 152cm','61" / 155cm','62" / 157cm',
    '63" / 160cm','64" / 163cm','65" / 165cm','66" / 168cm','67" / 170cm',
    '68" / 173cm','69" / 175cm','70" / 178cm','71" / 180cm','72" / 183cm',
    '73" / 185cm','74" / 188cm','75" / 190cm','76" / 193cm','77" / 196cm',
    '78" / 198cm','79" / 201cm','80" / 203cm','81" / 206cm','82" / 208cm',
    '83" / 211cm','84" / 213cm','85" / 216cm','86" / 218cm','87" / 221cm',
    '88" / 224cm','89" / 226cm','90" / 229cm','91" / 231cm','92" / 234cm',
    '93" / 236cm','94" / 239cm','95" / 241cm','96" / 244cm','97" / 246cm',
    '98" / 249cm','99" / 251cm','100" / 254cm'
  ],
  array['apparel','resort-wear','accessories'],
  20,
  'Measured on the body. Both units are on the label, so no conversion is needed.',
  '[]'::jsonb
)
on conflict (key) do update set
  label = excluded.label,
  sizes = excluded.sizes,
  categories = excluded.categories,
  sort_order = excluded.sort_order,
  note = excluded.note;


insert into public.size_scales
  (key, label, sizes, categories, sort_order, note, conversions)
values (
  'hips-inches',
  'Hips (18 to 100 inches)',
  array[
    '18" / 46cm','19" / 48cm','20" / 51cm','21" / 53cm','22" / 56cm',
    '23" / 58cm','24" / 61cm','25" / 64cm','26" / 66cm','27" / 69cm',
    '28" / 71cm','29" / 74cm','30" / 76cm','31" / 79cm','32" / 81cm',
    '33" / 84cm','34" / 86cm','35" / 89cm','36" / 91cm','37" / 94cm',
    '38" / 97cm','39" / 99cm','40" / 102cm','41" / 104cm','42" / 107cm',
    '43" / 109cm','44" / 112cm','45" / 114cm','46" / 117cm','47" / 119cm',
    '48" / 122cm','49" / 124cm','50" / 127cm','51" / 130cm','52" / 132cm',
    '53" / 135cm','54" / 137cm','55" / 140cm','56" / 142cm','57" / 145cm',
    '58" / 147cm','59" / 150cm','60" / 152cm','61" / 155cm','62" / 157cm',
    '63" / 160cm','64" / 163cm','65" / 165cm','66" / 168cm','67" / 170cm',
    '68" / 173cm','69" / 175cm','70" / 178cm','71" / 180cm','72" / 183cm',
    '73" / 185cm','74" / 188cm','75" / 190cm','76" / 193cm','77" / 196cm',
    '78" / 198cm','79" / 201cm','80" / 203cm','81" / 206cm','82" / 208cm',
    '83" / 211cm','84" / 213cm','85" / 216cm','86" / 218cm','87" / 221cm',
    '88" / 224cm','89" / 226cm','90" / 229cm','91" / 231cm','92" / 234cm',
    '93" / 236cm','94" / 239cm','95" / 241cm','96" / 244cm','97" / 246cm',
    '98" / 249cm','99" / 251cm','100" / 254cm'
  ],
  array['apparel','resort-wear','accessories'],
  21,
  'Measured on the body. Both units are on the label, so no conversion is needed.',
  '[]'::jsonb
)
on conflict (key) do update set
  label = excluded.label,
  sizes = excluded.sizes,
  categories = excluded.categories,
  sort_order = excluded.sort_order,
  note = excluded.note;


insert into public.size_scales
  (key, label, sizes, categories, sort_order, note, conversions)
values (
  'chest-inches',
  'Chest (18 to 100 inches)',
  array[
    '18" / 46cm','19" / 48cm','20" / 51cm','21" / 53cm','22" / 56cm',
    '23" / 58cm','24" / 61cm','25" / 64cm','26" / 66cm','27" / 69cm',
    '28" / 71cm','29" / 74cm','30" / 76cm','31" / 79cm','32" / 81cm',
    '33" / 84cm','34" / 86cm','35" / 89cm','36" / 91cm','37" / 94cm',
    '38" / 97cm','39" / 99cm','40" / 102cm','41" / 104cm','42" / 107cm',
    '43" / 109cm','44" / 112cm','45" / 114cm','46" / 117cm','47" / 119cm',
    '48" / 122cm','49" / 124cm','50" / 127cm','51" / 130cm','52" / 132cm',
    '53" / 135cm','54" / 137cm','55" / 140cm','56" / 142cm','57" / 145cm',
    '58" / 147cm','59" / 150cm','60" / 152cm','61" / 155cm','62" / 157cm',
    '63" / 160cm','64" / 163cm','65" / 165cm','66" / 168cm','67" / 170cm',
    '68" / 173cm','69" / 175cm','70" / 178cm','71" / 180cm','72" / 183cm',
    '73" / 185cm','74" / 188cm','75" / 190cm','76" / 193cm','77" / 196cm',
    '78" / 198cm','79" / 201cm','80" / 203cm','81" / 206cm','82" / 208cm',
    '83" / 211cm','84" / 213cm','85" / 216cm','86" / 218cm','87" / 221cm',
    '88" / 224cm','89" / 226cm','90" / 229cm','91" / 231cm','92" / 234cm',
    '93" / 236cm','94" / 239cm','95" / 241cm','96" / 244cm','97" / 246cm',
    '98" / 249cm','99" / 251cm','100" / 254cm'
  ],
  array['apparel','resort-wear','accessories'],
  22,
  'Measured on the body. Both units are on the label, so no conversion is needed.',
  '[]'::jsonb
)
on conflict (key) do update set
  label = excluded.label,
  sizes = excluded.sizes,
  categories = excluded.categories,
  sort_order = excluded.sort_order,
  note = excluded.note;
