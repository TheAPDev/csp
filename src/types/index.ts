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
  /** Batch 03 — additive fields, do not restructure existing ones (see §11). */
  adventure_tickets: number;
  collector_tokens: number;
  updated_at: string;
}

export interface MissionProgress {
  id: string;
  profile_id: string;
  mission_id: string;
  status: "not_started" | "in_progress" | "complete";
  updated_at: string;
}

/** WONDERKIN Shared Types — Batch 04 (Missions) */

export type MissionCategory =
  | "kindDeeds"
  | "braveSparks"
  | "curiousFinds"
  | "storyVoices"
  | "groveBonds";

export type QuestLength = "quick" | "long";

/**
 * Every submission architecture the Missions system must support.
 * Only "photo" is behaviorally implemented in Batch 04 — the rest
 * exist as a stable contract so a later batch can wire them in
 * without reshaping mission content or the verification service.
 */
export type SubmissionType =
  | "photo"
  | "voice"
  | "video"
  | "reflection"
  | "quiz"
  | "guardian"
  | "location";

export interface MissionReward {
  xp: number;
  coins: number;
  adventureTickets?: number;
  collectorTokens?: number;
}

export interface MissionDefinition {
  id: string;
  category: MissionCategory;
  length: QuestLength;
  title: string;
  /** Child-facing task description — never mentions a trait by name. */
  prompt: string;
  submissionType: SubmissionType;
  reward: MissionReward;
  /** Internal-only trait lean granted on completion. Never shown to the child. */
  traitLean: Partial<CompanionTraits>;
}

export interface StoryProgress {
  id: string;
  profile_id: string;
  story_id: string;
  chapter_index: number;
  updated_at: string;
}

/** WONDERKIN Shared Types — Batch 05 (Tale Trails) */

/**
 * A lightweight branch offered mid-episode. Picking one plays a short
 * reaction beat, then the story reconnects to the same closing beats
 * regardless of choice — deliberately not a branching tree. Reuses
 * `CompanionMood` (from `CompanionReaction`) rather than inventing a
 * parallel mood enum.
 */
export interface StoryChoiceOption {
  id: string;
  label: string;
  companionLine: string;
  mood: import("@components/CompanionReaction").CompanionMood;
}

export interface StoryChoicePrompt {
  speaker: string;
  line: string;
  options: [StoryChoiceOption, StoryChoiceOption];
}

export interface StoryEpisodeDefinition {
  id: string;
  title: string;
  /** One-line hook shown on the discovery card. */
  teaser: string;
  /** Used as both the card's art and the first beat's implicit setting. */
  thumbnailAssetId: import("@assets/registry").AssetId;
  /** false = a beautifully "sealed" chapter, not a dead button — see `EpisodeCard`. */
  available: boolean;
  openingBeats: import("@story/types").StoryBeat[];
  /** Omit for a purely linear episode — not every episode needs a branch. */
  choice?: StoryChoicePrompt;
  closingBeats: import("@story/types").StoryBeat[];
  /** Companion's conversational reflection — never a "moral", never evaluative. */
  firesideLine: string;
  reward: MissionReward;
  traitLean: Partial<CompanionTraits>;
}

export interface InventoryItem {
  id: string;
  profile_id: string;
  item_asset_id: string;
  quantity: number;
  acquired_at: string;
}

/** WONDERKIN Shared Types — Batch 02 (first-time child journey) */

/** The three mysterious eggs offered at first launch. Never shown to the child as labels. */
export type EggId = "eggEmber" | "eggTide" | "eggWhisper";

/**
 * Five continuous internal Companion traits (0..1). These are never
 * surfaced to the child as a number or grade — see Child UX Rule §9.
 * Batches that read personality should read these, not invent a
 * parallel trait system.
 */
export interface CompanionTraits {
  heart: number;
  courage: number;
  curiosity: number;
  voice: number;
  bond: number;
}

/** WONDERKIN Shared Types — Batch 03 (The Grove) */

/**
 * How far the Grove environment has bloomed. Derived from progression
 * (see `groveStore.evolutionStage`), never chosen ad-hoc by a screen.
 * Stage only ever increases — the Grove never regresses visually.
 */
export type GroveEvolutionStage = 0 | 1 | 2;

export interface GroveState {
  profile_id: string;
  evolution_stage: GroveEvolutionStage;
  last_visited_at: string;
  updated_at: string;
}

export type NotificationKind = "companion" | "adventure" | "reward" | "system";

export interface NotificationItem {
  id: string;
  profile_id: string;
  kind: NotificationKind;
  message: string;
  read: boolean;
  created_at: string;
}
