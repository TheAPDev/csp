import { withTiming, Easing } from "react-native-reanimated";
import { duration } from "@theme";
import { Progress, TransitionConfig } from "./types";

/** Cross-dissolve between two environment backgrounds (e.g. day/night Grove). */
export function environmentalDissolve(progress: Progress, config: TransitionConfig = {}) {
  progress.value = withTiming(1, {
    duration: config.durationMs ?? duration.slow,
    easing: Easing.inOut(Easing.quad),
  });
}
