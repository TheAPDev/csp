import React from "react";
import { View, Text, Linking, StyleSheet } from "react-native";
import { useCameraPermissions } from "expo-camera";
import { PrimaryButton } from "./PrimaryButton";
import { SecondaryButton } from "./SecondaryButton";
import { colors, typography, spacing } from "@theme";

interface CameraPermissionGateProps {
  /** Child-facing reason shown while permission is being requested — keep it Companion-voiced, e.g. "Your Companion needs the camera to look for treasure." */
  reason: string;
  onCancel: () => void;
  children: React.ReactNode;
}

/**
 * The existing camera abstraction (Batch 04 originated this in
 * `missions/screens/CameraCaptureScreen.tsx`; Batch 06 extracts it
 * here so Treasure Hunt reuses it instead of inventing a parallel
 * permission flow — see master protocol §DO NOT ("Do not break
 * Mission camera functionality. Reuse the existing camera
 * abstraction."). Handles every state the protocol calls out:
 * loading, denied-but-askable, denied-forever (Settings deep link),
 * and cancel. Renders `children` (the live `CameraView` + that
 * screen's own controls) only once permission is granted.
 */
export function CameraPermissionGate({ reason, onCancel, children }: CameraPermissionGateProps) {
  const [permission, requestPermission] = useCameraPermissions();

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
            ? reason
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

  return <>{children}</>;
}

const styles = StyleSheet.create({
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
});
