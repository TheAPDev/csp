import React, { useEffect } from "react";
import { View, StyleSheet, ImageStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { useSharedValue, useAnimatedStyle } from "react-native-reanimated";
import { AssetImage } from "@components/AssetImage";
import { AssetVideo } from "@components/AssetVideo";
import { Dialogue } from "@components/Dialogue";
import { getAsset } from "@assets/registry";
import { colors, spacing, zIndex } from "@theme";
import { cinematicCamera } from "@transitions";
import { StoryBeat } from "./types";
import { ParticleField } from "./ParticleField";

interface StorySceneProps {
  beat: StoryBeat;
}

/**
 * Renders a single cinematic story beat: background, subtle camera
 * motion (via the shared `cinematicCamera` transition primitive),
 * optional particle field, optional Companion/narrator dialogue.
 * This is the reusable rendering half of the StoryBeat contract â€”
 * StoryPlayer owns sequencing, this owns a single beat's presentation.
 */
interface StoryScenePropsWithVideo extends StorySceneProps {
  useVideoBackground?: boolean;
}

export function StoryScene({ beat, useVideoBackground }: StoryScenePropsWithVideo) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = 0;
    if (beat.cameraEffect && beat.cameraEffect !== "none") {
      cinematicCamera(progress);
    }
  }, [beat.id]);

  const cameraStyle = useAnimatedStyle(() => {
    const drift = beat.cameraEffect === "drift" ? progress.value * 14 : 0;
    const pushPull =
      beat.cameraEffect === "push"
        ? 1 + progress.value * 0.06
        : beat.cameraEffect === "pull"
          ? 1.06 - progress.value * 0.06
          : 1;
    return {
      transform: [{ translateX: drift }, { scale: pushPull }],
    };
  });

  const hasBeatVideo = !!beat.videoAssetId && !!getAsset(beat.videoAssetId)?.source;

  return (
    <View style={styles.root}>
      <Animated.View style={[styles.backgroundWrap, cameraStyle]}>
        {hasBeatVideo ? (
          <AssetVideo id={beat.videoAssetId!} style={styles.background} shouldPlay isLooping />
        ) : (
          <AssetImage id={beat.backgroundAssetId} style={styles.background as ImageStyle} />
        )}
      </Animated.View>
      {beat.particles && (
        <View style={styles.particleAnchor} pointerEvents="none">
          <ParticleField active={!!beat.particles} />
        </View>
      )}
      {beat.line && (
        <View style={styles.dialogueWrap}>
          <Dialogue speakerName={beat.speaker ?? ""} line={beat.line} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background.primary, overflow: "hidden" },
  backgroundWrap: { ...StyleSheet.absoluteFillObject },
  background: { ...StyleSheet.absoluteFillObject },
  particleAnchor: { position: "absolute", top: "40%", left: "50%", zIndex: zIndex.hud },
  dialogueWrap: { position: "absolute", left: spacing.lg, right: spacing.lg, bottom: spacing.xxxl, zIndex: zIndex.hud },
});

