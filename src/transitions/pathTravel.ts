import { withTiming, Easing } from "react-native-reanimated";
import { duration } from "@theme";
import { Progress, TransitionConfig } from "./types";

/** Drives movement of the Companion/player marker along a mapped path (Treasure Hunt, Tale Trails). */
export function pathTravel(progress: Progress, config: TransitionConfig = {}) {
  progress.value = withTiming(1, {
    duration: config.durationMs ?? duration.cinematic,
    easing: Easing.inOut(Easing.cubic),
  });
}
