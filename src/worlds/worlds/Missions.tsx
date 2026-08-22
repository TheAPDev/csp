import React from "react";
import { Text, StyleSheet, SafeAreaView } from "react-native";
import { WorldScene } from "@worlds/WorldScene";
import { worldRegistry, WorldId } from "@worlds/WorldRegistry";
import { typography, colors, spacing } from "@theme";
import { ReturnToGrove } from "@components/index";

interface MissionsWorldProps {
  onNavigateToWorld?: (world: WorldId) => void;
}

/**
 * Placeholder World screen for "Missions". Scaffolding only — full
 * gameplay for this World is out of scope for Batch 03 per the
 * master rule (DO NOT implement full Missions/Stories/AR/Store).
 * Reachable only via its Grove gateway (see WorldGateway) — the
 * bottom tab bar no longer switches between the five main Worlds.
 */
export default function MissionsWorld({ onNavigateToWorld }: MissionsWorldProps) {
  const def = worldRegistry.missions;
  return (
    <WorldScene backgroundAssetId={def.backgroundAssetId}>
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.title}>{def.displayName}</Text>
        <Text style={styles.subtitle}>Coming in a future batch.</Text>
        <ReturnToGrove onPress={() => onNavigateToWorld?.("grove")} />
      </SafeAreaView>
    </WorldScene>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  title: { ...typography.title, color: colors.text.primary, margin: spacing.xl },
  subtitle: { ...typography.body, color: colors.text.secondary, marginHorizontal: spacing.xl },
});
