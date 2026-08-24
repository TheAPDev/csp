import React from "react";
import { Pressable, Text, StyleSheet, ViewStyle, StyleProp, GestureResponderEvent } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { colors, typography, spacing, radius, touchTarget, opacity } from "@theme";

interface SecondaryButtonProps {
  label: string;
  onPress: (e: GestureResponderEvent) => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function SecondaryButton({ label, onPress, disabled, style }: SecondaryButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={(e) => {
        Haptics.selectionAsync();
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
    minHeight: touchTarget.comfortable,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.border.default,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: {
    borderColor: colors.border.subtle,
  },
  label: {
    ...typography.label,
    color: colors.text.primary,
  },
});

