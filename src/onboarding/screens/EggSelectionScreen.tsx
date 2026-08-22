import React from "react";
import { View, Text, Pressable, StyleSheet, ImageStyle } from "react-native";
import * as Haptics from "expo-haptics";
import { AssetImage } from "@components/AssetImage";
import { colors, typography, spacing, radius, shadows } from "@theme";
import { useOnboardingStore } from "@state/onboardingStore";
import { eggDefinitions, EggDefinition } from "../content/eggs";

/**
 * Three mysterious eggs. Differences are conveyed visually and via a
 * short clue only — never labeled as personality types, and no hidden
 * trait is ever revealed here (master protocol §THREE EGGS).
 */
export function EggSelectionScreen() {
  const selectEgg = useOnboardingStore((s) => s.selectEgg);
  const advance = useOnboardingStore((s) => s.advance);

  function handleSelect(egg: EggDefinition) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    selectEgg(egg.id);
    advance();
  }

  return (
    <View style={styles.root}>
      <Text style={styles.title}>Three eggs are waiting.</Text>
      <Text style={styles.subtitle}>Which one calls to you?</Text>
      <View style={styles.row}>
        {eggDefinitions.map((egg) => (
          <Pressable
            key={egg.id}
            onPress={() => handleSelect(egg)}
            style={({ pressed }) => [styles.eggCard, shadows.glow, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Choose this egg"
          >
            <AssetImage id={egg.assetId} style={styles.eggImage as ImageStyle} />
            <Text style={styles.clue}>{egg.clue}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background.primary, padding: spacing.xl, justifyContent: "center" },
  title: { ...typography.title, color: colors.text.primary, textAlign: "center" },
  subtitle: { ...typography.body, color: colors.text.secondary, textAlign: "center", marginBottom: spacing.xxl },
  row: { flexDirection: "row", justifyContent: "space-between", gap: spacing.md },
  eggCard: {
    flex: 1,
    minHeight: 180,
    backgroundColor: colors.background.elevated,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    padding: spacing.md,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: { opacity: 0.8 },
  eggImage: { width: 64, height: 88, borderRadius: radius.md, marginBottom: spacing.sm },
  clue: { ...typography.caption, color: colors.text.secondary, textAlign: "center" },
});
