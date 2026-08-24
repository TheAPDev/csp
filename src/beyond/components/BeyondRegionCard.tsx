import React, { useEffect } from "react";
import { View, Text, Pressable, StyleSheet, ImageStyle } from "react-native";
import * as Haptics from "expo-haptics";
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withSequence, withTiming, Easing } from "react-native-reanimated";
import { AssetImage } from "@components/AssetImage";
import { colors, typography, spacing, radius, shadows } from "@theme";
import { BeyondRegionDefinition } from "@apptypes";
import { REGION_KIND_LABEL } from "../content/regions";

interface BeyondRegionCardProps {
  region: BeyondRegionDefinition;
  explored: boolean;
  onPress: () => void;
  /** Called instead of `onPress` when the region isn't open yet — a gentle Companion tease, never a dead tap. */
  onSealedPress: () => void;
}

/**
 * Available regions look like any other card. Not-yet-open regions
 * reuse Tale Trails' EpisodeCard shimmer treatment (same tokens, same
 * "in-world sealed" framing) rather than a generic greyed-out "Coming
 * Soon" box — per the master protocol's explicit COMING SOON rule.
 */
export function BeyondRegionCard({ region, explored, onPress, onSealedPress }: BeyondRegionCardProps) {
  const shimmer = useSharedValue(0);

  useEffect(() => {
    if (!region.available) {
      shimmer.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1700, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration: 1700, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        false
      );
    }
  }, [region.available]);

  const shimmerStyle = useAnimatedStyle(() => ({ opacity: 0.3 + shimmer.value * 0.35 }));

  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        region.available ? onPress() : onSealedPress();
      }}
      style={({ pressed }) => [styles.card, shadows.sm, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={region.available ? region.title : `${region.title}, not open yet`}
    >
      <AssetImage id={region.cardAssetId} style={styles.art as ImageStyle} />
      {!region.available && <Animated.View style={[styles.seal, shimmerStyle]} />}
      {!region.available && (
        <View style={styles.kindPill}>
          <Text style={styles.kindPillLabel}>{REGION_KIND_LABEL[region.kind]}</Text>
        </View>
      )}
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={1}>
          {region.title}
        </Text>
        <Text style={styles.teaser} numberOfLines={2}>
          {region.teaser}
        </Text>
        {explored && region.available && <Text style={styles.doneBadge}>Explored ✓</Text>}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.elevated,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    overflow: "hidden",
    marginBottom: spacing.md,
  },
  pressed: { opacity: 0.85 },
  art: { width: "100%", height: 130 },
  seal: { ...StyleSheet.absoluteFillObject, height: 130, backgroundColor: colors.background.primary },
  kindPill: {
    position: "absolute",
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: colors.background.overlay,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
  },
  kindPillLabel: { ...typography.caption, color: colors.text.primary },
  body: { padding: spacing.sm },
  title: { ...typography.label, color: colors.text.primary },
  teaser: { ...typography.caption, color: colors.text.secondary, marginTop: spacing.xxs, minHeight: 30 },
  doneBadge: { ...typography.caption, color: colors.accent.primary, marginTop: spacing.xxs },
});
