import React, { useMemo, useState } from "react";
import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { IconButton } from "@components/IconButton";
import { colors, typography, spacing, radius } from "@theme";
import { MissionDefinition, MissionCategory, QuestLength } from "@apptypes";
import { missionDefinitions, categoryLabel } from "../content/missionDefinitions";
import { MissionCard } from "../components/MissionCard";
import { useMissionsStore } from "@state/missionsStore";
import { ReturnToGrove } from "@components/ReturnToGrove";

interface MissionsHomeScreenProps {
  onSelectMission: (mission: MissionDefinition) => void;
  onOpenHistory: () => void;
  onReturnToGrove: () => void;
}

type LengthFilter = "all" | QuestLength;

const CATEGORY_FILTERS: (MissionCategory | "all")[] = [
  "all",
  "kindDeeds",
  "braveSparks",
  "curiousFinds",
  "storyVoices",
  "groveBonds",
];

/**
 * Missions entry: filters + categories, Quick Quests (horizontal
 * scroll â€” genuinely improves discovery of a short, browsable set),
 * Long Quests (vertical list), and Completion History. Vertical
 * scrolling is the primary discovery axis for the screen as a whole.
 */
export function MissionsHomeScreen({ onSelectMission, onOpenHistory, onReturnToGrove }: MissionsHomeScreenProps) {
  const [categoryFilter, setCategoryFilter] = useState<MissionCategory | "all">("all");
  const [lengthFilter, setLengthFilter] = useState<LengthFilter>("all");
  const statusFor = useMissionsStore((s) => s.statusFor);

  const filtered = useMemo(() => {
    return missionDefinitions.filter((m) => {
      if (categoryFilter !== "all" && m.category !== categoryFilter) return false;
      if (lengthFilter !== "all" && m.length !== lengthFilter) return false;
      return true;
    });
  }, [categoryFilter, lengthFilter]);

  const quickQuests = filtered.filter((m) => m.length === "quick");
  const longQuests = filtered.filter((m) => m.length === "long");

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Missions</Text>
          <IconButton onPress={onOpenHistory}>
            <Text style={styles.historyIcon}>ðŸ—‚</Text>
          </IconButton>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {CATEGORY_FILTERS.map((c) => (
            <Pressable
              key={c}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setCategoryFilter(c);
              }}
              accessibilityRole="button"
              accessibilityLabel={c === "all" ? "All categories" : categoryLabel[c]}
              accessibilityState={{ selected: categoryFilter === c }}
              style={[styles.chip, categoryFilter === c && styles.chipActive]}
            >
              <Text style={[styles.chipLabel, categoryFilter === c && styles.chipLabelActive]}>
                {c === "all" ? "All" : categoryLabel[c]}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.lengthRow}>
          {(["all", "quick", "long"] as LengthFilter[]).map((l) => (
            <Pressable
              key={l}
              onPress={() => setLengthFilter(l)}
              accessibilityRole="button"
              accessibilityLabel={l === "all" ? "All lengths" : l === "quick" ? "Quick Quests" : "Long Quests"}
              accessibilityState={{ selected: lengthFilter === l }}
              style={[styles.lengthPill, lengthFilter === l && styles.lengthPillActive]}
            >
              <Text style={[styles.lengthLabel, lengthFilter === l && styles.lengthLabelActive]}>
                {l === "all" ? "All lengths" : l === "quick" ? "Quick Quests" : "Long Quests"}
              </Text>
            </Pressable>
          ))}
        </View>

        {quickQuests.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Quests</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickRow}>
              {quickQuests.map((m) => (
                <MissionCard
                  key={m.id}
                  mission={m}
                  status={statusFor(m.id)}
                  variant="compact"
                  onPress={() => onSelectMission(m)}
                />
              ))}
            </ScrollView>
          </View>
        )}

        {longQuests.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Long Quests</Text>
            {longQuests.map((m) => (
              <MissionCard key={m.id} mission={m} status={statusFor(m.id)} onPress={() => onSelectMission(m)} />
            ))}
          </View>
        )}

        {filtered.length === 0 && (
          <Text style={styles.empty}>No quests match right now â€” try a different filter.</Text>
        )}

        <ReturnToGrove onPress={onReturnToGrove} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "transparent" },
  scrollContent: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: spacing.md },
  title: { ...typography.display, color: colors.text.primary },
  historyIcon: { fontSize: 20 },
  filterRow: { gap: spacing.sm, paddingBottom: spacing.sm },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border.default,
    backgroundColor: colors.background.elevated,
  },
  chipActive: { backgroundColor: colors.accent.primary, borderColor: colors.accent.primary },
  chipLabel: { ...typography.caption, color: colors.text.secondary },
  chipLabelActive: { color: colors.text.primary },
  lengthRow: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.sm, marginBottom: spacing.lg },
  lengthPill: {
    flex: 1,
    paddingVertical: spacing.xs,
    borderRadius: radius.md,
    alignItems: "center",
    backgroundColor: colors.background.elevated,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  lengthPillActive: { borderColor: colors.accent.secondary },
  lengthLabel: { ...typography.caption, color: colors.text.secondary },
  lengthLabelActive: { color: colors.text.primary },
  section: { marginBottom: spacing.lg },
  sectionTitle: { ...typography.heading, color: colors.text.primary, marginBottom: spacing.sm },
  quickRow: { gap: spacing.sm },
  empty: { ...typography.body, color: colors.text.secondary, textAlign: "center", marginTop: spacing.xl },
});

