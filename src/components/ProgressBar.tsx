import React from "react";
import { View, StyleSheet } from "react-native";
import { colors, radius, duration } from "@theme";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { useEffect } from "react";

interface ProgressBarProps {
  progress: number; // 0..1
  height?: number;
}

/** Non-anxiety progress indicator — no numeric grading, just visual fill. */
export function ProgressBar({ progress, height = 12 }: ProgressBarProps) {
  const width = useSharedValue(0);

  useEffect(() => {
    width.value = withTiming(Math.max(0, Math.min(1, progress)) * 100, { duration: duration.base });
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${width.value}%`,
  }));

  return (
    <View style={[styles.track, { height, borderRadius: height / 2 }]}>
      <Animated.View style={[styles.fill, { borderRadius: height / 2 }, animatedStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: "100%",
    backgroundColor: colors.background.surface,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    backgroundColor: colors.accent.secondary,
  },
});
