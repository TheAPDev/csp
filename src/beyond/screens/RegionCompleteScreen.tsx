import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RewardBadge } from "@components/RewardBadge";
import { PrimaryButton } from "@components/PrimaryButton";
import { CompanionReaction } from "@components/CompanionReaction";
import { colors, typography, spacing } from "@theme";
import { BeyondRegionDefinition } from "@apptypes";

interface RegionCompleteScreenProps {
  region: BeyondRegionDefinition;
  /** False on a revisit after the region was already completed once before â€” no re-granted reward, still worth celebrating quietly. */
  firstTime: boolean;
  onContinue: () => void;
}

/**
 * Reuses `RewardBadge` â€” the exact component Missions/Tale Trails
 * use â€” per the batch's "reuse reward system" instruction, rather
 * than a parallel Beyond-specific reward UI.
 */
export function RegionCompleteScreen({ region, firstTime, onContinue }: RegionCompleteScreenProps) {
  const reward = region.reward;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <CompanionReaction mood="celebrating" size={140} />
        <Text style={styles.title}>{region.title}, Explored</Text>
        <Text style={styles.subtitle}>
          {firstTime ? "Your Companion won't forget this place." : "It's just as wondrous the second time."}
        </Text>

        {firstTime && reward && (
          <View style={styles.rewardRow}>
            <RewardBadge assetId="REWARD_XP_SPARKLE" label={`+${reward.xp} XP`} />
            <RewardBadge assetId="REWARD_COIN" label={`+${reward.coins} Coins`} />
            {!!reward.adventureTickets && (
              <RewardBadge assetId="REWARD_ADVENTURE_TICKET" label={`+${reward.adventureTickets} Ticket`} />
            )}
            {!!reward.collectorTokens && (
              <RewardBadge assetId="REWARD_COLLECTOR_TOKEN" label={`+${reward.collectorTokens} Token`} />
            )}
          </View>
        )}

        <PrimaryButton label="Back to The Beyond" onPress={onContinue} style={styles.cta} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "transparent" },
  content: { flex: 1, alignItems: "center", justifyContent: "center", padding: spacing.xxl },
  title: { ...typography.display, color: colors.text.primary, textAlign: "center", marginTop: spacing.lg },
  subtitle: { ...typography.body, color: colors.text.secondary, textAlign: "center", marginBottom: spacing.xl },
  rewardRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, justifyContent: "center", marginBottom: spacing.xl },
  cta: { alignSelf: "stretch" },
});

