import React from "react";
import { Pressable, Text, StyleSheet, ViewStyle, StyleProp, GestureResponderEvent } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { colors, typography, spacing, radius, touchTarget, opacity } from "@theme";

interface PrimaryButtonProps {
  label: string;
  onPress: (e: GestureResponderEvent) => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

/** The single primary call-to-action style. One per screen, per CHILD_UX_RULES. */
export function PrimaryButton({ label, onPress, disabled, style }: PrimaryButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={(e) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onPress(e);
      }}
      style={({ pressed }) => [
        styles.base,
        disabled && styles.disabled,
        pressed && !disabled && { opacity: opacity.pressed },
        style,
      ]}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: touchTarget.primary,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.pill,
    backgroundColor: colors.accent.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: {
    backgroundColor: colors.background.surface,
  },
  label: {
    ...typography.heading,
    color: colors.text.primary,
  },
});

