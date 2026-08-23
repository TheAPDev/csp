import React from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { AssetImage } from "@components/AssetImage";
import { CompanionReaction } from "@components/CompanionReaction";
import { PrimaryButton } from "@components/PrimaryButton";
import { colors, typography, spacing, radius } from "@theme";
import { MissionDefinition } from "@apptypes";

interface RewardScreenProps {
  mission: MissionDefinition;
  onContinue: () => void;
}

/**
 * Rewards are shown as specific icon + amount rows rather than one
 * generic confetti burst for everything, per master protocol §REWARD.
 */
export function RewardScreen({ mission, onContinue }: RewardScreenProps) {
  const { reward } = mission;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <CompanionReaction mood="celebrating" size={150} />
        <Text style={styles.title}>Mission Complete!</Text>
        <Text style={styles.subtitle}>{mission.title}</Text>

        <View style={styles.rewardRow}>
          <AssetImage id="REWARD_XP_SPARKLE" style={styles.rewardIcon} />
          <Text style={styles.rewardText}>+{reward.xp} XP</Text>
        </View>
        <View style={styles.rewardRow}>
          <AssetImage id="REWARD_COIN" style={styles.rewardIcon} />
          <Text style={styles.rewardText}>+{reward.coins} Coins</Text>
        </View>
        {!!reward.adventureTickets && (
          <View style={styles.rewardRow}>
            <AssetImage id="REWARD_ADVENTURE_TICKET" style={styles.rewardIcon} />
            <Text style={styles.rewardText}>+{reward.adventureTickets} Adventure Ticket</Text>
          </View>
        )}
        {!!reward.collectorTokens && (
          <View style={styles.rewardRow}>
            <AssetImage id="REWARD_COLLECTOR_TOKEN" style={styles.rewardIcon} />
            <Text style={styles.rewardText}>+{reward.collectorTokens} Collector Token</Text>
          </View>
        )}

        <PrimaryButton label="Back to Missions" onPress={onContinue} style={styles.cta} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "transparent" },
  content: { flex: 1, alignItems: "center", justifyContent: "center", padding: spacing.xxl },
  title: { ...typography.display, color: colors.text.primary, marginTop: spacing.lg },
  subtitle: { ...typography.body, color: colors.text.secondary, marginBottom: spacing.xl },
  rewardRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: spacing.sm },
  rewardIcon: { width: 32, height: 32, borderRadius: radius.sm },
  rewardText: { ...typography.heading, color: colors.text.primary },
  cta: { alignSelf: "stretch", marginTop: spacing.xl },
});
