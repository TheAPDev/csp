import { CompanionTraits, EggId } from "@apptypes";
import { AssetId } from "@assets/registry";

/**
 * A qualitative developmental "lean" the Companion is currently
 * showing — named after the three onboarding eggs (Ember/Tide/
 * Whisper) so the identity the child chose at hatching stays legible
 * throughout the journey, per the master protocol: "the initial egg
 * influences starting direction" (the egg's `traitLean` sets the
 * baseline before this is ever computed) "but final development
 * should also respond to the child's journey" (every subsequent
 * Mission/Story/Treasure/Vault moment nudges traits, which can shift
 * which lean is currently dominant).
 *
 * This is ALWAYS derived from live trait values, never stored — same
 * "can't desync from progression" principle as
 * `groveStore.evolutionStageForLevel`. It is internal-only, exactly
 * like the traits themselves: never rendered as a label, chart, or
 * "You are 62% Ember" readout anywhere in the UI (Child UX Rule §9 /
 * master protocol "no personality scores").
 */
export type CompanionLean = "ember" | "tide" | "whisper";

export const eggToLean: Record<EggId, CompanionLean> = {
  eggEmber: "ember",
  eggTide: "tide",
  eggWhisper: "whisper",
};

/**
 * Weighted composite scores mirroring each egg's own `traitLean`
 * shape (see onboarding/content/eggs.ts) — Voice contributes half-
 * weight to both Ember and Whisper since both eggs nudge it a little,
 * so no trait is left fully outside the model and no dedicated
 * "Voice" bucket is needed.
 */
export function leanFor(traits: CompanionTraits): CompanionLean {
  const emberScore = traits.courage + traits.voice * 0.5;
  const tideScore = traits.heart + traits.bond * 0.5;
  const whisperScore = traits.curiosity + traits.voice * 0.5;

  // Deterministic, stable tie-break order: tide, then ember, then
  // whisper. Ties are rare (traits are continuous floats) but must
  // never be random — the same trait snapshot must always resolve to
  // the same lean.
  if (tideScore >= emberScore && tideScore >= whisperScore) return "tide";
  if (emberScore >= whisperScore) return "ember";
  return "whisper";
}

const leanDecorAssets: Record<CompanionLean, [AssetId, AssetId]> = {
  ember: ["GROVE_DECOR_EMBER_1", "GROVE_DECOR_EMBER_2"],
  tide: ["GROVE_DECOR_TIDE_1", "GROVE_DECOR_TIDE_2"],
  whisper: ["GROVE_DECOR_WHISPER_1", "GROVE_DECOR_WHISPER_2"],
};

/** The Grove decoration pair that reflects the Companion's current lean. */
export function groveDecorForLean(lean: CompanionLean) {
  return leanDecorAssets[lean];
}
