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
  -- Batch 03: additive columns for The Grove's status system. Existing
  -- columns above are unchanged, per WONDERKIN_CONTINUITY §11.
  adventure_tickets int not null default 1,
  collector_tokens int not null default 0,
  updated_at timestamptz not null default now()
);

-- Ensure the columns exist even when applying this file against an
-- already-provisioned Batch 01/02 database (idempotent upgrade path).
alter table currencies add column if not exists adventure_tickets int not null default 1;
alter table currencies add column if not exists collector_tokens int not null default 0;

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

-- ============================================================
-- Batch 03 — The Grove
-- ============================================================

-- Grove environmental state (evolution stage + last visit). The
-- evolution stage itself is derived client-side from `progression`
-- (see src/state/groveStore.ts); this table just persists it so a
-- returning session on a new device shows the same bloomed Grove.
create table if not exists grove_state (
  profile_id uuid primary key references profiles(id) on delete cascade,
  evolution_stage int not null default 0 check (evolution_stage in (0, 1, 2)),
  last_visited_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Notifications — the "Notifications" status surface. Read via the
-- Grove's single unobtrusive StatusHub, never a dashboard list.
create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete cascade,
  kind text not null check (kind in ('companion', 'adventure', 'reward', 'system')),
  message text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

-- ============================================================
-- Batch 04 — Missions
-- ============================================================

-- Mission definitions are reference content, not per-profile data —
-- readable by any signed-in profile. The app ships with a local seed
-- (src/missions/content/missionDefinitions.ts) and falls back to it
-- if this table is empty/unreachable, so Missions never depends on a
-- live Supabase connection to be playable.
create table if not exists mission_definitions (
  id text primary key,
  category text not null,
  quest_length text not null check (quest_length in ('quick', 'long')),
  title text not null,
  prompt text not null,
  submission_type text not null,
  reward jsonb not null,
  created_at timestamptz not null default now()
);

-- One row per attempt. `photo` is the only submission_type with a
-- real capture/verify flow in Batch 04; others are accepted here for
-- forward-compatibility but not yet produced by the app.
create table if not exists mission_submissions (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete cascade,
  mission_id text not null,
  submission_type text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'retry')),
  companion_feedback text,
  created_at timestamptz not null default now()
);

-- One row per granted reward (kept separate from mission_progress so
-- a mission's full reward history is queryable, e.g. for a future
-- Parent Space summary).
create table if not exists mission_rewards (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete cascade,
  mission_id text not null,
  xp int not null default 0,
  coins int not null default 0,
  adventure_tickets int not null default 0,
  collector_tokens int not null default 0,
  granted_at timestamptz not null default now()
);

-- Extend the existing Batch 01 mission_progress table rather than
-- replace it — see WONDERKIN_CONTINUITY "extend, don't restructure".
alter table mission_progress add column if not exists last_submission_id uuid references mission_submissions(id);
alter table mission_progress add column if not exists completed_at timestamptz;

alter table mission_definitions enable row level security;
alter table mission_submissions enable row level security;
alter table mission_rewards enable row level security;

create policy "Public read mission definitions" on mission_definitions for select using (true);
create policy "Own mission submissions" on mission_submissions for all using (auth.uid() = profile_id);
create policy "Own mission rewards" on mission_rewards for all using (auth.uid() = profile_id);

-- Row Level Security — every table restricted to its own profile owner
alter table profiles enable row level security;
alter table companion_state enable row level security;
alter table progression enable row level security;
alter table currencies enable row level security;
alter table mission_progress enable row level security;
alter table story_progress enable row level security;
alter table inventory_items enable row level security;
alter table grove_state enable row level security;
alter table notifications enable row level security;

create policy "Own profile" on profiles for all using (auth.uid() = id);
create policy "Own companion state" on companion_state for all using (auth.uid() = profile_id);
create policy "Own progression" on progression for all using (auth.uid() = profile_id);
create policy "Own currencies" on currencies for all using (auth.uid() = profile_id);
create policy "Own mission progress" on mission_progress for all using (auth.uid() = profile_id);
create policy "Own story progress" on story_progress for all using (auth.uid() = profile_id);
create policy "Own inventory" on inventory_items for all using (auth.uid() = profile_id);
create policy "Own grove state" on grove_state for all using (auth.uid() = profile_id);
create policy "Own notifications" on notifications for all using (auth.uid() = profile_id);
