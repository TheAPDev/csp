import { WorldId } from "@worlds/WorldRegistry";
import { WorldTransitionVariant } from "@components/WorldTransition";

/**
 * Chooses the transition language for a Grove <-> World swap, per the
 * Batch 03 spec. This is the single place that encodes "Grove ->
 * Missions leads forward via a portal", "Missions -> Grove folds
 * back", etc. — do not inline ad-hoc transition choices in a screen.
 *
 *  - grove -> missions   : portal  (world leads toward the Missions space)
 *  - missions -> grove   : fold    (world folds/travels back toward Grove)
 *  - grove -> taleTrails : path    (enter story path/object/portal)
 *  - taleTrails -> grove : fade    (simple return)
 *  - grove -> treasureHunt : dissolve (environment transforms toward camera mode)
 *  - treasureHunt -> grove : fade
 *  - grove -> theBeyond  : portal  (visible path/portal at the edge, geographically connected)
 *  - theBeyond -> grove  : fade
 */
export function transitionVariantFor(from: WorldId, to: WorldId): WorldTransitionVariant {
  if (from === "grove") {
    switch (to) {
      case "missions":
        return "portal";
      case "taleTrails":
        return "path";
      case "treasureHunt":
        return "dissolve";
      case "theBeyond":
        return "portal";
      default:
        return "fade";
    }
  }
  if (to === "grove") {
    switch (from) {
      case "missions":
        return "fold";
      default:
        return "fade";
    }
  }
  return "fade";
}
