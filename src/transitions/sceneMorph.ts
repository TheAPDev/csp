import { withTiming, Easing } from "react-native-reanimated";
import { duration, easing } from "@theme";
import { Progress, TransitionConfig } from "./types";

/** Morphs layout/scale between two scene states within the same World (e.g. zoom into a mission node). */
export function sceneMorph(progress: Progress, config: TransitionConfig = {}) {
  progress.value = withTiming(1, {
    duration: config.durationMs ?? duration.base,
    easing: Easing.bezier(easing.decelerate[0], easing.decelerate[1], easing.decelerate[2], easing.decelerate[3]),
  });
}
