import React, { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { WorldScene } from "@worlds/WorldScene";
import { worldRegistry, WorldId } from "@worlds/WorldRegistry";
import { typography, colors, spacing } from "@theme";
import {
  CompanionReaction,
  CompanionMood,
  Dialogue,
  StatusHub,
  GroveAmbient,
  WorldGateway,
  GatewayDestination,
  TodaysAdventureCard,
} from "@components/index";
import { useCompanionStore } from "@state/companionStore";
import { useProgressionStore } from "@state/progressionStore";
import { useGroveStore, evolutionStageForLevel, groveBackgroundForStage } from "@state/groveStore";

interface GroveWorldProps {
  /** Supplied by RootNavigator so tapping a gateway can drive the World-switch transition. */
  onNavigateToWorld?: (world: WorldId) => void;
}

const gateways: Omit<GatewayDestination, "icon">[] = [
  { key: "missions", label: worldRegistry.missions.displayName, assetId: "GATEWAY_MISSIONS", hint: "A quest awaits" },
  { key: "taleTrails", label: worldRegistry.taleTrails.displayName, assetId: "GATEWAY_TALE_TRAILS", hint: "Step into a story" },
  { key: "treasureHunt", label: worldRegistry.treasureHunt.displayName, assetId: "GATEWAY_TREASURE_HUNT", hint: "Hunt for treasure" },
  { key: "theBeyond", label: worldRegistry.theBeyond.displayName, assetId: "GATEWAY_THE_BEYOND", hint: "A distant path" },
  { key: "closet", label: worldRegistry.closet.displayName, assetId: "GATEWAY_CLOSET", hint: "Dress up your Companion" },
  { key: "vault", label: worldRegistry.vault.displayName, assetId: "GATEWAY_VAULT", hint: "Real rewards await" },
];

const REACTION_LINES: Record<CompanionMood, string> = {
  idle: "I'm so glad you're here.",
  happy: "That tickles! Thank you.",
  curious: "What should we explore today?",
  sleepy: "Mmm... just resting my eyes.",
  celebrating: "We did it together!",
};

/**
 * The Grove — the emotional home of WONDERKIN. Companion center
 * stage, a living (ambiently animated) environment, "Today's
 * Adventure" as the single obvious primary action, a single
 * unobtrusive status access point, and gateway-based world
 * navigation. Deliberately NOT a dashboard — see master protocol.
 */
export default function GroveWorld({ onNavigateToWorld }: GroveWorldProps) {
  const def = worldRegistry.grove;

  const companionName = useCompanionStore((s) => s.name);
  const mood = useCompanionStore((s) => s.mood);
  const setMood = useCompanionStore((s) => s.setMood);
  const nudgeTrait = useCompanionStore((s) => s.nudgeTrait);

  const xp = useProgressionStore((s) => s.xp);
  const level = useProgressionStore((s) => s.level);
  const coins = useProgressionStore((s) => s.coins);
  const adventureTickets = useProgressionStore((s) => s.adventureTickets);
  const collectorTokens = useProgressionStore((s) => s.collectorTokens);
  const unreadNotifications = useProgressionStore((s) => s.unreadNotificationCount());
  const markAllNotificationsRead = useProgressionStore((s) => s.markAllNotificationsRead);

  const recordVisit = useGroveStore((s) => s.recordVisit);

  const [showReaction, setShowReaction] = useState(false);

  useEffect(() => {
    recordVisit();
  }, []);

  // Environmental evolution: the background is a pure function of
  // progression level, so the Grove can never desync from progress.
  const evolutionStage = useMemo(() => evolutionStageForLevel(level), [level]);
  const backgroundAssetId = useMemo(() => groveBackgroundForStage(evolutionStage), [evolutionStage]);

  const displayName = companionName || "your Companion";

  function handleCompanionTap() {
    // A small, alive interaction: cycle an expressive mood, nudge the
    // bond trait quietly (never shown as a number), and show a short
    // line — all without leaving the Grove.
    const nextMood: CompanionMood = mood === "happy" ? "idle" : "happy";
    setMood(nextMood);
    nudgeTrait("bond", 0.01);
    setShowReaction(true);
    setTimeout(() => setShowReaction(false), 2600);
  }

  function handleBeginAdventure() {
    onNavigateToWorld?.("missions");
  }

  return (
    <WorldScene backgroundAssetId={backgroundAssetId}>
      <GroveAmbient intensity={evolutionStage === 2 ? 10 : evolutionStage === 1 ? 8 : 6} />

      <SafeAreaView style={styles.safeArea} pointerEvents="box-none">
        <View style={styles.topRow} pointerEvents="box-none">
          <Text style={styles.greeting}>The Grove</Text>
          <StatusHub
            level={level}
            xp={xp}
            coins={coins}
            adventureTickets={adventureTickets}
            collectorTokens={collectorTokens}
            unreadNotifications={unreadNotifications}
            onOpenNotifications={markAllNotificationsRead}
          />
        </View>

        <View style={styles.centerStage} pointerEvents="box-none">
          <CompanionReaction mood={mood} size={168} onPress={handleCompanionTap} />
          {companionName ? <Text style={styles.companionName}>{displayName}</Text> : null}
          {showReaction && <Dialogue speakerName={displayName} line={REACTION_LINES[mood]} />}
        </View>

        <TodaysAdventureCard
          title="The Whispering Path"
          subtitle="A short quest is ready whenever you are."
          onPress={handleBeginAdventure}
        />

        <View style={styles.gatewayWrap}>
          <WorldGateway
            destinations={gateways.map((g) => ({ ...g, icon: null }))}
            onEnter={(key) => onNavigateToWorld?.(key as WorldId)}
          />
        </View>
      </SafeAreaView>
    </WorldScene>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, justifyContent: "space-between" },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
  },
  greeting: { ...typography.title, color: colors.text.primary },
  centerStage: { alignItems: "center", justifyContent: "center", gap: spacing.sm },
  companionName: { ...typography.heading, color: colors.text.primary },
  gatewayWrap: { paddingBottom: spacing.xl, paddingTop: spacing.lg },
});
