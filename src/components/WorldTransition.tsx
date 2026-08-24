import React, { useEffect } from "react";
import { StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  Easing,
} from "react-native-reanimated";
import { colors, duration, zIndex } from "@theme";

export type WorldTransitionVariant = "fade" | "portal" | "fold" | "path" | "dissolve";

interface WorldTransitionProps {
  active: boolean;
  onComplete?: () => void;
  /**
   * Which visual language this swap uses. Defaults to "fade" to stay
   * backward compatible with earlier batches (e.g. the onboarding
   * hand-off into the Grove). Batch 03 world-switching picks a
   * variant per route — see navigation/transitionVariant.ts — instead
   * of one arbitrary slide for everything.
   */
  variant?: WorldTransitionVariant;
}

const { width, height } = Dimensions.get("window");
const DIAGONAL = Math.sqrt(width * width + height * height);

/**
 * Full-screen overlay used while swapping World scenes. This is the
 * visual anchor for the transition primitives in /src/transitions —
 * those primitives drive `progress`; this component renders it as one
 * of a few distinct cinematic languages rather than an arbitrary
 * slide, per the master protocol's transition rules.
 */
export function WorldTransition({ active, onComplete, variant = "fade" }: WorldTransitionProps) {
  const progress = useSharedValue(0);

  useEffect(() => {
    if (!active) return;
    const half = duration.worldTransition / 2;

    progress.value = withSequence(
      withTiming(1, { duration: half, easing: Easing.out(Easing.cubic) }),
      withTiming(0, { duration: half, easing: Easing.in(Easing.cubic) })
    );

    const timer = setTimeout(() => {
      onComplete?.();
    }, duration.worldTransition);

    return () => clearTimeout(timer);
  }, [active, onComplete]);

  const fadeStyle = useAnimatedStyle(() => ({ opacity: progress.value }));

  const portalStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ scale: 0.2 + progress.value * 1.6 }],
    borderRadius: DIAGONAL,
  }));

  const foldStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ scale: 1.3 - progress.value * 0.3 }, { rotate: `${(1 - progress.value) * 8}deg` }],
  }));

  const pathStyle = useAnimatedStyle(() => ({
    opacity: Math.min(1, progress.value * 1.4),
    transform: [{ translateX: (progress.value - 0.5) * width * 1.4 }],
  }));

  const dissolveStyle = useAnimatedStyle(() => ({
    opacity: progress.value * 0.94,
  }));

  if (!active) return null;

  switch (variant) {
    case "portal":
      return <Animated.View pointerEvents="none" style={[styles.overlay, styles.portalShape, portalStyle]} />;
    case "fold":
      return <Animated.View pointerEvents="none" style={[styles.overlay, foldStyle]} />;
    case "path":
      return (
        <Animated.View pointerEvents="none" style={[styles.overlay, styles.pathBase]}>
          <Animated.View style={[styles.pathStreak, pathStyle]} />
        </Animated.View>
      );
    case "dissolve":
      return <Animated.View pointerEvents="none" style={[styles.overlay, dissolveStyle]} />;
    case "fade":
    default:
      return <Animated.View pointerEvents="none" style={[styles.overlay, fadeStyle]} />;
  }
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.background.primary,
    zIndex: zIndex.transitionOverlay,
  },
  portalShape: {
    backgroundColor: colors.background.primary,
  },
  pathBase: {
    backgroundColor: "transparent",
    overflow: "hidden",
  },
  pathStreak: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: "50%",
    width: width * 0.5,
    marginLeft: -width * 0.25,
    backgroundColor: colors.background.primary,
  },
});
