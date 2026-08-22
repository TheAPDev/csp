import React, { useEffect, useState } from "react";
import { Pressable, View, StyleSheet } from "react-native";
import * as Haptics from "expo-haptics";
import { StoryScene } from "./StoryScene";
import { StoryBeat } from "./types";
import { spacing } from "@theme";

interface StoryPlayerProps {
  beats: StoryBeat[];
  onComplete: () => void;
}

const hapticMap = {
  light: Haptics.ImpactFeedbackStyle.Light,
  medium: Haptics.ImpactFeedbackStyle.Medium,
} as const;

/**
 * Plays a sequence of StoryBeats end-to-end. Tap-to-advance is the
 * primary interaction — progression never depends solely on an
 * animation finishing, so an interrupted or slow-to-render beat can
 * never soft-lock the child (Batch 02 "interrupted animation" case).
 * Reusable as-is for any future story sequence (Batch 05 Tale Trails).
 */
export function StoryPlayer({ beats, onComplete }: StoryPlayerProps) {
  const [index, setIndex] = useState(0);
  const beat = beats[index];

  useEffect(() => {
    if (!beat) return;
    if (beat.haptic === "success") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else if (beat.haptic === "light" || beat.haptic === "medium") {
      Haptics.impactAsync(hapticMap[beat.haptic]);
    }
  }, [index]);

  function handleAdvance() {
    if (index >= beats.length - 1) {
      onComplete();
      return;
    }
    setIndex((i) => i + 1);
  }

  if (!beat) return null;

  return (
    <Pressable
      style={styles.root}
      onPress={handleAdvance}
      accessibilityRole="button"
      accessibilityLabel="Continue the story"
    >
      <StoryScene beat={beat} />
      <View style={styles.dots}>
        {beats.map((b, i) => (
          <View key={b.id} style={[styles.dot, i === index && styles.dotActive]} />
        ))}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  dots: {
    position: "absolute",
    top: spacing.xxl,
    alignSelf: "center",
    flexDirection: "row",
    gap: spacing.xs,
  },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "rgba(245,240,230,0.28)" },
  dotActive: { backgroundColor: "rgba(245,240,230,0.9)" },
});
