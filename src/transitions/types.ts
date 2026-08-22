/**
 * WONDERKIN Transition Primitives — shared contract.
 * Every transition is a pure function of a SharedValue<number> progress
 * (0..1) driven by react-native-reanimated withTiming/withSpring, so
 * any future World or screen can call them without new dependencies.
 */
import { SharedValue } from "react-native-reanimated";

export type Progress = SharedValue<number>;

export interface TransitionConfig {
  durationMs?: number;
}
