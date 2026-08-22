import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from "react-native-reanimated";
import { colors, duration, zIndex } from "@theme";

interface WorldTransitionProps {
  active: boolean;
  onComplete?: () => void;
}

/**
 * Full-screen overlay used while swapping World scenes. This is the
 * visual anchor for the transition primitives in /src/transitions —
 * those primitives drive `progress`; this component just renders it.
 */
export function WorldTransition({ active, onComplete }: WorldTransitionProps) {
  const opacityValue = useSharedValue(0);

  useEffect(() => {
    if (active) {
      opacityValue.value = withTiming(1, { duration: duration.worldTransition / 2, easing: Easing.out(Easing.cubic) }, () => {
        opacityValue.value = withTiming(0, { duration: duration.worldTransition / 2 }, (finished) => {
          if (finished && onComplete) onComplete();
        });
      });
    }
  }, [active]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacityValue.value }));

  if (!active) return null;

  return <Animated.View pointerEvents="none" style={[styles.overlay, animatedStyle]} />;
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.background.primary,
    zIndex: zIndex.transitionOverlay,
  },
});
