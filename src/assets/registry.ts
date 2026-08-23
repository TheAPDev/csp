/**
 * WONDERKIN Asset Registry
 * ------------------------------------------------------------------
 * RULE: UI and game logic must NEVER reference image/audio filenames
 * directly. Always reference a semantic AssetId through this registry.
 *
 * This lets any visual asset be swapped later (final illustration,
 * localized art, seasonal variant) without touching business logic,
 * navigation, or state.
 *
 * To add a real asset:
 *   1. Drop the file into src/assets/images or src/assets/audio
 *   2. Add its semantic ID below
 *   3. Point the require() at the real file
 *
 * Until real art exists, entries resolve to `null` and consuming
 * components must render a themed placeholder (see components/Card,
 * WorldScene) rather than crashing.
 */

export type AssetId =
  // Companion
  | "COMPANION_IDLE"
  | "COMPANION_HAPPY"
  | "COMPANION_CURIOUS"
  | "COMPANION_SLEEPY"
  | "COMPANION_CELEBRATING"
  // Worlds
  | "GROVE_BACKGROUND"
  | "MISSIONS_BACKGROUND"
  | "TALE_TRAILS_BACKGROUND"
  | "TREASURE_HUNT_BACKGROUND"
  | "THE_BEYOND_BACKGROUND"
  // Collectibles / rewards (examples — extend as needed)
  | "EGG_ONE"
  | "EGG_TWO"
  | "EGG_THREE"
  // First-time onboarding (Batch 02)
  | "ONBOARDING_WELCOME_BACKGROUND"
  | "ONBOARDING_STORY_BACKGROUND"
  // Grove environmental evolution stages (Batch 03) — background varies
  // with progression; business logic never hardcodes which stage looks
  // like what, it only picks the AssetId via groveStore.
  | "GROVE_BACKGROUND_BLOOM"
  | "GROVE_BACKGROUND_RADIANT"
  // Grove living-environment layer (Batch 03)
  | "GROVE_COMPANION_PLATFORM"
  // World gateway portals, rendered from inside the Grove (Batch 03)
  | "GATEWAY_MISSIONS"
  | "GATEWAY_TALE_TRAILS"
  | "GATEWAY_TREASURE_HUNT"
  | "GATEWAY_THE_BEYOND"
  // Missions (Batch 04)
  | "MISSION_CARD_KIND_DEEDS"
  | "MISSION_CARD_BRAVE_SPARKS"
  | "MISSION_CARD_CURIOUS_FINDS"
  | "MISSION_CARD_STORY_VOICES"
  | "MISSION_CARD_GROVE_BONDS"
  | "REWARD_XP_SPARKLE"
  | "REWARD_COIN"
  | "REWARD_ADVENTURE_TICKET"
  | "REWARD_COLLECTOR_TOKEN"
  // Icons (semantic, not literal)
  | "ICON_XP"
  | "ICON_CURRENCY_PRIMARY"
  | "ICON_CURRENCY_PREMIUM"
  | "ICON_ADVENTURE_TICKET"
  | "ICON_COLLECTOR_TOKEN"
  | "ICON_NOTIFICATION"
  | "ICON_MISSION"
  | "ICON_STORY"
  | "ICON_TREASURE"
  | "ICON_SETTINGS"
  // Tale Trails (Batch 05)
  | "STORY_LANTERN_PATH_BG"
  | "STORY_LANTERN_PATH_GLADE_BG"
  | "STORY_TIDE_COVE_BG"
  | "STORY_TIDE_COVE_DEPTHS_BG"
  | "STORY_SEALED_CHAPTER"
  | "FIRESIDE_BACKGROUND"

  // Treasure Hunt (Batch 06) — dummy demo treasures + collection FX
  | "TREASURE_ACORN"
  | "TREASURE_SHELL"
  | "TREASURE_LANTERN_GEM"
  | "TREASURE_FEATHER"
  | "TREASURE_CRYSTAL"
  | "TREASURE_STAR_FRAGMENT"
  | "TREASURE_MARKER_GLOW";

export type AssetKind = "image" | "audio";

interface AssetEntry {
  kind: AssetKind;
  /** Local require() source. null until real art/audio is supplied. */
  source: number | null;
}

// NOTE: React Native require() must be statically analyzable, so real
// entries must use literal require("./images/x.png") calls when added.
export const assetRegistry: Record<AssetId, AssetEntry> = {
  COMPANION_IDLE: { kind: "image", source: null },
  COMPANION_HAPPY: { kind: "image", source: null },
  COMPANION_CURIOUS: { kind: "image", source: null },
  COMPANION_SLEEPY: { kind: "image", source: null },
  COMPANION_CELEBRATING: { kind: "image", source: null },

  GROVE_BACKGROUND: { kind: "image", source: null },
  MISSIONS_BACKGROUND: { kind: "image", source: null },
  TALE_TRAILS_BACKGROUND: { kind: "image", source: null },
  TREASURE_HUNT_BACKGROUND: { kind: "image", source: null },
  THE_BEYOND_BACKGROUND: { kind: "image", source: null },

  EGG_ONE: { kind: "image", source: null },
  EGG_TWO: { kind: "image", source: null },
  EGG_THREE: { kind: "image", source: null },

  ONBOARDING_WELCOME_BACKGROUND: { kind: "image", source: null },
  ONBOARDING_STORY_BACKGROUND: { kind: "image", source: null },

  // Missions (Batch 04) — one card art per category, shared across
  // that category's missions until real per-mission art is supplied.
  MISSION_CARD_KIND_DEEDS: { kind: "image", source: null },
  MISSION_CARD_BRAVE_SPARKS: { kind: "image", source: null },
  MISSION_CARD_CURIOUS_FINDS: { kind: "image", source: null },
  MISSION_CARD_STORY_VOICES: { kind: "image", source: null },
  MISSION_CARD_GROVE_BONDS: { kind: "image", source: null },
  REWARD_XP_SPARKLE: { kind: "image", source: null },
  REWARD_COIN: { kind: "image", source: null },
  REWARD_ADVENTURE_TICKET: { kind: "image", source: null },
  REWARD_COLLECTOR_TOKEN: { kind: "image", source: null },

  GROVE_BACKGROUND_BLOOM: { kind: "image", source: null },
  GROVE_BACKGROUND_RADIANT: { kind: "image", source: null },
  GROVE_COMPANION_PLATFORM: { kind: "image", source: null },

  GATEWAY_MISSIONS: { kind: "image", source: null },
  GATEWAY_TALE_TRAILS: { kind: "image", source: null },
  GATEWAY_TREASURE_HUNT: { kind: "image", source: null },
  GATEWAY_THE_BEYOND: { kind: "image", source: null },

  ICON_XP: { kind: "image", source: null },
  ICON_CURRENCY_PRIMARY: { kind: "image", source: null },
  ICON_CURRENCY_PREMIUM: { kind: "image", source: null },
  ICON_ADVENTURE_TICKET: { kind: "image", source: null },
  ICON_COLLECTOR_TOKEN: { kind: "image", source: null },
  ICON_NOTIFICATION: { kind: "image", source: null },
  ICON_MISSION: { kind: "image", source: null },
  ICON_STORY: { kind: "image", source: null },
  ICON_TREASURE: { kind: "image", source: null },
  ICON_SETTINGS: { kind: "image", source: null },

  // Tale Trails (Batch 05)
  STORY_LANTERN_PATH_BG: { kind: "image", source: null },
  STORY_LANTERN_PATH_GLADE_BG: { kind: "image", source: null },
  STORY_TIDE_COVE_BG: { kind: "image", source: null },
  STORY_TIDE_COVE_DEPTHS_BG: { kind: "image", source: null },
  STORY_SEALED_CHAPTER: { kind: "image", source: null },
  FIRESIDE_BACKGROUND: { kind: "image", source: null },

  // Treasure Hunt (Batch 06)
  TREASURE_ACORN: { kind: "image", source: null },
  TREASURE_SHELL: { kind: "image", source: null },
  TREASURE_LANTERN_GEM: { kind: "image", source: null },
  TREASURE_FEATHER: { kind: "image", source: null },
  TREASURE_CRYSTAL: { kind: "image", source: null },
  TREASURE_STAR_FRAGMENT: { kind: "image", source: null },
  TREASURE_MARKER_GLOW: { kind: "image", source: null },
};

export function getAsset(id: AssetId): AssetEntry {
  return assetRegistry[id];
}

export function hasRealAsset(id: AssetId): boolean {
  return assetRegistry[id].source !== null;
}
