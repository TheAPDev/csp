import React, { useEffect } from "react";
import { View, Text, Pressable, StyleSheet, ImageStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withSequence, withTiming, Easing } from "react-native-reanimated";
import { AssetImage } from "@components/AssetImage";
import { colors, typography, spacing, radius, shadows } from "@theme";
import { StoryEpisodeDefinition } from "@apptypes";
import { EpisodeStatus } from "@state/storiesStore";

interface EpisodeCardProps {
  episode: StoryEpisodeDefinition;
  status: EpisodeStatus;
  onPress: () => void;
  /** Called instead of `onPress` when the chapter isn't open yet â€” a gentle Companion tease, never a dead tap. */
  onSealedPress: () => void;
}

/**
 * Available chapters look like any other card. Not-yet-available
 * chapters are NOT a generic greyed-out "Coming Soon" box â€” they use
 * the same card language with a slow shimmer and in-world sealed
 * framing, so the library still feels alive and complete.
 */
export function EpisodeCard({ episode, status, onPress, onSealedPress }: EpisodeCardProps) {
  const shimmer = useSharedValue(0);

  useEffect(() => {
    if (!episode.available) {
      shimmer.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1600, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration: 1600, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        false
      );
    }
  }, [episode.available]);

  const shimmerStyle = useAnimatedStyle(() => ({ opacity: 0.35 + shimmer.value * 0.35 }));

  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        episode.available ? onPress() : onSealedPress();
      }}
      style={({ pressed }) => [styles.card, shadows.sm, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={episode.available ? episode.title : `${episode.title}, not open yet`}
    >
      <AssetImage id={episode.thumbnailAssetId} style={styles.art as ImageStyle} />
      {!episode.available && <Animated.View style={[styles.seal, shimmerStyle]} />}
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={1}>
          {episode.title}
        </Text>
        <Text style={styles.teaser} numberOfLines={2}>
          {episode.available ? episode.teaser : "This trail hasn't opened yet â€” it's still gathering starlight."}
        </Text>
        {status === "complete" && episode.available && <Text style={styles.doneBadge}>Told âœ“</Text>}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 168,
    backgroundColor: colors.background.elevated,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    overflow: "hidden",
  },
  pressed: { opacity: 0.85 },
  art: { width: "100%", height: 104 },
  seal: {
    ...StyleSheet.absoluteFillObject,
    height: 104,
    backgroundColor: colors.background.primary,
  },
  body: { padding: spacing.sm },
  title: { ...typography.label, color: colors.text.primary },
  teaser: { ...typography.caption, color: colors.text.secondary, marginTop: spacing.xxs, minHeight: 30 },
  doneBadge: { ...typography.caption, color: colors.accent.primary, marginTop: spacing.xxs },
});

