import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { colors, typography, spacing, radius, shadows } from "@theme";
import { AssetImage } from "@components/AssetImage";
import { ProgressBar } from "@components/ProgressBar";
import { VaultRewardDefinition } from "@apptypes";

interface VaultRewardCardProps {
  reward: VaultRewardDefinition;
  have: number;
  need: number;
  eligible: boolean;
  requested: boolean;
  onPress: () => void;
}

/**
 * "Explorer Box â€” 340 / 500 Collector Tokens" per the spec example.
 * Locked (progress bar) vs eligible (ready-to-redeem tag) are the
 * only two visual states here â€” no numeric grading beyond the plain
 * fraction the spec itself asks for.
 */
export function VaultRewardCard({ reward, have, need, eligible, requested, onPress }: VaultRewardCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={reward.name}
      style={({ pressed }) => [styles.card, shadows.glow, pressed && styles.pressed]}
      onPress={() => {
        Haptics.selectionAsync();
        onPress();
      }}
    >
      <AssetImage id={reward.previewAssetId} style={styles.art} />
      <View style={styles.info}>
        <Text style={styles.name}>{reward.name}</Text>
        <Text style={styles.fraction}>
          {Math.min(have, need)} / {need} Collector Tokens
        </Text>
        <ProgressBar progress={have / need} />
        {requested ? (
          <Text style={styles.requestedTag}>Requested â€” waiting on a grown-up</Text>
        ) : eligible ? (
          <Text style={styles.eligibleTag}>Ready to redeem!</Text>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    gap: spacing.md,
    backgroundColor: colors.background.elevated,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    padding: spacing.md,
    alignItems: "center",
  },
  pressed: { opacity: 0.88 },
  art: { width: 72, height: 72, borderRadius: radius.md },
  info: { flex: 1, gap: spacing.xs },
  name: { ...typography.heading, color: colors.text.primary },
  fraction: { ...typography.caption, color: colors.text.secondary },
  eligibleTag: { ...typography.label, color: colors.accent.positive },
  requestedTag: { ...typography.label, color: colors.accent.caution },
});

