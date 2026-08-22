import { withTiming, Easing } from "react-native-reanimated";
import { duration } from "@theme";
import { Progress, TransitionConfig } from "./types";

/**
 * Drives a particle-burst intensity value (e.g. reward reveal, egg hatch).
 * Actual particle rendering is left to a future batch's particle system;
 * this primitive only owns the timing curve.
 */
export function particleTransition(progress: Progress, config: TransitionConfig = {}) {
  progress.value = withTiming(1, {
    duration: config.durationMs ?? duration.slow,
    easing: Easing.out(Easing.back(1.4)),
  });
}
