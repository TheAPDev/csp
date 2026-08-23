import React, { useState } from "react";
import { View, Text, Image, StyleSheet, SafeAreaView } from "react-native";
import { PrimaryButton } from "@components/PrimaryButton";
import { SecondaryButton } from "@components/SecondaryButton";
import { LoadingIndicator } from "@components/LoadingIndicator";
import { colors, typography, spacing, radius } from "@theme";
import { uploadMissionPhoto } from "@services/missions/submissionUpload";

interface PhotoPreviewScreenProps {
  photoUri: string;
  onRetake: () => void;
  onUploaded: () => void;
  onCancel: () => void;
}

/**
 * Preview + submit. Owns upload failure / network failure handling —
 * a failed "upload" (simulated for now, see submissionUpload.ts)
 * offers a clear retry or a way back to preview, never a dead end.
 */
export function PhotoPreviewScreen({ photoUri, onRetake, onUploaded, onCancel }: PhotoPreviewScreenProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadFailed, setUploadFailed] = useState(false);

  async function handleSubmit() {
    setUploading(true);
    setUploadFailed(false);
    const result = await uploadMissionPhoto(photoUri);
    setUploading(false);
    if (result.ok) {
      onUploaded();
    } else {
      setUploadFailed(true);
    }
  }

  if (uploading) return <LoadingIndicator />;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <Text style={styles.title}>Look at that!</Text>
        <Image source={{ uri: photoUri }} style={styles.preview} />

        {uploadFailed && (
          <Text style={styles.errorText}>That didn't quite send — want to try again?</Text>
        )}

        <PrimaryButton label={uploadFailed ? "Try Again" : "Submit"} onPress={handleSubmit} style={styles.cta} />
        <SecondaryButton label="Retake Photo" onPress={onRetake} style={styles.cta} />
        {uploadFailed && <SecondaryButton label="Cancel" onPress={onCancel} style={styles.cta} />}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background.primary },
  content: { flex: 1, padding: spacing.xl, alignItems: "center", justifyContent: "center" },
  title: { ...typography.title, color: colors.text.primary, marginBottom: spacing.lg },
  preview: { width: "100%", height: 320, borderRadius: radius.lg, marginBottom: spacing.lg },
  errorText: { ...typography.body, color: colors.feedback.danger, textAlign: "center", marginBottom: spacing.md },
  cta: { alignSelf: "stretch" },
});
