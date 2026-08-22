import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, typography, spacing, radius } from "@theme";
import { AssetImage } from "./AssetImage";
import { AssetId } from "@assets/registry";

interface StatusControlProps {
  iconAssetId: AssetId;
  value: string | number;
}

/** Compact HUD readout — e.g. XP, currency. Kept low-numeric per Child UX rules. */
export function StatusControl({ iconAssetId, value }: StatusControlProps) {
  return (
    <View style={styles.wrap}>
      <AssetImage id={iconAssetId} style={styles.icon} />
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    backgroundColor: colors.background.surface,
    borderRadius: radius.pill,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  icon: { width: 20, height: 20, borderRadius: radius.sm },
  value: { ...typography.label, color: colors.text.primary },
});
