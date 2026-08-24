import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { AssetImage } from "@components/AssetImage";
import { CompanionReaction } from "@components/CompanionReaction";
import { ParticleField } from "@story/ParticleField";
import { colors, typography, spacing, radius, shadows } from "@theme";
import { TreasureDefinition } from "@apptypes";

interface CollectionScreenProps {
  treasure: TreasureDefinition;
  onContinue: () => void;
}

/**
 * Interaction â†’ collection beat. Reuses `ParticleField` (built for
 * story beats / egg hatching in Batches 02/05) rather than inventing
 * a parallel particle system â€” same magical language throughout the
 * app, per master protocol Â§DO NOT ("Do not create a new visual
 * language"). Auto-advances to the reward screen after the burst;
 * there's nothing here worth requiring a tap for.
 */
export function CollectionScreen({ treasure, onContinue }: CollectionScreenProps) {
  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const timer = setTimeout(onContinue, 1900);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <View style={styles.burstAnchor}>
          <ParticleField active count={14} />
          <View style={[styles.glowRing, shadows.glow]}>
            <AssetImage id={treasure.iconAssetId} style={styles.treasureArt} />
          </View>
        </View>
        <CompanionReaction mood="celebrating" size={96} />
        <Text style={styles.line}>{treasure.collectLine}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  content: { flex: 1, alignItems: "center", justifyContent: "center", padding: spacing.xxl },
  burstAnchor: { alignItems: "center", justifyContent: "center", marginBottom: spacing.lg },
  glowRing: {
    width: 88,
    height: 88,
    borderRadius: radius.pill,
    backgroundColor: colors.background.elevated,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  treasureArt: { width: 60, height: 60, borderRadius: radius.md },
  line: { ...typography.body, color: colors.text.primary, textAlign: "center", marginTop: spacing.lg },
});

