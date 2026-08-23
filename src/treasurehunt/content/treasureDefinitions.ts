import { TreasureDefinition, TreasureBiomeId } from "@apptypes";

/**
 * Polished demo treasures, data-driven per the master protocol's
 * §DUMMY CONTENT rule. Six treasures across three biomes plus one
 * that can appear anywhere — adding more later is purely a content
 * change in this file, never a new screen or flow.
 */
export const treasureDefinitions: TreasureDefinition[] = [
  {
    id: "acorn-of-quiet-courage",
    name: "Acorn of Quiet Courage",
    biome: "woodland",
    iconAssetId: "TREASURE_ACORN",
    discoveryLine: "Something small and golden is peeking out over there!",
    collectLine: "This little acorn feels braver just being held.",
    reward: { xp: 30, coins: 10 },
    traitLean: { courage: 0.03 },
  },
  {
    id: "shell-of-far-tides",
    name: "Shell of Far Tides",
    biome: "shoreline",
    iconAssetId: "TREASURE_SHELL",
    discoveryLine: "Do you hear that? Something's humming near the water.",
    collectLine: "Hold it to your ear — it remembers every wave.",
    reward: { xp: 30, coins: 10 },
    traitLean: { curiosity: 0.03 },
  },
  {
    id: "lantern-gem",
    name: "Lantern Gem",
    biome: "meadow",
    iconAssetId: "TREASURE_LANTERN_GEM",
    discoveryLine: "There's a warm little glow just ahead.",
    collectLine: "It flickers brighter whenever your Companion is near.",
    reward: { xp: 35, coins: 12, collectorTokens: 1 },
    traitLean: { bond: 0.03 },
  },
  {
    id: "feather-of-first-flight",
    name: "Feather of First Flight",
    biome: "meadow",
    iconAssetId: "TREASURE_FEATHER",
    discoveryLine: "Something drifted down and landed nearby!",
    collectLine: "So light — it barely feels like it's really there.",
    reward: { xp: 25, coins: 10 },
    traitLean: { voice: 0.03 },
  },
  {
    id: "crystal-of-still-water",
    name: "Crystal of Still Water",
    biome: "shoreline",
    iconAssetId: "TREASURE_CRYSTAL",
    discoveryLine: "The light is bending strangely just over there.",
    collectLine: "It's cool to the touch, like the calmest part of a lake.",
    reward: { xp: 35, coins: 12 },
    traitLean: { heart: 0.03 },
  },
  {
    id: "star-fragment",
    name: "Star Fragment",
    biome: "any",
    iconAssetId: "TREASURE_STAR_FRAGMENT",
    discoveryLine: "Something up there is twinkling closer than the sky should be.",
    collectLine: "It's warm, like it fell just for you to find.",
    reward: { xp: 40, coins: 15, adventureTickets: 1 },
    traitLean: { curiosity: 0.02, bond: 0.02 },
  },
];

/** Every treasure for a biome, plus every "any"-biome treasure — never an empty result. */
export function treasuresForBiome(biome: TreasureBiomeId): TreasureDefinition[] {
  return treasureDefinitions.filter((t) => t.biome === biome || t.biome === "any");
}
