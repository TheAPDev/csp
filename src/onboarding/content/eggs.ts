import { AssetId } from "@assets/registry";
import { EggId, CompanionTraits } from "@apptypes";

export interface EggDefinition {
  id: EggId;
  assetId: AssetId;
  /** A short mysterious line — never a personality label. */
  clue: string;
  /** Internal-only trait lean applied once at hatching. Never shown to the child. */
  traitLean: Partial<CompanionTraits>;
}

/**
 * Three mysterious eggs. They differ in visual treatment (asset,
 * glow, motion via the Pressable's own press feedback) and in a
 * short clue line only — per the master protocol, they are never
 * labeled as personality types and no hidden trait is ever revealed.
 */
export const eggDefinitions: EggDefinition[] = [
  {
    id: "eggEmber",
    assetId: "EGG_ONE",
    clue: "It feels warm, like it's waiting to leap.",
    traitLean: { courage: 0.08, voice: 0.03 },
  },
  {
    id: "eggTide",
    assetId: "EGG_TWO",
    clue: "It hums so softly you have to hold your breath to hear it.",
    traitLean: { heart: 0.08, bond: 0.04 },
  },
  {
    id: "eggWhisper",
    assetId: "EGG_THREE",
    clue: "It shivers whenever you look away, as if it's curious about you too.",
    traitLean: { curiosity: 0.08, voice: 0.04 },
  },
];
