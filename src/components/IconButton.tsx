import React from "react";
import { Pressable, StyleSheet, ViewStyle, StyleProp, GestureResponderEvent } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { colors, radius, touchTarget, opacity } from "@theme";

interface IconButtonProps {
  onPress: (e: GestureResponderEvent) => void;
  children: React.ReactNode;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function IconButton({ onPress, children, disabled, style }: IconButtonProps) {
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
        pressed && !disabled && { opacity: opacity.pressed },
        style,
      ]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    width: touchTarget.minimum,
    height: touchTarget.minimum,
    borderRadius: radius.pill,
    backgroundColor: colors.background.surface,
    alignItems: "center",
    justifyContent: "center",
  },
});

