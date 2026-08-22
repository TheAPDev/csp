import React, { useEffect } from "react";
import { StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { colors } from "@theme";

const { width, height } = Dimensions.get("window");

interface GroveAmbientProps {
  /** Higher evolution stages feel slightly more alive — a few more motes drifting. */
  intensity?: number;
}

/**
 * Purely decorative, looping ambient layer that makes the Grove feel
 * alive without requiring any interaction — slow drifting light motes
 * behind the Companion. Fully sound-off understandable (visual only).
 * Uses the same `duration.cinematic`-class pacing as the rest of the
 * app; no snappy motion.
 */
export function GroveAmbient({ intensity = 6 }: GroveAmbientProps) {
  return (
    <>
      {Array.from({ length: intensity }).map((_, i) => (
        <Mote key={i} index={i} />
      ))}
    </>
  );
}

function Mote({ index }: { index: number }) {
  const progress = useSharedValue(0);
  const startX = (index * 97) % width;
  const startY = height * 0.25 + ((index * 53) % (height * 0.4));
  const drift = 18 + (index % 4) * 8;
  const loopDuration = 3200 + (index % 5) * 500;

  useEffect(() => {
    progress.value = withRepeat(
      withSequence(
        withTiming(1, { duration: loopDuration, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: loopDuration, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: 0.15 + progress.value * 0.35,
    transform: [
      { translateY: -progress.value * drift },
      { translateX: (progress.value - 0.5) * drift * 0.6 },
    ],
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.mote, { left: startX, top: startY }, animatedStyle]}
    />
  );
}

const styles = StyleSheet.create({
  mote: {
    position: "absolute",
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.accent.secondary,
  },
});
