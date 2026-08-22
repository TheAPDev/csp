import React from "react";
import { View, Text, StyleSheet, ImageStyle } from "react-native";
import { AssetImage } from "@components/AssetImage";
import { PrimaryButton } from "@components/PrimaryButton";
import { colors, typography, spacing } from "@theme";
import { useOnboardingStore } from "@state/onboardingStore";

/**
 * First screen a child ever sees. One obvious primary action, no
 * explanation required — communicates WONDERKIN through mood alone.
 */
export function WelcomeScreen() {
  const advance = useOnboardingStore((s) => s.advance);

  return (
    <View style={styles.root}>
      <AssetImage id="ONBOARDING_WELCOME_BACKGROUND" style={styles.background as ImageStyle} />
      <View style={styles.content}>
        <Text style={styles.title}>WONDERKIN</Text>
        <Text style={styles.subtitle}>A world that's waiting to meet you.</Text>
        <PrimaryButton label="Continue" onPress={advance} style={styles.cta} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background.primary },
  background: { ...StyleSheet.absoluteFillObject },
  content: { flex: 1, justifyContent: "flex-end", padding: spacing.xxl },
  title: { ...typography.display, color: colors.text.primary, marginBottom: spacing.sm },
  subtitle: { ...typography.bodyLarge, color: colors.text.secondary, marginBottom: spacing.xxl },
  cta: { alignSelf: "stretch" },
});
