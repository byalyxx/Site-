-- Media kit storage for the live stats. Run once in Supabase: SQL Editor → New query → paste this → Run.
-- Safe to run again.
--
-- Row level security is on with no policies, so only the site's server (using the secret key) can read or
-- write these tables. Nothing here is reachable from a browser.

-- One row per platform per day. `m` = daily totals, `l` = lists ({ "listName": { "Row": number } }),
-- `totals` = lifetime counters read on that day, used to work out the next day's change (TikTok views,
-- Instagram post reach) for figures the platforms only give as running totals.
create table if not exists public.media_kit_days (
  platform text not null check (platform in ('tiktok', 'instagram', 'youtube')),
  date date not null,
  m jsonb not null default '{}'::jsonb,
  l jsonb not null default '{}'::jsonb,
  totals jsonb,
  updated_at timestamptz not null default now(),
  primary key (platform, date)
);

-- Uploads, for the chart tooltip ("this spike came from …").
create table if not exists public.media_kit_posts (
  platform text not null check (platform in ('tiktok', 'instagram', 'youtube')),
  id text not null,
  date date not null,
  time text,
  title text not null,
  thumbnail text,
  url text,
  views bigint not null default 0,
  engagement_rate numeric not null default 0,
  updated_at timestamptz not null default now(),
  primary key (platform, id)
);

-- Sign-in tokens from /media-kit/connect, and how the last refresh went.
create table if not exists public.media_kit_accounts (
  platform text primary key check (platform in ('tiktok', 'instagram', 'youtube')),
  token jsonb not null,
  handle text,
  last_sync timestamptz,
  last_error text,
  updated_at timestamptz not null default now()
);

alter table public.media_kit_days enable row level security;
alter table public.media_kit_posts enable row level security;
alter table public.media_kit_accounts enable row level security;

-- Post thumbnails, copied here because TikTok and Instagram image links expire after a few hours or days.
insert into storage.buckets (id, name, public)
values ('media-kit', 'media-kit', true)
on conflict (id) do nothing;
