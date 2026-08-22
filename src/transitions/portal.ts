import { withTiming, withSequence, Easing } from "react-native-reanimated";
import { duration } from "@theme";
import { Progress, TransitionConfig } from "./types";

/** Iris/portal-open transition — used when entering a World from the Grove. */
export function portal(progress: Progress, config: TransitionConfig = {}) {
  const total = config.durationMs ?? duration.worldTransition;
  progress.value = withSequence(
    withTiming(1, { duration: total * 0.6, easing: Easing.out(Easing.cubic) }),
    withTiming(0, { duration: total * 0.4, easing: Easing.in(Easing.cubic) })
  );
}
