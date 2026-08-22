import React from "react";
import { View, StyleSheet } from "react-native";
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
}

/**
 * Renders the Companion's emotional reaction. This is the emotional
 * spine of the product — future batches will attach animation and
 * contextual teaching moments here without changing this contract.
 */
export function CompanionReaction({ mood, size = 96 }: CompanionReactionProps) {
  return (
    <View style={[styles.wrap, shadows.glow, { width: size, height: size, borderRadius: radius.pill }]}>
      <AssetImage id={moodToAsset[mood]} style={{ width: size, height: size, borderRadius: radius.pill }} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", justifyContent: "center" },
});
