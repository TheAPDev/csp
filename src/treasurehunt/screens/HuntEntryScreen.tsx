import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CompanionReaction } from "@components/CompanionReaction";
import { PrimaryButton } from "@components/PrimaryButton";
import { ReturnToGrove } from "@components/ReturnToGrove";
import { colors, typography, spacing } from "@theme";
import { useCompanionStore } from "@state/companionStore";

interface HuntEntryScreenProps {
  onStart: () => void;
  onReturnToGrove: () => void;
}

/**
 * Hunt entry â€” establishes the moment before the camera opens, same
 * role `MissionDetailScreen` plays before Missions' camera step. One
 * primary action per Child UX Rule Â§1.
 */
export function HuntEntryScreen({ onStart, onReturnToGrove }: HuntEntryScreenProps) {
  const companionName = useCompanionStore((s) => s.name);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <CompanionReaction mood="curious" size={140} />
        <Text style={styles.title}>Treasure Hunt</Text>
        <Text style={styles.subtitle}>
          {companionName || "Your Companion"} thinks something magical is hiding nearby. Point your
          camera around to look for it.
        </Text>
        <PrimaryButton label="Start Exploring" onPress={onStart} style={styles.cta} />
        <ReturnToGrove onPress={onReturnToGrove} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  content: { flex: 1, alignItems: "center", justifyContent: "center", padding: spacing.xxl },
  title: { ...typography.display, color: colors.text.primary, marginTop: spacing.lg },
  subtitle: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: "center",
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  cta: { alignSelf: "stretch" },
});

