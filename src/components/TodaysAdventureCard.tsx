import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { colors, typography, spacing, radius, shadows } from "@theme";
import { PrimaryButton } from "./PrimaryButton";

interface TodaysAdventureCardProps {
  title: string;
  subtitle: string;
  onPress: () => void;
}

/**
 * The single, unmistakable primary action on the Grove screen, per
 * the Child UX rule of one primary action per screen. Everything else
 * on the Grove (status access, Companion, world gateways) is
 * secondary to this. Visually it must read as an invitation, not a
 * task-list item â€” no checkbox, no "assigned" language.
 */
export function TodaysAdventureCard({ title, subtitle, onPress }: TodaysAdventureCardProps) {
  return (
    <LinearGradient
      colors={[colors.background.elevated, colors.background.surface]}
      style={[styles.card, shadows.lg]}
    >
      <View style={styles.textWrap}>
        <Text style={styles.eyebrow}>Today's Adventure</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      <PrimaryButton label="Begin" onPress={onPress} style={styles.button} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    padding: spacing.xl,
    marginHorizontal: spacing.xl,
  },
  textWrap: { marginBottom: spacing.lg },
  eyebrow: { ...typography.caption, color: colors.accent.secondary, marginBottom: spacing.xxs },
  title: { ...typography.title, color: colors.text.primary, marginBottom: spacing.xxs },
  subtitle: { ...typography.body, color: colors.text.secondary },
  button: { alignSelf: "flex-start" },
});

