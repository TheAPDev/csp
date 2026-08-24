import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet, ImageStyle } from "react-native";
import * as Haptics from "expo-haptics";
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withSequence, withTiming, Easing } from "react-native-reanimated";
import { AssetImage } from "@components/AssetImage";
import { Dialogue } from "@components/Dialogue";
import { PrimaryButton } from "@components/PrimaryButton";
import { colors, typography, spacing, radius, shadows, zIndex } from "@theme";
import { BeyondRegionDefinition, BeyondPointOfInterest } from "@apptypes";
import { useBeyondStore } from "@state/beyondStore";

interface RegionExplorationScreenProps {
  region: BeyondRegionDefinition;
  onAllDiscovered: () => void;
  onLeave: () => void;
}

/**
 * The interactive region itself — full-bleed background with a
 * handful of glowing points of interest to tap, in-world (no
 * counters, no HUD, no coordinates), matching Treasure Hunt's
 * "no numbers on the discovery HUD" rule even though this isn't a
 * camera/AR surface. Reveals one Companion/narrator line per point,
 * via a "Continue" tap rather than a timer, so nothing here can
 * soft-lock on a slow or interrupted animation.
 */
export function RegionExplorationScreen({ region, onAllDiscovered, onLeave }: RegionExplorationScreenProps) {
  const points = region.points ?? [];
  const isDiscovered = useBeyondStore((s) => s.isDiscovered);
  const discover = useBeyondStore((s) => s.discover);
  const [activePoint, setActivePoint] = useState<BeyondPointOfInterest | null>(null);

  const discoveredCount = points.filter((p) => isDiscovered(region.id, p.id)).length;
  const allDiscovered = points.length > 0 && discoveredCount === points.length;

  function handleTapPoint(point: BeyondPointOfInterest) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    discover(region.id, point.id);
    setActivePoint(point);
  }

  return (
    <View style={styles.root}>
      <AssetImage id={region.cardAssetId} style={styles.background as ImageStyle} />

      {points.map((point) => (
        <PointMarker
          key={point.id}
          point={point}
          discovered={isDiscovered(region.id, point.id)}
          onPress={() => handleTapPoint(point)}
        />
      ))}

      {activePoint && !allDiscovered && (
        <View style={styles.dialogueWrap}>
          <Dialogue speakerName="" line={activePoint.line} />
        </View>
      )}

      {allDiscovered && (
        <View style={styles.dialogueWrap}>
          <Text style={styles.doneLine}>You've felt out every corner of this place.</Text>
          <PrimaryButton label="Continue" onPress={onAllDiscovered} style={styles.cta} />
        </View>
      )}

      <Pressable onPress={onLeave} style={styles.leave} accessibilityRole="button">
        <Text style={styles.leaveLabel}>Leave</Text>
      </Pressable>
    </View>
  );
}

function PointMarker({
  point,
  discovered,
  onPress,
}: {
  point: BeyondPointOfInterest;
  discovered: boolean;
  onPress: () => void;
}) {
  const pulse = useSharedValue(0);

  React.useEffect(() => {
    if (!discovered) {
      pulse.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1100, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration: 1100, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        false
      );
    }
  }, [discovered]);

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: discovered ? 0.4 : 0.6 + pulse.value * 0.4,
    transform: [{ scale: discovered ? 1 : 1 + pulse.value * 0.25 }],
  }));

  return (
    <Pressable
      onPress={onPress}
      style={[styles.marker, { left: `${point.x * 100}%`, top: `${point.y * 100}%` }]}
      accessibilityRole="button"
      accessibilityLabel="Explore this spot"
    >
      <Animated.View style={[styles.markerGlow, shadows.glow, pulseStyle, discovered && styles.markerDiscovered]} />
    </Pressable>
  );
}

const MARKER_SIZE = 28;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background.primary },
  background: { ...StyleSheet.absoluteFillObject },
  marker: {
    position: "absolute",
    width: 48,
    height: 48,
    marginLeft: -24,
    marginTop: -24,
    alignItems: "center",
    justifyContent: "center",
  },
  markerGlow: {
    width: MARKER_SIZE,
    height: MARKER_SIZE,
    borderRadius: MARKER_SIZE / 2,
    backgroundColor: colors.accent.secondary,
  },
  markerDiscovered: { backgroundColor: colors.accent.primary },
  dialogueWrap: {
    position: "absolute",
    left: spacing.lg,
    right: spacing.lg,
    bottom: spacing.xxl,
    zIndex: zIndex.hud,
  },
  doneLine: {
    ...typography.bodyLarge,
    color: colors.text.primary,
    textAlign: "center",
    marginBottom: spacing.md,
    backgroundColor: colors.background.overlay,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  cta: { alignSelf: "stretch" },
  leave: {
    position: "absolute",
    top: spacing.xl,
    left: spacing.lg,
    backgroundColor: colors.background.overlay,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    zIndex: zIndex.hud,
  },
  leaveLabel: { ...typography.label, color: colors.text.primary },
});
