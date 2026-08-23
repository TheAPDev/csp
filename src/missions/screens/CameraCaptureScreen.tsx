import React, { useRef, useState } from "react";
import { View, Text, Pressable, StyleSheet, Linking } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Haptics from "expo-haptics";
import { PrimaryButton } from "@components/PrimaryButton";
import { SecondaryButton } from "@components/SecondaryButton";
import { colors, typography, spacing, radius, touchTarget } from "@theme";

interface CameraCaptureScreenProps {
  onCaptured: (uri: string) => void;
  onCancel: () => void;
}

/**
 * Camera step of the photo submission flow. Handles every state the
 * master protocol calls out explicitly: denied permission (with a
 * path to Settings and a retry), cancel, and capture failure. Upload
 * failure/network failure are handled one step later, in the preview
 * screen's submit action.
 */
export function CameraCaptureScreen({ onCaptured, onCancel }: CameraCaptureScreenProps) {
  const [permission, requestPermission] = useCameraPermissions();
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

  if (!permission) {
    return (
      <View style={styles.centeredRoot}>
        <Text style={styles.message}>Getting the camera ready…</Text>
      </View>
    );
  }

  if (!permission.granted) {
    const canAskAgain = permission.canAskAgain;
    return (
      <View style={styles.centeredRoot}>
        <Text style={styles.title}>Camera access needed</Text>
        <Text style={styles.message}>
          {canAskAgain
            ? "Your Companion needs the camera to see your mission photo."
            : "Camera access is turned off. A grown-up can turn it back on in Settings."}
        </Text>
        {canAskAgain ? (
          <PrimaryButton label="Allow Camera" onPress={requestPermission} style={styles.cta} />
        ) : (
          <PrimaryButton label="Open Settings" onPress={() => Linking.openSettings()} style={styles.cta} />
        )}
        <SecondaryButton label="Cancel" onPress={onCancel} style={styles.cta} />
      </View>
    );
  }

  return (
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
  );
}

const SHUTTER_SIZE = 76;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background.primary },
  camera: { flex: 1 },
  centeredRoot: {
    flex: 1,
    backgroundColor: colors.background.primary,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xxl,
  },
  title: { ...typography.title, color: colors.text.primary, textAlign: "center", marginBottom: spacing.sm },
  message: { ...typography.body, color: colors.text.secondary, textAlign: "center", marginBottom: spacing.xl },
  cta: { alignSelf: "stretch", marginBottom: spacing.md },
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
