import { BeyondRegionDefinition } from "@apptypes";

/**
 * Local content seed — same "polished dummy content, data-driven"
 * philosophy as every other World's content file
 * (missionDefinitions.ts, storyDefinitions.ts, treasureDefinitions.ts,
 * vaultCatalog.ts). Adding a region is a content-file change, never a
 * new screen. Only `whisperingDeep` is `available: true` this batch —
 * the rest demonstrate the four content categories the master
 * protocol calls out (region/quest/seasonal/premium) as beautifully
 * sealed chapters, never a generic "Coming Soon" box.
 */
export const beyondRegions: BeyondRegionDefinition[] = [
  {
    id: "whispering-deep",
    title: "The Whispering Deep",
    kind: "region",
    cardAssetId: "BEYOND_REGION_WHISPERING_DEEP",
    teaser: "Voices drift up from somewhere far below the Grove, patient and low.",
    available: true,
    reward: { xp: 60, coins: 20, collectorTokens: 1 },
    unlockAssetId: "charm-of-the-deep",
    points: [
      { id: "poi-hum", x: 0.24, y: 0.34, line: "A low hum rises from between two roots, almost like breathing." },
      { id: "poi-glimmer", x: 0.7, y: 0.5, line: "Something glimmers deep in the dark — there, then gone." },
      { id: "poi-listen", x: 0.46, y: 0.74, line: "Your Companion goes very still, listening with you." },
    ],
  },
  {
    id: "starlit-crossing",
    title: "The Starlit Crossing",
    kind: "seasonal",
    cardAssetId: "BEYOND_REGION_STARLIT_CROSSING",
    teaser: "A bridge of light only appears when the sky is just right.",
    available: false,
  },
  {
    id: "forgotten-archive",
    title: "The Forgotten Archive",
    kind: "quest",
    cardAssetId: "BEYOND_REGION_FORGOTTEN_ARCHIVE",
    teaser: "Old stories rest here, half-remembered, waiting to be asked about.",
    available: false,
  },
  {
    id: "the-far-shore",
    title: "The Far Shore",
    kind: "premium",
    cardAssetId: "BEYOND_REGION_FAR_SHORE",
    teaser: "Something waits across the water — but the crossing isn't ready yet.",
    available: false,
  },
  {
    id: "ember-hollow",
    title: "Ember Hollow",
    kind: "region",
    cardAssetId: "BEYOND_REGION_EMBER_HOLLOW",
    teaser: "A warm glow flickers somewhere deeper still.",
    available: false,
  },
];

export function getBeyondRegion(id: string): BeyondRegionDefinition | undefined {
  return beyondRegions.find((r) => r.id === id);
}

export const REGION_KIND_LABEL: Record<BeyondRegionDefinition["kind"], string> = {
  region: "Region",
  quest: "Quest",
  seasonal: "Seasonal",
  premium: "Premium",
};
