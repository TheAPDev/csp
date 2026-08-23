import React from "react";
import { View, Text, ScrollView, SafeAreaView, StyleSheet, ImageStyle } from "react-native";
import { AssetImage } from "@components/AssetImage";
import { PrimaryButton } from "@components/PrimaryButton";
import { IconButton } from "@components/IconButton";
import { colors, typography, spacing, radius } from "@theme";
import { MissionDefinition } from "@apptypes";
import { categoryAsset, categoryLabel } from "../content/missionDefinitions";

interface MissionDetailScreenProps {
  mission: MissionDefinition;
  onStart: () => void;
  onBack: () => void;
}

const SUBMISSION_LABEL: Record<MissionDefinition["submissionType"], string> = {
  photo: "Snap a photo",
  voice: "Record your voice",
  video: "Record a video",
  reflection: "Share a reflection",
  quiz: "Answer a few questions",
  guardian: "Ask a grown-up",
  location: "Share where you are",
};

/** Mission detail. The prompt communicates the value through the world, never a trait label. */
export function MissionDetailScreen({ mission, onStart, onBack }: MissionDetailScreenProps) {
  const photoReady = mission.submissionType === "photo";

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <IconButton onPress={onBack} style={styles.back}>
          <Text style={styles.backLabel}>←</Text>
        </IconButton>
        <AssetImage id={categoryAsset[mission.category]} style={styles.hero as ImageStyle} />
        <Text style={styles.category}>{categoryLabel[mission.category]}</Text>
        <Text style={styles.title}>{mission.title}</Text>
        <Text style={styles.prompt}>{mission.prompt}</Text>

        <View style={styles.submissionPill}>
          <Text style={styles.submissionLabel}>{SUBMISSION_LABEL[mission.submissionType]}</Text>
        </View>

        {photoReady ? (
          <PrimaryButton label="Start Mission" onPress={onStart} style={styles.cta} />
        ) : (
          <Text style={styles.notReady}>
            This kind of quest is still waking up — try a photo quest for now!
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "transparent" },
  content: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  back: { marginBottom: spacing.md },
  backLabel: { ...typography.heading, color: colors.text.primary },
  hero: { width: "100%", height: 180, borderRadius: radius.lg, marginBottom: spacing.lg },
  category: { ...typography.caption, color: colors.accent.secondary },
  title: { ...typography.display, color: colors.text.primary, marginTop: spacing.xs, marginBottom: spacing.sm },
  prompt: { ...typography.bodyLarge, color: colors.text.secondary, marginBottom: spacing.lg },
  submissionPill: {
    alignSelf: "flex-start",
    backgroundColor: colors.background.elevated,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border.default,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    marginBottom: spacing.xl,
  },
  submissionLabel: { ...typography.label, color: colors.text.primary },
  cta: { alignSelf: "stretch" },
  notReady: { ...typography.body, color: colors.text.secondary, textAlign: "center" },
});
