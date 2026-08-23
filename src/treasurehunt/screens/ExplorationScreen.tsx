import React, { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { CameraView } from "expo-camera";
import * as Haptics from "expo-haptics";
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withSequence, withTiming, Easing } from "react-native-reanimated";
import { CameraPermissionGate } from "@components/CameraPermissionGate";
import { Dialogue } from "@components/Dialogue";
import { colors, typography, spacing, touchTarget } from "@theme";
import { TreasureDefinition } from "@apptypes";
import { arSessionProvider, ARAnchor } from "@services/ar";

interface ExplorationScreenProps {
  treasures: TreasureDefinition[];
  onDiscoverTap: (treasure: TreasureDefinition) => void;
  onLeave: () => void;
}

const MARKER_SIZE = 34;

/**
 * Camera step of Treasure Hunt. The rear camera feed is the
 * exploration surface; magical markers overlay it at the AR
 * provider's anchor positions (see `services/ar` — currently the
 * polished `CameraFallbackARProvider`, swappable for real ARKit/
 * ARCore later with no changes here). Deliberately minimal HUD: one
 * small "Leave" control, one brief Companion line on arrival, and the
 * markers themselves — nothing else.
 */
export function ExplorationScreen({ treasures, onDiscoverTap, onLeave }: ExplorationScreenProps) {
  const [anchors, setAnchors] = useState<ARAnchor[]>([]);
  const [arrivalLine, setArrivalLine] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    arSessionProvider.start().then(() => {
      if (!mounted) return;
      treasures.forEach((t) => arSessionProvider.placeAnchor(t.id));
    });
    const unsubscribe = arSessionProvider.subscribeAnchors((next) => {
      if (mounted) setAnchors(next);
    });
    if (treasures[0]) {
      setArrivalLine(treasures[0].discoveryLine);
      const t = setTimeout(() => setArrivalLine(null), 3200);
      return () => {
        mounted = false;
        clearTimeout(t);
        unsubscribe();
        arSessionProvider.stop();
      };
    }
    return () => {
      mounted = false;
      unsubscribe();
      arSessionProvider.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CameraPermissionGate reason="Your Companion needs the camera to look for treasure." onCancel={onLeave}>
      <View style={styles.root}>
        <CameraView style={styles.camera} facing="back" />

        <TapLayer anchors={anchors} treasures={treasures} onDiscoverTap={onDiscoverTap} />

        {anchors.map((anchor) => (
          <Marker key={anchor.id} anchor={anchor} />
        ))}

        {arrivalLine && (
          <View style={styles.dialogueWrap} pointerEvents="none">
            <Dialogue speakerName="" line={arrivalLine} />
          </View>
        )}

        <Pressable onPress={onLeave} accessibilityRole="button" style={styles.leaveButton}>
          <Text style={styles.leaveLabel}>Leave</Text>
        </Pressable>
      </View>
    </CameraPermissionGate>
  );
}

/**
 * Full-screen tap surface, separate from the markers themselves —
 * mirrors how a real AR provider's `hitTest` works off raw screen
 * coordinates rather than a hit on a specific rendered node.
 */
function TapLayer({
  anchors,
  treasures,
  onDiscoverTap,
}: {
  anchors: ARAnchor[];
  treasures: TreasureDefinition[];
  onDiscoverTap: (treasure: TreasureDefinition) => void;
}) {
  const [size, setSize] = useState({ width: 1, height: 1 });

  return (
    <View
      style={StyleSheet.absoluteFillObject}
      onLayout={(e) => setSize({ width: e.nativeEvent.layout.width, height: e.nativeEvent.layout.height })}
    >
      <Pressable
        style={StyleSheet.absoluteFillObject}
        onPress={(event) => {
          const { locationX, locationY } = event.nativeEvent;
          const point = { x: locationX / size.width, y: locationY / size.height };
          const result = arSessionProvider.hitTest(point);
          if (!result.anchorId) return;
          const anchor = anchors.find((a) => a.id === result.anchorId);
          const treasure = anchor && treasures.find((t) => t.id === anchor.treasureId);
          if (treasure) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            onDiscoverTap(treasure);
          }
        }}
      />
    </View>
  );
}

function Marker({ anchor }: { anchor: ARAnchor }) {
  const pulse = useSharedValue(0.4);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 900, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.4, { duration: 900, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: pulse.value,
    transform: [{ scale: 0.85 + pulse.value * 0.25 }],
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.marker,
        style,
        {
          left: `${anchor.position.x * 100}%`,
          top: `${anchor.position.y * 100}%`,
          marginLeft: -MARKER_SIZE / 2,
          marginTop: -MARKER_SIZE / 2,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background.primary },
  camera: { ...StyleSheet.absoluteFillObject },
  marker: {
    position: "absolute",
    width: MARKER_SIZE,
    height: MARKER_SIZE,
    borderRadius: MARKER_SIZE / 2,
    backgroundColor: colors.accent.secondary,
    shadowColor: colors.accent.secondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 16,
    elevation: 10,
  },
  dialogueWrap: {
    position: "absolute",
    left: spacing.lg,
    right: spacing.lg,
    bottom: spacing.xxl,
  },
  leaveButton: {
    position: "absolute",
    top: spacing.xxl,
    left: spacing.xl,
    minHeight: touchTarget.comfortable,
    justifyContent: "center",
  },
  leaveLabel: { ...typography.label, color: colors.text.primary },
});
