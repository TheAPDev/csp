import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, typography, spacing, radius, shadows } from "@theme";
import { AssetImage } from "./AssetImage";
import { AssetId } from "@assets/registry";

interface RewardBadgeProps {
  assetId: AssetId;
  label: string;
}

export function RewardBadge({ assetId, label }: RewardBadgeProps) {
  return (
    <View style={[styles.wrap, shadows.md]}>
      <AssetImage id={assetId} style={styles.icon} />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    backgroundColor: colors.background.elevated,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    gap: spacing.xs,
  },
  icon: { width: 56, height: 56, borderRadius: radius.md },
  label: { ...typography.label, color: colors.text.primary },
});

