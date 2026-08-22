import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, typography, spacing } from "@theme";
import { PrimaryButton } from "./PrimaryButton";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

/** Gentle, non-alarming error state — no red screens for children. */
export function ErrorState({ message = "Something wandered off. Let's try again.", onRetry }: ErrorStateProps) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.message}>{message}</Text>
      {onRetry && <PrimaryButton label="Try Again" onPress={onRetry} style={{ marginTop: spacing.lg }} />}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: "center", justifyContent: "center", padding: spacing.xl },
  message: { ...typography.body, color: colors.text.secondary, textAlign: "center" },
});
