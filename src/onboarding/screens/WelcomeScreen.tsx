import React from "react";
import { View, Text, StyleSheet, ImageStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AssetImage } from "@components/AssetImage";
import { PrimaryButton } from "@components/PrimaryButton";
import { colors, typography, spacing } from "@theme";
import { useOnboardingStore } from "@state/onboardingStore";

/**
 * Story-forward welcome screen that brings the child directly into the WonderKin
 * invitation instead of a generic app login or loading state.
 */
export function WelcomeScreen() {
  const advance = useOnboardingStore((s) => s.advance);

  return (
    <View style={styles.root}>
      <AssetImage id="ONBOARDING_WELCOME_BACKGROUND" style={styles.background as ImageStyle} />
      <View style={styles.content}>
        <Text style={styles.subtitle}>A world is waiting for you.</Text>
        <PrimaryButton label="Let's Begin" onPress={advance} style={styles.cta} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background.primary },
  background: { ...StyleSheet.absoluteFillObject },
  content: { flex: 1, justifyContent: "center", alignItems: "center", padding: spacing.xxl },
  title: { ...typography.display, color: colors.text.primary, marginBottom: spacing.sm, textAlign: "center" },
  subtitle: { ...typography.bodyLarge, color: colors.text.secondary, marginBottom: spacing.xxl, textAlign: "center" },
  cta: { alignSelf: "stretch" },
});

