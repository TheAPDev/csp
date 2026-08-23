import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { Sheet } from "@components/Sheet";
import { colors, typography, spacing, radius } from "@theme";
import { useMissionsStore } from "@state/missionsStore";
import { getMissionById } from "../content/missionDefinitions";

interface CompletionHistorySheetProps {
  visible: boolean;
  onClose: () => void;
}

export function CompletionHistorySheet({ visible, onClose }: CompletionHistorySheetProps) {
  const completions = useMissionsStore((s) => s.completions);

  return (
    <Sheet visible={visible} onClose={onClose}>
      <Text style={styles.title}>Completion History</Text>
      {completions.length === 0 ? (
        <Text style={styles.empty}>No quests completed yet — your first one is waiting!</Text>
      ) : (
        <ScrollView style={styles.list}>
          {completions.map((c, i) => {
            const mission = getMissionById(c.missionId);
            const date = new Date(c.completedAt);
            return (
              <View key={`${c.missionId}-${i}`} style={styles.row}>
                <View style={styles.rowText}>
                  <Text style={styles.missionTitle}>{mission?.title ?? c.missionId}</Text>
                  <Text style={styles.date}>{date.toLocaleDateString()}</Text>
                </View>
                <Text style={styles.reward}>
                  +{c.reward.xp} XP · +{c.reward.coins} Coins
                </Text>
              </View>
            );
          })}
        </ScrollView>
      )}
    </Sheet>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.title, color: colors.text.primary, marginBottom: spacing.md },
  empty: { ...typography.body, color: colors.text.secondary },
  list: { maxHeight: 400 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle,
  },
  rowText: { flex: 1 },
  missionTitle: { ...typography.label, color: colors.text.primary },
  date: { ...typography.caption, color: colors.text.secondary },
  reward: { ...typography.caption, color: colors.accent.primary, marginLeft: spacing.sm, borderRadius: radius.sm },
});
