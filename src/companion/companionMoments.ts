import { CompanionMood } from "@components/CompanionReaction";
import { CompanionTraits, NotificationKind } from "@apptypes";
import { useCompanionStore } from "@state/companionStore";
import { useProgressionStore } from "@state/progressionStore";

/**
 * Every distinct kind of moment that can make the Companion visibly
 * react. This is the ONE place that decides which `CompanionMood` a
 * given kind of moment uses — every World flow calls
 * `triggerCompanionMoment` instead of inlining its own `setMood(...)`
 * call, so adding a new mood or re-tuning which moment uses which
 * mood is a one-file change, not a five-file hunt.
 */
export type CompanionMomentKind =
  | "quest" // a Mission completes
  | "story" // a Tale Trails episode completes
  | "treasure" // a Treasure Hunt find
  | "purchase" // a Closet cosmetic purchase
  | "vaultProgress" // Vault balance moved but reward not yet redeemed
  | "vaultRedeem" // a Vault redemption request was placed
  | "interaction" // a direct tap/pet in the Grove
  | "reflection" // a quiet, non-reward beat (e.g. Fireside)
  | "beyond"; // a Beyond region is fully explored

const momentMood: Record<CompanionMomentKind, CompanionMood> = {
  quest: "questReaction",
  story: "storyReaction",
  treasure: "rewardReaction",
  purchase: "encouraging",
  vaultProgress: "thinking",
  vaultRedeem: "celebrating",
  interaction: "interaction",
  reflection: "reflective",
  beyond: "rewardReaction",
};

interface CompanionMomentOptions {
  /** Internal-only trait nudges to apply, e.g. a mission's `traitLean`. Never shown to the child. */
  traitLean?: Partial<CompanionTraits>;
  /** Optional notification, surfaced only via the Grove's existing StatusHub unread dot. */
  notification?: { kind: NotificationKind; message: string };
}

/**
 * The single centralized entry point for "something happened, the
 * Companion should visibly respond" — this is what Batch 08's "use
 * centralized state, do not create duplicate progression systems"
 * requirement means in practice. Missions/Tale Trails/Treasure Hunt
 * previously each inlined their own copy of "loop traitLean entries →
 * nudgeTrait, setMood('celebrating'), pushNotification" — that
 * three-times-duplicated block is now this one function, and Closet/
 * Vault gained the same Companion-reaction wiring they never had
 * before, additively, at their existing single mutation points
 * (`closetStore.purchase`, `vaultStore.requestRedemption`).
 *
 * A plain function (not a hook) using `.getState()` so it can be
 * called from store actions and flow event handlers alike, not just
 * component bodies.
 */
export function triggerCompanionMoment(kind: CompanionMomentKind, options: CompanionMomentOptions = {}) {
  const { setMood, nudgeTrait } = useCompanionStore.getState();
  const { pushNotification } = useProgressionStore.getState();

  setMood(momentMood[kind]);

  if (options.traitLean) {
    (Object.entries(options.traitLean) as [keyof CompanionTraits, number][]).forEach(([trait, amount]) => {
      nudgeTrait(trait, amount);
    });
  }

  if (options.notification) {
    pushNotification({ profile_id: "local-guest", ...options.notification });
  }
}
