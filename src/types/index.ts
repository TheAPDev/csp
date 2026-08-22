/** WONDERKIN Shared Types — Supabase foundation batch */

export interface Profile {
  id: string;
  display_name: string;
  avatar_asset_id: string | null;
  age_band: "6-9";
  created_at: string;
  updated_at: string;
}

export type CompanionMoodDb = "idle" | "happy" | "curious" | "sleepy" | "celebrating";

export interface CompanionState {
  profile_id: string;
  companion_id: string;
  mood: CompanionMoodDb;
  bond_level: number;
  updated_at: string;
}

export interface Progression {
  profile_id: string;
  xp: number;
  level: number;
  updated_at: string;
}

export interface Currencies {
  profile_id: string;
  primary_currency: number;
  premium_currency: number;
  updated_at: string;
}

export interface MissionProgress {
  id: string;
  profile_id: string;
  mission_id: string;
  status: "not_started" | "in_progress" | "complete";
  updated_at: string;
}

export interface StoryProgress {
  id: string;
  profile_id: string;
  story_id: string;
  chapter_index: number;
  updated_at: string;
}

export interface InventoryItem {
  id: string;
  profile_id: string;
  item_asset_id: string;
  quantity: number;
  acquired_at: string;
}
