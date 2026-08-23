import React from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { AssetImage } from "@components/AssetImage";
import { PrimaryButton } from "@components/PrimaryButton";
import { SecondaryButton } from "@components/SecondaryButton";
import { colors, typography, spacing, radius } from "@theme";
import { TreasureDefinition } from "@apptypes";

interface TreasureRewardScreenProps {
  treasure: TreasureDefinition;
  onKeepExploring: () => void;
  onReturnToGrove: () => void;
}

/**
 * Mirrors `missions/screens/RewardScreen.tsx`'s icon + amount row
 * pattern exactly (same layout, same reward icons) rather than
 * inventing a Treasure-Hunt-specific reward language. Two ways
 * forward, both a single clear action — keep exploring, or head home
 * — never a dead end.
 */
export function TreasureRewardScreen({ treasure, onKeepExploring, onReturnToGrove }: TreasureRewardScreenProps) {
  const { reward } = treasure;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <AssetImage id={treasure.iconAssetId} style={styles.treasureArt} />
        <Text style={styles.title}>You found it!</Text>
        <Text style={styles.subtitle}>{treasure.name}</Text>

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

        <PrimaryButton label="Keep Exploring" onPress={onKeepExploring} style={styles.cta} />
        <SecondaryButton label="Return to the Grove" onPress={onReturnToGrove} style={styles.cta} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "transparent" },
  content: { flex: 1, alignItems: "center", justifyContent: "center", padding: spacing.xxl },
  treasureArt: { width: 72, height: 72, borderRadius: radius.md },
  title: { ...typography.display, color: colors.text.primary, marginTop: spacing.lg },
  subtitle: { ...typography.body, color: colors.text.secondary, marginBottom: spacing.xl },
  rewardRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: spacing.sm },
  rewardIcon: { width: 32, height: 32, borderRadius: radius.sm },
  rewardText: { ...typography.heading, color: colors.text.primary },
  cta: { alignSelf: "stretch", marginTop: spacing.md },
});
