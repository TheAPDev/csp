import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@theme";
import { WorldScene } from "@worlds/WorldScene";
import { TreasureDefinition } from "@apptypes";
import { treasuresForBiome } from "./content/treasureDefinitions";
import { getCoarseBiome, TreasureBiome } from "@services/location/coarseLocation";
import { recordTreasureCollection } from "@services/supabase/treasureHunt";
import { useTreasureHuntStore } from "@state/treasureHuntStore";
import { useProgressionStore } from "@state/progressionStore";
import { triggerCompanionMoment } from "@companion/companionMoments";
import { HuntEntryScreen } from "./screens/HuntEntryScreen";
import { ExplorationScreen } from "./screens/ExplorationScreen";
import { CollectionScreen } from "./screens/CollectionScreen";
import { TreasureRewardScreen } from "./screens/TreasureRewardScreen";

type Step =
  | { name: "entry" }
  | { name: "exploring" }
  | { name: "collecting"; treasure: TreasureDefinition }
  | { name: "reward"; treasure: TreasureDefinition };

interface TreasureHuntFlowProps {
  onReturnToGrove: () => void;
}

/**
 * Orchestrates the full Treasure Hunt journey: entry â†’ camera
 * exploration â†’ discovery/interaction â†’ collection â†’ reward â†’ keep
 * exploring or return to Grove. Mirrors `MissionsFlow`'s single-
 * owner-of-sequencing pattern and `MissionsFlow.grantReward`'s reward-
 * granting shape (progression + trait nudge + notification +
 * best-effort Supabase log).
 */
export function TreasureHuntFlow({ onReturnToGrove }: TreasureHuntFlowProps) {
  const [step, setStep] = useState<Step>({ name: "entry" });
  const [biome, setBiome] = useState<TreasureBiome>("meadow");

  const recordCollection = useTreasureHuntStore((s) => s.recordCollection);
  const addXp = useProgressionStore((s) => s.addXp);
  const addCoins = useProgressionStore((s) => s.addCoins);
  const addAdventureTickets = useProgressionStore((s) => s.addAdventureTickets);
  const addCollectorTokens = useProgressionStore((s) => s.addCollectorTokens);

  useEffect(() => {
    // Coarse biome only, resolved once per visit and never surfaced â€”
    // see services/location/coarseLocation.ts. Falls back to "meadow"
    // immediately if this hasn't resolved yet, so entry never waits
    // on a permission prompt.
    getCoarseBiome().then(setBiome);
  }, []);

  function grantReward(treasure: TreasureDefinition) {
    const { reward } = treasure;
    addXp(reward.xp);
    addCoins(reward.coins);
    if (reward.adventureTickets) addAdventureTickets(reward.adventureTickets);
    if (reward.collectorTokens) addCollectorTokens(reward.collectorTokens);
    recordCollection(treasure.id, reward);
    triggerCompanionMoment("treasure", {
      traitLean: treasure.traitLean,
      notification: { kind: "reward", message: `Found ${treasure.name}!` },
    });
    // Best-effort Supabase sync â€” never blocks the local reward flow.
    recordTreasureCollection("local-guest", treasure.id, reward);
  }

  function handleDiscoverTap(treasure: TreasureDefinition) {
    grantReward(treasure);
    setStep({ name: "collecting", treasure });
  }

  const treasures = treasuresForBiome(biome);

  // Camera exploration is a dedicated, full-bleed functional screen
  // (like Missions' camera step) and intentionally skips the World
  // background; every other step renders through the same WorldScene
  // background every other World uses.
  const usesWorldBackground = step.name !== "exploring";

  const content = (
    <>
      {step.name === "entry" && (
        <HuntEntryScreen onStart={() => setStep({ name: "exploring" })} onReturnToGrove={onReturnToGrove} />
      )}

      {step.name === "exploring" && (
        <ExplorationScreen
          treasures={treasures}
          onDiscoverTap={handleDiscoverTap}
          onLeave={() => setStep({ name: "entry" })}
        />
      )}

      {step.name === "collecting" && (
        <CollectionScreen
          treasure={step.treasure}
          onContinue={() => setStep({ name: "reward", treasure: step.treasure })}
        />
      )}

      {step.name === "reward" && (
        <TreasureRewardScreen
          treasure={step.treasure}
          onKeepExploring={() => setStep({ name: "exploring" })}
          onReturnToGrove={onReturnToGrove}
        />
      )}
    </>
  );

  return (
    <View style={styles.root}>
      {usesWorldBackground ? (
        <WorldScene backgroundAssetId="TREASURE_HUNT_BACKGROUND">{content}</WorldScene>
      ) : (
        content
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background.primary },
});

