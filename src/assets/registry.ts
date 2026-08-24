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
  // Batch 08 — fuller Companion emotional vocabulary
  | "COMPANION_THINKING"
  | "COMPANION_ENCOURAGING"
  | "COMPANION_QUEST_REACTION"
  | "COMPANION_STORY_REACTION"
  | "COMPANION_REWARD_REACTION"
  | "COMPANION_INTERACTION"
  | "COMPANION_REFLECTIVE"
  // Batch 08 — Grove decoration layer, unlocked by evolution stage/path
  | "GROVE_DECOR_EMBER_1"
  | "GROVE_DECOR_EMBER_2"
  | "GROVE_DECOR_TIDE_1"
  | "GROVE_DECOR_TIDE_2"
  | "GROVE_DECOR_WHISPER_1"
  | "GROVE_DECOR_WHISPER_2"
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
  | "ONBOARDING_STORY_VIDEO"
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
  | "TREASURE_MARKER_GLOW"

  // Companion's Closet & The Vault (Batch 07)
  | "CLOSET_BACKGROUND"
  | "VAULT_BACKGROUND"
  | "GATEWAY_CLOSET"
  | "GATEWAY_VAULT"
  | "COSMETIC_OUTFIT_STARLIGHT_CLOAK"
  | "COSMETIC_OUTFIT_MOSS_EXPLORER"
  | "COSMETIC_ACCESSORY_LANTERN_CHARM"
  | "COSMETIC_ACCESSORY_ACORN_CROWN"
  | "COSMETIC_EXPRESSION_GIGGLE"
  | "COSMETIC_EXPRESSION_WONDER_GASP"
  | "COSMETIC_TITLE_PATHFINDER"
  | "COSMETIC_TITLE_STARGAZER"
  | "COSMETIC_BADGE_KIND_HEART"
  | "COSMETIC_BADGE_BRAVE_SPARK"
  | "COSMETIC_HOMEDECOR_LANTERN_STRING"
  | "COSMETIC_HOMEDECOR_MOSS_STONES"
  | "COSMETIC_THEME_MIDNIGHT_BLOOM"
  | "COSMETIC_THEME_TIDEPOOL"
  | "COSMETIC_CARD_EMBER_FOX"
  | "COSMETIC_CARD_TIDE_SPIRIT"
  | "VAULT_REWARD_EXPLORER_BOX"
  | "VAULT_REWARD_STARGAZER_KIT"
  | "VAULT_REWARD_COMPANION_PLUSH"
  | "REWARD_PURCHASE_SPARKLE"
  | "REWARD_REDEMPTION_GLOW"
  // The Beyond (Batch 09)
  | "BEYOND_REGION_WHISPERING_DEEP"
  | "BEYOND_REGION_STARLIT_CROSSING"
  | "BEYOND_REGION_FORGOTTEN_ARCHIVE"
  | "BEYOND_REGION_FAR_SHORE"
  | "BEYOND_REGION_EMBER_HOLLOW";

export type AssetKind = "image" | "audio" | "video";

interface AssetEntry {
  kind: AssetKind;
  /** Local require() source or remote asset URI. null until a real asset is supplied. */
  source: number | { uri: string } | null;
}

// NOTE: React Native require() must be statically analyzable, so real
// entries must use literal require("./images/x.png") calls when added.
export const assetRegistry: Record<AssetId, AssetEntry> = {
  COMPANION_IDLE: { kind: "image", source: require("./images/companion-idle.png") },
  COMPANION_HAPPY: { kind: "image", source: require("./images/companion-idle.png") },
  COMPANION_CURIOUS: { kind: "image", source: require("./images/companion-idle.png") },
  COMPANION_SLEEPY: { kind: "image", source: require("./images/companion-idle.png") },
  COMPANION_CELEBRATING: { kind: "image", source: require("./images/companion-idle.png") },
  COMPANION_THINKING: { kind: "image", source: require("./images/companion-idle.png") },
  COMPANION_ENCOURAGING: { kind: "image", source: require("./images/companion-idle.png") },
  COMPANION_QUEST_REACTION: { kind: "image", source: require("./images/companion-idle.png") },
  COMPANION_STORY_REACTION: { kind: "image", source: require("./images/companion-idle.png") },
  COMPANION_REWARD_REACTION: { kind: "image", source: require("./images/companion-idle.png") },
  COMPANION_INTERACTION: { kind: "image", source: require("./images/companion-idle.png") },
  COMPANION_REFLECTIVE: { kind: "image", source: require("./images/companion-idle.png") },
  GROVE_DECOR_EMBER_1: { kind: "image", source: null },
  GROVE_DECOR_EMBER_2: { kind: "image", source: null },
  GROVE_DECOR_TIDE_1: { kind: "image", source: null },
  GROVE_DECOR_TIDE_2: { kind: "image", source: null },
  GROVE_DECOR_WHISPER_1: { kind: "image", source: null },
  GROVE_DECOR_WHISPER_2: { kind: "image", source: null },

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
  // Local onboarding loop video. Re-encoded to a simpler MP4 profile for
  // better compatibility with Expo AV while preserving the intended loop.
  ONBOARDING_STORY_VIDEO: { kind: "video", source: require("./videos/onboarding_loop_safe.mp4") },

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

  // Companion's Closet & The Vault (Batch 07)
  CLOSET_BACKGROUND: { kind: "image", source: null },
  VAULT_BACKGROUND: { kind: "image", source: null },
  GATEWAY_CLOSET: { kind: "image", source: null },
  GATEWAY_VAULT: { kind: "image", source: null },
  COSMETIC_OUTFIT_STARLIGHT_CLOAK: { kind: "image", source: null },
  COSMETIC_OUTFIT_MOSS_EXPLORER: { kind: "image", source: null },
  COSMETIC_ACCESSORY_LANTERN_CHARM: { kind: "image", source: null },
  COSMETIC_ACCESSORY_ACORN_CROWN: { kind: "image", source: null },
  COSMETIC_EXPRESSION_GIGGLE: { kind: "image", source: null },
  COSMETIC_EXPRESSION_WONDER_GASP: { kind: "image", source: null },
  COSMETIC_TITLE_PATHFINDER: { kind: "image", source: null },
  COSMETIC_TITLE_STARGAZER: { kind: "image", source: null },
  COSMETIC_BADGE_KIND_HEART: { kind: "image", source: null },
  COSMETIC_BADGE_BRAVE_SPARK: { kind: "image", source: null },
  COSMETIC_HOMEDECOR_LANTERN_STRING: { kind: "image", source: null },
  COSMETIC_HOMEDECOR_MOSS_STONES: { kind: "image", source: null },
  COSMETIC_THEME_MIDNIGHT_BLOOM: { kind: "image", source: null },
  COSMETIC_THEME_TIDEPOOL: { kind: "image", source: null },
  COSMETIC_CARD_EMBER_FOX: { kind: "image", source: null },
  COSMETIC_CARD_TIDE_SPIRIT: { kind: "image", source: null },
  VAULT_REWARD_EXPLORER_BOX: { kind: "image", source: null },
  VAULT_REWARD_STARGAZER_KIT: { kind: "image", source: null },
  VAULT_REWARD_COMPANION_PLUSH: { kind: "image", source: null },
  REWARD_PURCHASE_SPARKLE: { kind: "image", source: null },
  REWARD_REDEMPTION_GLOW: { kind: "image", source: null },

  // The Beyond (Batch 09)
  BEYOND_REGION_WHISPERING_DEEP: { kind: "image", source: null },
  BEYOND_REGION_STARLIT_CROSSING: { kind: "image", source: null },
  BEYOND_REGION_FORGOTTEN_ARCHIVE: { kind: "image", source: null },
  BEYOND_REGION_FAR_SHORE: { kind: "image", source: null },
  BEYOND_REGION_EMBER_HOLLOW: { kind: "image", source: null },
};

export function getAsset(id: AssetId): AssetEntry {
  return assetRegistry[id];
}

export function hasRealAsset(id: AssetId): boolean {
  return assetRegistry[id].source !== null;
}
