import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import * as Haptics from "expo-haptics";
import { colors, typography, spacing, radius, shadows } from "@theme";
import { useOnboardingStore } from "@state/onboardingStore";
import { useCompanionStore } from "@state/companionStore";
import { firstPromiseOptions, PromiseOption } from "../content/promises";
import { CompanionTraits } from "@apptypes";

/**
 * The First Promise — an emotionally meaningful choice, not a
 * tutorial checkbox. Whichever line the child picks becomes a quiet
 * internal lean on the Companion; it is never scored or shown.
 */
export function FirstPromiseScreen() {
  const companionName = useOnboardingStore((s) => s.companionName);
  const setFirstPromise = useOnboardingStore((s) => s.setFirstPromise);
  const complete = useOnboardingStore((s) => s.complete);
  const nudgeTrait = useCompanionStore((s) => s.nudgeTrait);

  function handleChoose(option: PromiseOption) {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setFirstPromise(option.id);
    (Object.entries(option.traitLean) as [keyof CompanionTraits, number][]).forEach(([trait, amount]) => {
      nudgeTrait(trait, amount);
    });
    complete();
  }

  return (
    <View style={styles.root}>
      <Text style={styles.title}>Your First Promise</Text>
      <Text style={styles.subtitle}>
        {companionName ? `What will you and ${companionName} promise each other?` : "What will you promise each other?"}
      </Text>
      {firstPromiseOptions.map((option) => (
        <Pressable
          key={option.id}
          onPress={() => handleChoose(option)}
          style={({ pressed }) => [styles.option, shadows.sm, pressed && styles.pressed]}
          accessibilityRole="button"
        >
          <Text style={styles.optionText}>{option.line}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background.primary, padding: spacing.xxl, justifyContent: "center" },
  title: { ...typography.title, color: colors.text.primary, textAlign: "center", marginBottom: spacing.xs },
  subtitle: { ...typography.body, color: colors.text.secondary, textAlign: "center", marginBottom: spacing.xxl },
  option: {
    backgroundColor: colors.background.elevated,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    padding: spacing.lg,
    marginBottom: spacing.md,
    minHeight: 56,
    justifyContent: "center",
  },
  pressed: { opacity: 0.8 },
  optionText: { ...typography.body, color: colors.text.primary, textAlign: "center" },
});
