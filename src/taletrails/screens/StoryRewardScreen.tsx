import React from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { RewardBadge } from "@components/RewardBadge";
import { PrimaryButton } from "@components/PrimaryButton";
import { CompanionReaction } from "@components/CompanionReaction";
import { colors, typography, spacing } from "@theme";
import { StoryEpisodeDefinition } from "@apptypes";

interface StoryRewardScreenProps {
  episode: StoryEpisodeDefinition;
  onContinue: () => void;
}

/**
 * Reuses `RewardBadge` — the same reward-rendering component Missions
 * uses — rather than a parallel reward UI, per the batch's "reuse
 * reward system" instruction.
 */
export function StoryRewardScreen({ episode, onContinue }: StoryRewardScreenProps) {
  const { reward } = episode;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <CompanionReaction mood="celebrating" size={140} />
        <Text style={styles.title}>Trail Complete!</Text>
        <Text style={styles.subtitle}>{episode.title}</Text>

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

        <PrimaryButton label="Back to Tale Trails" onPress={onContinue} style={styles.cta} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "transparent" },
  content: { flex: 1, alignItems: "center", justifyContent: "center", padding: spacing.xxl },
  title: { ...typography.display, color: colors.text.primary, marginTop: spacing.lg },
  subtitle: { ...typography.body, color: colors.text.secondary, marginBottom: spacing.xl },
  rewardRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, justifyContent: "center", marginBottom: spacing.xl },
  cta: { alignSelf: "stretch" },
});
