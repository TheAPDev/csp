import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { useSharedValue, useAnimatedStyle } from "react-native-reanimated";
import { colors } from "@theme";
import { particleTransition } from "@transitions";

/** Which accent tone the particles render in â€” see Batch 07 note below. */
export type ParticleTone = "secondary" | "positive" | "caution";

const toneColor: Record<ParticleTone, string> = {
  secondary: colors.accent.secondary,
  positive: colors.accent.positive,
  caution: colors.accent.caution,
};

interface ParticleFieldProps {
  active: boolean;
  count?: number;
  /**
   * Added in Batch 07 so the economy's reward celebrations (coin vs.
   * ticket vs. token) can each feel distinct without introducing a
   * second color palette â€” every tone still comes from the existing
   * `colors.accent` set. Defaults to "secondary" so every pre-Batch-07
   * caller (story beats, egg hatching) renders byte-identical.
   */
  tone?: ParticleTone;
}

/**
 * Lightweight procedural particle overlay for cinematic story beats,
 * the egg-hatching reveal, and (as of Batch 07) reward celebrations.
 * Purely decorative and sound-ready (it owns no audio itself, but a
 * future batch's real particle/sound system can hook the same
 * `active` trigger without changing callers).
 */
export function ParticleField({ active, count = 10, tone = "secondary" }: ParticleFieldProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Particle key={i} index={i} active={active} total={count} tone={tone} />
      ))}
    </>
  );
}

function Particle({
  index,
  active,
  total,
  tone,
}: {
  index: number;
  active: boolean;
  total: number;
  tone: ParticleTone;
}) {
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

  return <Animated.View pointerEvents="none" style={[styles.dot, { backgroundColor: toneColor[tone] }, animatedStyle]} />;
}

const styles = StyleSheet.create({
  dot: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});

