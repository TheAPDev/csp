import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@theme";
import { WorldScene } from "@worlds/WorldScene";
import { Toast } from "@components/Toast";
import { BeyondRegionDefinition } from "@apptypes";
import { useBeyondStore } from "@state/beyondStore";
import { useProgressionStore } from "@state/progressionStore";
import { triggerCompanionMoment } from "@companion/companionMoments";
import { recordBeyondCompletion } from "@services/supabase/beyond";
import { addInventoryItem } from "@services/supabase/inventory";
import { BeyondHomeScreen } from "./screens/BeyondHomeScreen";
import { RegionExplorationScreen } from "./screens/RegionExplorationScreen";
import { RegionCompleteScreen } from "./screens/RegionCompleteScreen";

type Step =
  | { name: "home" }
  | { name: "exploring"; region: BeyondRegionDefinition }
  | { name: "complete"; region: BeyondRegionDefinition; firstTime: boolean };

interface BeyondFlowProps {
  onReturnToGrove: () => void;
}

/**
 * Orchestrates The Beyond: browse regions (available + beautifully
 * sealed side by side) â†’ explore (tap points of interest) â†’ complete
 * â†’ back to browse. Same single-owner-of-sequencing pattern as every
 * other World's Flow component (MissionsFlow, TaleTrailsFlow,
 * TreasureHuntFlow, ClosetFlow, VaultFlow).
 */
export function BeyondFlow({ onReturnToGrove }: BeyondFlowProps) {
  const [step, setStep] = useState<Step>({ name: "home" });
  const [tease, setTease] = useState(false);

  const recordCompletion = useBeyondStore((s) => s.recordCompletion);
  const priorCompletions = useBeyondStore((s) => s.completions);
  const addXp = useProgressionStore((s) => s.addXp);
  const addCoins = useProgressionStore((s) => s.addCoins);
  const addAdventureTickets = useProgressionStore((s) => s.addAdventureTickets);
  const addCollectorTokens = useProgressionStore((s) => s.addCollectorTokens);

  function handleAllDiscovered(region: BeyondRegionDefinition) {
    const alreadyCompletedBefore = priorCompletions.some((c) => c.regionId === region.id);
    const firstTime = !alreadyCompletedBefore;

    if (firstTime && region.reward) {
      const { reward } = region;
      addXp(reward.xp);
      addCoins(reward.coins);
      if (reward.adventureTickets) addAdventureTickets(reward.adventureTickets);
      if (reward.collectorTokens) addCollectorTokens(reward.collectorTokens);
      recordCompletion(region.id, reward);
      triggerCompanionMoment("beyond", {
        notification: { kind: "adventure", message: `${region.title} explored!` },
      });
      // Best-effort Supabase sync â€” never blocks the local reward flow.
      recordBeyondCompletion("local-guest", region.id, reward);
      if (region.unlockAssetId) addInventoryItem("local-guest", region.unlockAssetId);
    }

    setStep({ name: "complete", region, firstTime });
  }

  const usesWorldBackground = step.name !== "exploring";

  const content = (
    <>
      {step.name === "home" && (
        <BeyondHomeScreen
          onSelectRegion={(region) => setStep({ name: "exploring", region })}
          onSealedTease={() => setTease(true)}
          onReturnToGrove={onReturnToGrove}
        />
      )}

      {step.name === "exploring" && (
        <RegionExplorationScreen
          region={step.region}
          onAllDiscovered={() => handleAllDiscovered(step.region)}
          onLeave={() => setStep({ name: "home" })}
        />
      )}

      {step.name === "complete" && (
        <RegionCompleteScreen
          region={step.region}
          firstTime={step.firstTime}
          onContinue={() => setStep({ name: "home" })}
        />
      )}
    </>
  );

  return (
    <View style={styles.root}>
      {usesWorldBackground ? <WorldScene backgroundAssetId="THE_BEYOND_BACKGROUND">{content}</WorldScene> : content}
      <Toast
        message="This part of The Beyond is still forming â€” check back soon!"
        visible={tease}
        onHide={() => setTease(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background.primary },
});

