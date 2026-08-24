import React, { useEffect } from "react";
import { Text, StyleSheet } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay } from "react-native-reanimated";
import { colors, typography, spacing, radius, duration, shadows, zIndex } from "@theme";

interface ToastProps {
  message: string;
  visible: boolean;
  onHide?: () => void;
}

/** Lightweight feedback toast — no error-tone red for child-facing misses. */
export function Toast({ message, visible, onHide }: ToastProps) {
  const opacityValue = useSharedValue(0);

  useEffect(() => {
    if (!visible) return;

    opacityValue.value = withTiming(1, { duration: duration.fast });

    const timer = setTimeout(() => {
      opacityValue.value = withTiming(0, { duration: duration.fast });
      onHide?.();
    }, 2200);

    return () => clearTimeout(timer);
  }, [visible, onHide]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacityValue.value }));

  if (!visible) return null;

  return (
    <Animated.View style={[styles.wrap, shadows.md, animatedStyle]}>
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    backgroundColor: colors.background.elevated,
    borderRadius: radius.pill,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    zIndex: zIndex.toast,
  },
  text: { ...typography.label, color: colors.text.primary },
});
