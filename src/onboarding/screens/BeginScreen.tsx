import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CompanionReaction } from "@components/CompanionReaction";
import { PrimaryButton } from "@components/PrimaryButton";
import { colors, typography, spacing } from "@theme";
import { useOnboardingStore } from "@state/onboardingStore";

/**
 * Story-start beat. The user is invited into WonderKin in a quiet, center-stage
 * moment before the world opens up around them.
 */
export function BeginScreen() {
  const advance = useOnboardingStore((s) => s.advance);

  return (
    <View style={styles.root}>
      <CompanionReaction mood="curious" size={120} />
      <Text style={styles.title}>Welcome to WonderKin</Text>
      <Text style={styles.subtitle}>A little spark has been waiting for someone just like you.</Text>
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

