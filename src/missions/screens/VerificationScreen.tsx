import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { CompanionReaction } from "@components/CompanionReaction";
import { PrimaryButton } from "@components/PrimaryButton";
import { colors, typography, spacing } from "@theme";
import { MissionDefinition } from "@apptypes";
import { missionVerificationService, VerificationResult } from "@services/verification/MissionVerificationService";

interface VerificationScreenProps {
  mission: MissionDefinition;
  photoUri: string;
  onApproved: (result: VerificationResult) => void;
  onRetry: (result: VerificationResult) => void;
}

/**
 * "Companion examinesâ€¦" beat. Talks to MissionVerificationService
 * only through its interface â€” no technical AI language is ever
 * rendered here, per master protocol Â§AI VERIFICATION.
 */
export function VerificationScreen({ mission, photoUri, onApproved, onRetry }: VerificationScreenProps) {
  const [result, setResult] = useState<VerificationResult | null>(null);

  useEffect(() => {
    let cancelled = false;
    missionVerificationService
      .verify({ missionId: mission.id, submissionType: mission.submissionType, mediaUri: photoUri })
      .then((r) => {
        if (cancelled) return;
        setResult(r);
        if (r.outcome === "approved") {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } else {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        }
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <CompanionReaction mood={result ? (result.outcome === "approved" ? "celebrating" : "curious") : "curious"} size={140} />
        <Text style={styles.title}>{result ? result.companionLine : "Your Companion is looking closelyâ€¦"}</Text>
        {result && (
          <PrimaryButton
            label={result.outcome === "approved" ? "Continue" : "Try Again"}
            onPress={() => (result.outcome === "approved" ? onApproved(result) : onRetry(result))}
            style={styles.cta}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "transparent" },
  content: { flex: 1, alignItems: "center", justifyContent: "center", padding: spacing.xxl },
  title: { ...typography.title, color: colors.text.primary, textAlign: "center", marginVertical: spacing.xl },
  cta: { alignSelf: "stretch" },
});

