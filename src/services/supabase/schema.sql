-- ============================================================
-- WONDERKIN Supabase Foundation Schema — Batch 01
-- ============================================================
-- This is the FOUNDATION only. Gameplay-complete tables (full
-- mission trees, story chapters, treasure maps) are intentionally
-- out of scope until their respective batches.
--
-- Apply via Supabase SQL editor or CLI migrations.
-- ============================================================

-- Child profile (one per authenticated parent-managed account)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Adventurer',
  avatar_asset_id text,
  age_band text check (age_band in ('6-9')) default '6-9',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Companion state — the emotional spine, one companion per profile for now
create table if not exists companion_state (
  profile_id uuid primary key references profiles(id) on delete cascade,
  companion_id text not null default 'default_companion',
  mood text not null default 'idle',
  bond_level int not null default 0,
  updated_at timestamptz not null default now()
);

-- XP / level progression
create table if not exists progression (
  profile_id uuid primary key references profiles(id) on delete cascade,
  xp int not null default 0,
  level int not null default 1,
  updated_at timestamptz not null default now()
);

-- Currencies (primary + premium, extensible)
create table if not exists currencies (
  profile_id uuid primary key references profiles(id) on delete cascade,
  primary_currency int not null default 0,
  premium_currency int not null default 0,
  updated_at timestamptz not null default now()
);

-- Mission progress (foundation row per profile; per-mission detail rows come in a later batch)
create table if not exists mission_progress (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete cascade,
  mission_id text not null,
  status text not null default 'not_started' check (status in ('not_started','in_progress','complete')),
  updated_at timestamptz not null default now(),
  unique (profile_id, mission_id)
);

-- Story / Tale Trails progress
create table if not exists story_progress (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete cascade,
  story_id text not null,
  chapter_index int not null default 0,
  updated_at timestamptz not null default now(),
  unique (profile_id, story_id)
);

-- Inventory (collectibles, rewards)
create table if not exists inventory_items (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete cascade,
  item_asset_id text not null,
  quantity int not null default 1,
  acquired_at timestamptz not null default now()
);

-- Row Level Security — every table restricted to its own profile owner
alter table profiles enable row level security;
alter table companion_state enable row level security;
alter table progression enable row level security;
alter table currencies enable row level security;
alter table mission_progress enable row level security;
alter table story_progress enable row level security;
alter table inventory_items enable row level security;

create policy "Own profile" on profiles for all using (auth.uid() = id);
create policy "Own companion state" on companion_state for all using (auth.uid() = profile_id);
create policy "Own progression" on progression for all using (auth.uid() = profile_id);
create policy "Own currencies" on currencies for all using (auth.uid() = profile_id);
create policy "Own mission progress" on mission_progress for all using (auth.uid() = profile_id);
create policy "Own story progress" on story_progress for all using (auth.uid() = profile_id);
create policy "Own inventory" on inventory_items for all using (auth.uid() = profile_id);
