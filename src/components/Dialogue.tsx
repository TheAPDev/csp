import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, typography, spacing, radius, shadows } from "@theme";
import { AssetImage } from "./AssetImage";
import { AssetId } from "@assets/registry";

interface DialogueProps {
  speakerName: string;
  line: string;
  companionAsset?: AssetId;
}

/** Companion / narrator speech bubble used across worlds and stories. */
export function Dialogue({ speakerName, line, companionAsset = "COMPANION_IDLE" }: DialogueProps) {
  return (
    <View style={styles.row}>
      <AssetImage id={companionAsset} style={styles.portrait} />
      <View style={[styles.bubble, shadows.sm]}>
        <Text style={styles.speaker}>{speakerName}</Text>
        <Text style={styles.line}>{line}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "flex-end", gap: spacing.sm },
  portrait: { width: 48, height: 48, borderRadius: radius.pill },
  bubble: {
    flex: 1,
    backgroundColor: colors.background.elevated,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    padding: spacing.md,
  },
  speaker: { ...typography.label, color: colors.accent.secondary, marginBottom: spacing.xxs },
  line: { ...typography.body, color: colors.text.primary },
});
