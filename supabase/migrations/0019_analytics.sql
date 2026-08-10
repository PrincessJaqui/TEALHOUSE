-- TEALHOUSE 0019  analytics events
--
-- Her own numbers in her own admin. No third party, no cookie banner, and
-- the data stays in her database.
--
-- Anyone may write an event, because the storefront logs them for signed-out
-- visitors. Only an admin may read them, so the log cannot be scraped.

create table if not exists public.analytics_events (
  id         bigserial primary key,
  event      text not null,
  product_id bigint,
  path       text,
  referrer   text,
  session_id text,
  metadata   jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.analytics_events
  drop constraint if exists analytics_events_event_check;
alter table public.analytics_events
  add constraint analytics_events_event_check
  check (event in (
    'page_view',
    'product_view',
    'add_to_cart',
    'begin_checkout',
    'purchase'
  ));

create index if not exists analytics_events_created_idx
  on public.analytics_events (created_at desc);
create index if not exists analytics_events_event_idx
  on public.analytics_events (event, created_at desc);
create index if not exists analytics_events_product_idx
  on public.analytics_events (product_id)
  where product_id is not null;

alter table public.analytics_events enable row level security;

drop policy if exists analytics_events_insert on public.analytics_events;
create policy analytics_events_insert
  on public.analytics_events for insert
  to anon, authenticated
  with check (true);

drop policy if exists analytics_events_read on public.analytics_events;
create policy analytics_events_read
  on public.analytics_events for select
  to authenticated
  using (public.is_admin());
