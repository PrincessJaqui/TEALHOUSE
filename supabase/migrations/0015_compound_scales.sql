-- TEALHOUSE 0015  compound scales and measurement dropdowns
--
-- A scale can now be compound: bra size is a band and a cup, chosen from
-- two dropdowns that combine into one value. Made to measure uses the
-- parts container, so each part carries whichever scale suits it.
--
-- Safe to run more than once.

alter table public.size_scales
  add column if not exists components jsonb;

-- Bra, now from 28 band and up to EE cup, as she asked.
-- The flat list is what a stocked product uses; components drive the two
-- dropdowns a made to measure product shows.
update public.size_scales
   set label = 'Bra (28A to 42EE)',
       sizes = array[
    '28A','28B','28C','28D','28DD','28DDD',
    '28E','28EE','30A','30B','30C','30D',
    '30DD','30DDD','30E','30EE','32A','32B',
    '32C','32D','32DD','32DDD','32E','32EE',
    '34A','34B','34C','34D','34DD','34DDD',
    '34E','34EE','36A','36B','36C','36D',
    '36DD','36DDD','36E','36EE','38A','38B',
    '38C','38D','38DD','38DDD','38E','38EE',
    '40A','40B','40C','40D','40DD','40DDD',
    '40E','40EE','42A','42B','42C','42D',
    '42DD','42DDD','42E','42EE'
  ],
       components = '{
 "join":"",
 "parts":[
  {
   "label":"Band",
   "values":[
    "28",
    "30",
    "32",
    "34",
    "36",
    "38",
    "40",
    "42"
   ]
  },
  {
   "label":"Cup",
   "values":[
    "A",
    "B",
    "C",
    "D",
    "DD",
    "DDD",
    "E",
    "EE"
   ]
  }
 ]
}'::jsonb,
       categories = array['resort-wear','apparel','accessories']
 where key = 'bra';

-- A plain measurement dropdown, for a part sized by the body rather than
-- by a label. Half-inch steps, both units on every option.
insert into public.size_scales
  (key, label, sizes, categories, sort_order, note, conversions)
values (
  'measurement-inches',
  'Measurement (inches / cm)',
  array[
    '18" / 46cm','18.5" / 47cm','19" / 48cm','19.5" / 50cm',
    '20" / 51cm','20.5" / 52cm','21" / 53cm','21.5" / 55cm',
    '22" / 56cm','22.5" / 57cm','23" / 58cm','23.5" / 60cm',
    '24" / 61cm','24.5" / 62cm','25" / 64cm','25.5" / 65cm',
    '26" / 66cm','26.5" / 67cm','27" / 69cm','27.5" / 70cm',
    '28" / 71cm','28.5" / 72cm','29" / 74cm','29.5" / 75cm',
    '30" / 76cm','30.5" / 77cm','31" / 79cm','31.5" / 80cm',
    '32" / 81cm','32.5" / 83cm','33" / 84cm','33.5" / 85cm',
    '34" / 86cm','34.5" / 88cm','35" / 89cm','35.5" / 90cm',
    '36" / 91cm','36.5" / 93cm','37" / 94cm','37.5" / 95cm',
    '38" / 97cm','38.5" / 98cm','39" / 99cm','39.5" / 100cm',
    '40" / 102cm','40.5" / 103cm','41" / 104cm','41.5" / 105cm',
    '42" / 107cm','42.5" / 108cm','43" / 109cm','43.5" / 110cm',
    '44" / 112cm','44.5" / 113cm','45" / 114cm','45.5" / 116cm',
    '46" / 117cm','46.5" / 118cm','47" / 119cm','47.5" / 121cm',
    '48" / 122cm','48.5" / 123cm','49" / 124cm','49.5" / 126cm',
    '50" / 127cm','50.5" / 128cm','51" / 130cm','51.5" / 131cm',
    '52" / 132cm','52.5" / 133cm','53" / 135cm','53.5" / 136cm',
    '54" / 137cm','54.5" / 138cm','55" / 140cm','55.5" / 141cm',
    '56" / 142cm','56.5" / 144cm','57" / 145cm','57.5" / 146cm',
    '58" / 147cm','58.5" / 149cm','59" / 150cm','59.5" / 151cm',
    '60" / 152cm','60.5" / 154cm','61" / 155cm','61.5" / 156cm',
    '62" / 157cm','62.5" / 159cm','63" / 160cm','63.5" / 161cm',
    '64" / 163cm','64.5" / 164cm','65" / 165cm','65.5" / 166cm',
    '66" / 168cm','66.5" / 169cm','67" / 170cm','67.5" / 171cm',
    '68" / 173cm','68.5" / 174cm','69" / 175cm','69.5" / 177cm',
    '70" / 178cm','70.5" / 179cm','71" / 180cm','71.5" / 182cm',
    '72" / 183cm','72.5" / 184cm','73" / 185cm','73.5" / 187cm',
    '74" / 188cm','74.5" / 189cm','75" / 190cm','75.5" / 192cm',
    '76" / 193cm','76.5" / 194cm','77" / 196cm','77.5" / 197cm',
    '78" / 198cm','78.5" / 199cm','79" / 201cm','79.5" / 202cm',
    '80" / 203cm','80.5" / 204cm','81" / 206cm','81.5" / 207cm',
    '82" / 208cm','82.5" / 210cm','83" / 211cm','83.5" / 212cm',
    '84" / 213cm','84.5" / 215cm','85" / 216cm','85.5" / 217cm',
    '86" / 218cm','86.5" / 220cm','87" / 221cm','87.5" / 222cm',
    '88" / 224cm','88.5" / 225cm','89" / 226cm','89.5" / 227cm',
    '90" / 229cm','90.5" / 230cm','91" / 231cm','91.5" / 232cm',
    '92" / 234cm','92.5" / 235cm','93" / 236cm','93.5" / 237cm',
    '94" / 239cm','94.5" / 240cm','95" / 241cm','95.5" / 243cm',
    '96" / 244cm','96.5" / 245cm','97" / 246cm','97.5" / 248cm',
    '98" / 249cm','98.5" / 250cm','99" / 251cm','99.5" / 253cm',
    '100" / 254cm'
  ],
  array['apparel','resort-wear','accessories','shoes'],
  30,
  'Chosen by the customer on a made to measure piece.',
  '[]'::jsonb
)
on conflict (key) do update set
  label = excluded.label,
  sizes = excluded.sizes,
  categories = excluded.categories,
  note = excluded.note,
  is_active = true;

do $r$
begin
  raise notice 'Compound scales ready. Bra runs 28A to 42EE.';
end
$r$;
