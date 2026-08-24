import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CompanionReaction } from "@components/CompanionReaction";
import { PrimaryButton } from "@components/PrimaryButton";
import { colors, typography, spacing, radius } from "@theme";
import { useOnboardingStore } from "@state/onboardingStore";
import { useCompanionStore } from "@state/companionStore";

/** A beautiful, simple naming moment â€” the Companion's name persists from here on. */
export function NamingScreen() {
  const advance = useOnboardingStore((s) => s.advance);
  const setOnboardingName = useOnboardingStore((s) => s.setCompanionName);
  const setCompanionName = useCompanionStore((s) => s.setName);
  const [name, setName] = useState("");

  function handleContinue() {
    const trimmed = name.trim().slice(0, 16);
    if (!trimmed) return;
    setOnboardingName(trimmed);
    setCompanionName(trimmed);
    advance();
  }

  return (
    <View style={styles.root}>
      <CompanionReaction mood="curious" size={110} />
      <Text style={styles.title}>What will you call your Companion?</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Type a name"
        placeholderTextColor={colors.text.disabled}
        maxLength={16}
        autoCapitalize="words"
      />
      <PrimaryButton label="Continue" onPress={handleContinue} disabled={!name.trim()} style={styles.cta} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background.primary, alignItems: "center", justifyContent: "center", padding: spacing.xxl },
  title: { ...typography.heading, color: colors.text.primary, textAlign: "center", marginVertical: spacing.xl },
  input: {
    ...typography.bodyLarge,
    color: colors.text.primary,
    backgroundColor: colors.background.elevated,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border.default,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    width: "100%",
    textAlign: "center",
    marginBottom: spacing.xl,
  },
  cta: { alignSelf: "stretch" },
});

