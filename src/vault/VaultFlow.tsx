import React, { useState } from "react";
import { WorldScene } from "@worlds/WorldScene";
import { worldRegistry } from "@worlds/WorldRegistry";
import { VaultRewardDefinition } from "@apptypes";
import { useProgressionStore } from "@state/progressionStore";
import { useVaultStore } from "@state/vaultStore";
import { triggerCompanionMoment } from "@companion/companionMoments";
import { VaultHomeScreen } from "./screens/VaultHomeScreen";
import { VaultRewardDetailScreen } from "./screens/VaultRewardDetailScreen";
import { ParentHandoffScreen } from "./screens/ParentHandoffScreen";

type Step =
  | { name: "home" }
  | { name: "detail"; reward: VaultRewardDefinition }
  | { name: "handoff"; reward: VaultRewardDefinition };

interface VaultFlowProps {
  onReturnToGrove: () => void;
}

/**
 * Orchestrates The Vault: browse → detail (locked/eligible) →
 * redeem → parent hand-off placeholder → back to browse. Mirrors
 * `MissionsFlow`/`ClosetFlow`'s single-owner-of-sequencing pattern.
 */
export function VaultFlow({ onReturnToGrove }: VaultFlowProps) {
  const [step, setStep] = useState<Step>({ name: "home" });

  const collectorTokens = useProgressionStore((s) => s.collectorTokens);
  const progressFor = useVaultStore((s) => s.progressFor);
  const hasActiveRequest = useVaultStore((s) => s.hasActiveRequest);
  const requestRedemption = useVaultStore((s) => s.requestRedemption);

  function handleSelectReward(reward: VaultRewardDefinition) {
    const { eligible } = progressFor(reward);
    // A quiet "still dreaming about it" beat for a reward that's not
    // eligible yet — never a nag, never a countdown, just the
    // Companion musing alongside the child while they look.
    if (!eligible) triggerCompanionMoment("vaultProgress");
    setStep({ name: "detail", reward });
  }

  function handleRedeem(reward: VaultRewardDefinition) {
    const outcome = requestRedemption(reward);
    if (outcome === "requested") {
      setStep({ name: "handoff", reward });
    }
    // "already_requested" / "insufficient_currency" are prevented by the
    // detail screen only showing the Redeem button when eligible and
    // not already requested — this is the safety net, not the primary gate.
  }

  return (
    <WorldScene backgroundAssetId={worldRegistry.vault.backgroundAssetId}>
      {step.name === "home" && (
        <VaultHomeScreen
          collectorTokens={collectorTokens}
          progressFor={progressFor}
          hasActiveRequest={hasActiveRequest}
          onSelectReward={(reward) => handleSelectReward(reward)}
          onReturnToGrove={onReturnToGrove}
        />
      )}

      {step.name === "detail" && (
        <VaultRewardDetailScreen
          reward={step.reward}
          {...progressFor(step.reward)}
          requested={hasActiveRequest(step.reward.id)}
          onRedeem={() => handleRedeem(step.reward)}
          onBack={() => setStep({ name: "home" })}
        />
      )}

      {step.name === "handoff" && (
        <ParentHandoffScreen reward={step.reward} onDone={() => setStep({ name: "home" })} />
      )}
    </WorldScene>
  );
}
