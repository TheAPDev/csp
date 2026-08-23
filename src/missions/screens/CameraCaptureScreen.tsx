import React, { useRef, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { CameraView } from "expo-camera";
import * as Haptics from "expo-haptics";
import { CameraPermissionGate } from "@components/CameraPermissionGate";
import { colors, typography, spacing, radius, touchTarget } from "@theme";

interface CameraCaptureScreenProps {
  onCaptured: (uri: string) => void;
  onCancel: () => void;
}

/**
 * Camera step of the photo submission flow. Permission handling
 * (denied/canAskAgain branching, loading, cancel) now lives in the
 * shared `CameraPermissionGate` (Batch 06) — Treasure Hunt's
 * exploration screen reuses the exact same gate rather than a
 * parallel permission flow. This screen still owns everything
 * specific to a single-shot photo capture: the shutter, capture
 * failure handling, and the resulting URI handoff to preview.
 */
export function CameraCaptureScreen({ onCaptured, onCancel }: CameraCaptureScreenProps) {
  const [capturing, setCapturing] = useState(false);
  const [captureError, setCaptureError] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  async function handleCapture() {
    if (!cameraRef.current || capturing) return;
    setCapturing(true);
    setCaptureError(false);
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.7 });
      if (photo?.uri) {
        onCaptured(photo.uri);
      } else {
        setCaptureError(true);
      }
    } catch {
      setCaptureError(true);
    } finally {
      setCapturing(false);
    }
  }

  return (
    <CameraPermissionGate
      reason="Your Companion needs the camera to see your mission photo."
      onCancel={onCancel}
    >
      <View style={styles.root}>
        <CameraView ref={cameraRef} style={styles.camera} facing="back" />
        {captureError && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>That didn't quite work — let's try again.</Text>
          </View>
        )}
        <View style={styles.controls}>
          <Pressable onPress={onCancel} accessibilityRole="button" style={styles.cancelButton}>
            <Text style={styles.cancelLabel}>Cancel</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              handleCapture();
            }}
            disabled={capturing}
            accessibilityRole="button"
            accessibilityLabel="Take photo"
            style={[styles.shutter, capturing && styles.shutterBusy]}
          />
          <View style={styles.cancelButton} />
        </View>
      </View>
    </CameraPermissionGate>
  );
}

const SHUTTER_SIZE = 76;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background.primary },
  camera: { flex: 1 },
  controls: {
    position: "absolute",
    bottom: spacing.xxl,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.xl,
  },
  cancelButton: { width: touchTarget.comfortable, alignItems: "center" },
  cancelLabel: { ...typography.label, color: colors.text.primary },
  shutter: {
    width: SHUTTER_SIZE,
    height: SHUTTER_SIZE,
    borderRadius: SHUTTER_SIZE / 2,
    backgroundColor: colors.text.primary,
    borderWidth: 4,
    borderColor: colors.background.overlay,
  },
  shutterBusy: { opacity: 0.6 },
  errorBanner: {
    position: "absolute",
    top: spacing.xxl,
    alignSelf: "center",
    backgroundColor: colors.background.overlay,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  errorText: { ...typography.caption, color: colors.text.primary },
});
