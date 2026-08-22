import React, { useEffect } from "react";
import { View, StyleSheet, ImageStyle } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle } from "react-native-reanimated";
import { AssetImage } from "@components/AssetImage";
import { Dialogue } from "@components/Dialogue";
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
 * This is the reusable rendering half of the StoryBeat contract —
 * StoryPlayer owns sequencing, this owns a single beat's presentation.
 */
export function StoryScene({ beat }: StorySceneProps) {
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

  return (
    <View style={styles.root}>
      <Animated.View style={[styles.backgroundWrap, cameraStyle]}>
        <AssetImage id={beat.backgroundAssetId} style={styles.background as ImageStyle} />
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
