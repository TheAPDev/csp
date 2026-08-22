import React from "react";
import { Text, StyleSheet } from "react-native";
import { WorldScene } from "@worlds/WorldScene";
import { worldRegistry } from "@worlds/WorldRegistry";
import { typography, colors, spacing } from "@theme";

/**
 * Placeholder World screen for "TheBeyond". Scaffolding only — full
 * gameplay for this World is out of scope for Batch 01 per the
 * master rule (DO NOT implement full Missions/Stories/AR/Store).
 */
export default function TheBeyondWorld() {
  const def = worldRegistry.theBeyond;
  return (
    <WorldScene backgroundAssetId={def.backgroundAssetId}>
      <Text style={styles.title}>{def.displayName}</Text>
      <Text style={styles.subtitle}>Coming in a future batch.</Text>
    </WorldScene>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.title, color: colors.text.primary, margin: spacing.xl },
  subtitle: { ...typography.body, color: colors.text.secondary, marginHorizontal: spacing.xl },
});
