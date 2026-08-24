import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CompanionReaction } from "@components/CompanionReaction";
import { PrimaryButton } from "@components/PrimaryButton";
import { colors, typography, spacing } from "@theme";
import { useOnboardingStore } from "@state/onboardingStore";
import { useCompanionStore } from "@state/companionStore";

/** The Companion's identity is revealed â€” earned by the hatching beat that precedes it. */
export function CompanionRevealScreen() {
  const advance = useOnboardingStore((s) => s.advance);
  const setMood = useCompanionStore((s) => s.setMood);

  useEffect(() => {
    setMood("happy");
  }, [setMood]);

  return (
    <View style={styles.root}>
      <CompanionReaction mood="celebrating" size={160} />
      <Text style={styles.title}>Hello.</Text>
      <Text style={styles.subtitle}>Your Companion has been waiting to meet you too.</Text>
      <PrimaryButton label="Continue" onPress={advance} style={styles.cta} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background.primary, alignItems: "center", justifyContent: "center", padding: spacing.xxl },
  title: { ...typography.display, color: colors.text.primary, marginTop: spacing.xl },
  subtitle: { ...typography.body, color: colors.text.secondary, textAlign: "center", marginTop: spacing.sm, marginBottom: spacing.xxl },
  cta: { alignSelf: "stretch" },
});

