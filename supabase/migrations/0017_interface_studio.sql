-- TEALHOUSE 0017  interface studio
--
-- Landing page content, editable from the admin rather than the code.
-- Fixed sections for now, but sort_order is here so they can be reordered
-- later without another migration.

create table if not exists public.interface_studio (
  id         bigserial primary key,
  section    text not null unique,
  sort_order integer not null default 0,
  is_active  boolean not null default true,
  content    jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.interface_studio enable row level security;

drop policy if exists interface_studio_read on public.interface_studio;
create policy interface_studio_read
  on public.interface_studio for select
  to anon, authenticated using (true);

drop policy if exists interface_studio_write on public.interface_studio;
create policy interface_studio_write
  on public.interface_studio for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- The six sections, seeded empty so the admin has something to fill in.
insert into public.interface_studio (section, sort_order, content) values
  ('hero', 1, '{}'::jsonb),
  ('editorial', 2, '{}'::jsonb),
  ('split_one', 3, '{"panels":[{},{}]}'::jsonb),
  ('carousel', 4, '{}'::jsonb),
  ('split_two', 5, '{"panels":[{},{}]}'::jsonb),
  ('spotlight', 6, '{}'::jsonb)
on conflict (section) do nothing;

-- Videos and editorial imagery. Separate from product-images so a large
-- hero film never sits in the same place as catalogue photography.
insert into storage.buckets (id, name, public, file_size_limit)
values ('site-media', 'site-media', true, 104857600)
on conflict (id) do update set
  public = true,
  file_size_limit = 104857600;

do $pol$
begin
  execute 'drop policy if exists site_media_read on storage.objects';
  execute 'drop policy if exists site_media_write on storage.objects';

  execute $p$
    create policy site_media_read on storage.objects
      for select to anon, authenticated
      using (bucket_id = 'site-media')
  $p$;

  execute $p$
    create policy site_media_write on storage.objects
      for all to authenticated
      using (bucket_id = 'site-media' and public.is_admin())
      with check (bucket_id = 'site-media' and public.is_admin())
  $p$;
end
$pol$;
