import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import * as Haptics from "expo-haptics";
import { AssetImage } from "./AssetImage";
import { AssetId } from "@assets/registry";
import { shadows, radius } from "@theme";

export type CompanionMood = "idle" | "happy" | "curious" | "sleepy" | "celebrating";

const moodToAsset: Record<CompanionMood, AssetId> = {
  idle: "COMPANION_IDLE",
  happy: "COMPANION_HAPPY",
  curious: "COMPANION_CURIOUS",
  sleepy: "COMPANION_SLEEPY",
  celebrating: "COMPANION_CELEBRATING",
};

interface CompanionReactionProps {
  mood: CompanionMood;
  size?: number;
  /**
   * Optional tap handler — added in Batch 03 so the Grove can make the
   * Companion directly interactive (its center-stage role). Optional
   * and additive: existing callers with no `onPress` are unaffected.
   */
  onPress?: () => void;
}

/**
 * Renders the Companion's emotional reaction. This is the emotional
 * spine of the product — future batches will attach animation and
 * contextual teaching moments here without changing this contract.
 */
export function CompanionReaction({ mood, size = 96, onPress }: CompanionReactionProps) {
  const content = (
    <View style={[styles.wrap, shadows.glow, { width: size, height: size, borderRadius: radius.pill }]}>
      <AssetImage id={moodToAsset[mood]} style={{ width: size, height: size, borderRadius: radius.pill }} />
    </View>
  );

  if (!onPress) return content;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Your Companion"
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", justifyContent: "center" },
});
