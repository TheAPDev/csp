import { withTiming, Easing } from "react-native-reanimated";
import { duration, easing } from "@theme";
import { Progress, TransitionConfig } from "./types";

/** Simple cross-fade. Used for low-drama UI swaps. */
export function fade(progress: Progress, config: TransitionConfig = {}) {
  progress.value = withTiming(1, {
    duration: config.durationMs ?? duration.base,
    easing: Easing.bezier(easing.standard[0], easing.standard[1], easing.standard[2], easing.standard[3]),
  });
}
