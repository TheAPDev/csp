import { withTiming, Easing } from "react-native-reanimated";
import { duration, easing } from "@theme";
import { Progress, TransitionConfig } from "./types";

/** Slow push/pull camera-like movement for cinematic story beats. */
export function cinematicCamera(progress: Progress, config: TransitionConfig = {}) {
  progress.value = withTiming(1, {
    duration: config.durationMs ?? duration.cinematic,
    easing: Easing.bezier(easing.cinematicGlide[0], easing.cinematicGlide[1], easing.cinematicGlide[2], easing.cinematicGlide[3]),
  });
}
