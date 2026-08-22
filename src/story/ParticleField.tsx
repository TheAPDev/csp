import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle } from "react-native-reanimated";
import { colors } from "@theme";
import { particleTransition } from "@transitions";

interface ParticleFieldProps {
  active: boolean;
  count?: number;
}

/**
 * Lightweight procedural particle overlay for cinematic story beats
 * and the egg-hatching reveal. Purely decorative and sound-ready (it
 * owns no audio itself, but a future batch's real particle/sound
 * system can hook the same `active` trigger without changing callers
 * in StoryScene or HatchingScreen).
 */
export function ParticleField({ active, count = 10 }: ParticleFieldProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Particle key={i} index={i} active={active} total={count} />
      ))}
    </>
  );
}

function Particle({ index, active, total }: { index: number; active: boolean; total: number }) {
  const progress = useSharedValue(0);
  const angle = (index / total) * Math.PI * 2;
  const radius = 90 + (index % 3) * 24;

  useEffect(() => {
    if (active) {
      progress.value = 0;
      particleTransition(progress, { durationMs: 900 + (index % 4) * 120 });
    }
  }, [active]);

  const animatedStyle = useAnimatedStyle(() => {
    const dist = progress.value * radius;
    return {
      opacity: 1 - progress.value,
      transform: [
        { translateX: Math.cos(angle) * dist },
        { translateY: Math.sin(angle) * dist },
        { scale: 1 - progress.value * 0.4 },
      ],
    };
  });

  return <Animated.View pointerEvents="none" style={[styles.dot, animatedStyle]} />;
}

const styles = StyleSheet.create({
  dot: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent.secondary,
  },
});
