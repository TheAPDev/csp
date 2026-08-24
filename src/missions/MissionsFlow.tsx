import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { colors } from "@theme";
import { WorldScene } from "@worlds/WorldScene";
import { MissionDefinition } from "@apptypes";
import { VerificationResult } from "@services/verification/MissionVerificationService";
import { logMissionSubmission, recordMissionCompletion } from "@services/supabase/missions";
import { useMissionsStore } from "@state/missionsStore";
import { useProgressionStore } from "@state/progressionStore";
import { triggerCompanionMoment } from "@companion/companionMoments";
import { MissionsHomeScreen } from "./screens/MissionsHomeScreen";
import { MissionDetailScreen } from "./screens/MissionDetailScreen";
import { CameraCaptureScreen } from "./screens/CameraCaptureScreen";
import { PhotoPreviewScreen } from "./screens/PhotoPreviewScreen";
import { VerificationScreen } from "./screens/VerificationScreen";
import { RewardScreen } from "./screens/RewardScreen";
import { CompletionHistorySheet } from "./screens/CompletionHistorySheet";

type Step =
  | { name: "home" }
  | { name: "detail"; mission: MissionDefinition }
  | { name: "camera"; mission: MissionDefinition }
  | { name: "preview"; mission: MissionDefinition; photoUri: string }
  | { name: "verifying"; mission: MissionDefinition; photoUri: string }
  | { name: "reward"; mission: MissionDefinition };

interface MissionsFlowProps {
  onReturnToGrove: () => void;
}

/**
 * Orchestrates the full Missions journey: entry → detail → (photo)
 * camera → preview → verification → reward → back to entry. Mirrors
 * OnboardingFlow's single-owner-of-sequencing pattern. Session state
 * only — an in-progress submission doesn't need to survive an app
 * kill the way onboarding's identity-forming choices do.
 */
export function MissionsFlow({ onReturnToGrove }: MissionsFlowProps) {
  const [step, setStep] = useState<Step>({ name: "home" });
  const [historyOpen, setHistoryOpen] = useState(false);

  const setMissionStatus = useMissionsStore((s) => s.setStatus);
  const recordCompletion = useMissionsStore((s) => s.recordCompletion);
  const addXp = useProgressionStore((s) => s.addXp);
  const addCoins = useProgressionStore((s) => s.addCoins);
  const addAdventureTickets = useProgressionStore((s) => s.addAdventureTickets);
  const addCollectorTokens = useProgressionStore((s) => s.addCollectorTokens);

  function grantReward(mission: MissionDefinition) {
    const { reward } = mission;
    addXp(reward.xp);
    addCoins(reward.coins);
    if (reward.adventureTickets) addAdventureTickets(reward.adventureTickets);
    if (reward.collectorTokens) addCollectorTokens(reward.collectorTokens);
    recordCompletion(mission.id, reward);
    triggerCompanionMoment("quest", {
      traitLean: mission.traitLean,
      notification: { kind: "reward", message: `${mission.title} complete!` },
    });
    // Best-effort Supabase sync — never blocks the local reward flow.
    recordMissionCompletion("local-guest", mission.id, reward);
  }

  function handleVerificationResult(mission: MissionDefinition, photoUri: string, result: VerificationResult) {
    logMissionSubmission(
      "local-guest",
      mission.id,
      mission.submissionType,
      result.outcome === "approved" ? "approved" : "retry",
      result.companionLine
    );
    if (result.outcome === "approved") {
      grantReward(mission);
      setStep({ name: "reward", mission });
    } else {
      setStep({ name: "camera", mission });
    }
  }

  // Camera + preview are dedicated, full-bleed functional screens (like
  // any OS-level capture flow) and intentionally skip the World
  // background; every other step renders through the same WorldScene
  // background every other World uses, so Missions still visibly
  // belongs to WONDERKIN rather than looking like a bolted-on feature.
  const usesWorldBackground = step.name !== "camera" && step.name !== "preview";

  const content = (
    <>
      {step.name === "home" && (
        <MissionsHomeScreen
          onSelectMission={(mission) => {
            setMissionStatus(mission.id, "in_progress");
            setStep({ name: "detail", mission });
          }}
          onOpenHistory={() => setHistoryOpen(true)}
          onReturnToGrove={onReturnToGrove}
        />
      )}

      {step.name === "detail" && (
        <MissionDetailScreen
          mission={step.mission}
          onStart={() => setStep({ name: "camera", mission: step.mission })}
          onBack={() => setStep({ name: "home" })}
        />
      )}

      {step.name === "camera" && (
        <CameraCaptureScreen
          onCaptured={(uri) => setStep({ name: "preview", mission: step.mission, photoUri: uri })}
          onCancel={() => setStep({ name: "home" })}
        />
      )}

      {step.name === "preview" && (
        <PhotoPreviewScreen
          photoUri={step.photoUri}
          onRetake={() => setStep({ name: "camera", mission: step.mission })}
          onUploaded={() => setStep({ name: "verifying", mission: step.mission, photoUri: step.photoUri })}
          onCancel={() => setStep({ name: "home" })}
        />
      )}

      {step.name === "verifying" && (
        <VerificationScreen
          mission={step.mission}
          photoUri={step.photoUri}
          onApproved={(result) => handleVerificationResult(step.mission, step.photoUri, result)}
          onRetry={(result) => handleVerificationResult(step.mission, step.photoUri, result)}
        />
      )}

      {step.name === "reward" && (
        <RewardScreen mission={step.mission} onContinue={() => setStep({ name: "home" })} />
      )}
    </>
  );

  return (
    <View style={styles.root}>
      {usesWorldBackground ? <WorldScene backgroundAssetId="MISSIONS_BACKGROUND">{content}</WorldScene> : content}
      <CompletionHistorySheet visible={historyOpen} onClose={() => setHistoryOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background.primary },
});
