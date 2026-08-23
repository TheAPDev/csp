import React from "react";
import { View, Text, Pressable, StyleSheet, ImageStyle } from "react-native";
import * as Haptics from "expo-haptics";
import { AssetImage } from "@components/AssetImage";
import { colors, typography, spacing, radius, shadows } from "@theme";
import { MissionDefinition } from "@apptypes";
import { categoryAsset, categoryLabel } from "../content/missionDefinitions";
import { MissionStatus } from "@state/missionsStore";

interface MissionCardProps {
  mission: MissionDefinition;
  status: MissionStatus;
  onPress: () => void;
  /** Compact horizontal-scroll layout for Quick Quests vs. the full-width Long Quests list. */
  variant?: "compact" | "full";
}

export function MissionCard({ mission, status, onPress, variant = "full" }: MissionCardProps) {
  const compact = variant === "compact";

  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      style={({ pressed }) => [
        styles.card,
        compact ? styles.cardCompact : styles.cardFull,
        shadows.sm,
        pressed && styles.pressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={mission.title}
    >
      <AssetImage id={categoryAsset[mission.category]} style={(compact ? styles.artCompact : styles.artFull) as ImageStyle} />
      <View style={styles.body}>
        <Text style={styles.category}>{categoryLabel[mission.category]}</Text>
        <Text style={styles.title} numberOfLines={compact ? 2 : 1}>
          {mission.title}
        </Text>
        {!compact && (
          <Text style={styles.prompt} numberOfLines={2}>
            {mission.prompt}
          </Text>
        )}
        {status === "complete" && <Text style={styles.doneBadge}>Completed ✓</Text>}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.elevated,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    overflow: "hidden",
  },
  cardCompact: { width: 148 },
  cardFull: { flexDirection: "row", alignItems: "center", marginBottom: spacing.md },
  pressed: { opacity: 0.85 },
  artCompact: { width: "100%", height: 96 },
  artFull: { width: 64, height: 64, margin: spacing.sm, borderRadius: radius.md },
  body: { padding: spacing.sm, flex: 1 },
  category: { ...typography.caption, color: colors.accent.secondary },
  title: { ...typography.label, color: colors.text.primary, marginTop: spacing.xxs },
  prompt: { ...typography.caption, color: colors.text.secondary, marginTop: spacing.xxs },
  doneBadge: { ...typography.caption, color: colors.accent.primary, marginTop: spacing.xxs },
});
