import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { CompanionReaction } from "@components/CompanionReaction";
import { PrimaryButton } from "@components/PrimaryButton";
import { colors, typography, spacing } from "@theme";
import { useOnboardingStore } from "@state/onboardingStore";

/** The "Welcome to WONDERKIN" beat that hands off into the cinematic intro. */
export function BeginScreen() {
  const advance = useOnboardingStore((s) => s.advance);

  return (
    <View style={styles.root}>
      <CompanionReaction mood="curious" size={120} />
      <Text style={styles.title}>Welcome to WONDERKIN</Text>
      <Text style={styles.subtitle}>Something is waiting for you, just past the lantern light.</Text>
      <PrimaryButton label="Let's Begin" onPress={advance} style={styles.cta} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background.primary, alignItems: "center", justifyContent: "center", padding: spacing.xxl },
  title: { ...typography.title, color: colors.text.primary, marginTop: spacing.xl, textAlign: "center" },
  subtitle: { ...typography.body, color: colors.text.secondary, marginTop: spacing.sm, textAlign: "center", marginBottom: spacing.xxl },
  cta: { alignSelf: "stretch" },
});
