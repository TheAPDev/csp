import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, typography, spacing } from "@theme";
import { StatusControl } from "@components/StatusControl";
import { ReturnToGrove } from "@components/ReturnToGrove";
import { VaultRewardDefinition } from "@apptypes";
import { vaultCatalog } from "../content/vaultCatalog";
import { VaultRewardCard } from "../components/VaultRewardCard";

interface VaultHomeScreenProps {
  collectorTokens: number;
  progressFor: (reward: VaultRewardDefinition) => { have: number; need: number; eligible: boolean };
  hasActiveRequest: (rewardId: string) => boolean;
  onSelectReward: (reward: VaultRewardDefinition) => void;
  onReturnToGrove: () => void;
}

/** The physical reward progression catalog, per Batch 07 spec. */
export function VaultHomeScreen({
  collectorTokens,
  progressFor,
  hasActiveRequest,
  onSelectReward,
  onReturnToGrove,
}: VaultHomeScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>The Vault</Text>
        <Text style={styles.subtitle}>Real rewards, earned with your rarest treasures.</Text>

        <View style={styles.balanceRow}>
          <StatusControl iconAssetId="ICON_COLLECTOR_TOKEN" value={collectorTokens} />
        </View>

        <View style={styles.list}>
          {vaultCatalog.map((reward) => {
            const { have, need, eligible } = progressFor(reward);
            return (
              <VaultRewardCard
                key={reward.id}
                reward={reward}
                have={have}
                need={need}
                eligible={eligible}
                requested={hasActiveRequest(reward.id)}
                onPress={() => onSelectReward(reward)}
              />
            );
          })}
        </View>

        <ReturnToGrove onPress={onReturnToGrove} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scrollContent: { padding: spacing.xl, gap: spacing.lg, paddingBottom: spacing.xxl },
  title: { ...typography.display, color: colors.text.primary },
  subtitle: { ...typography.body, color: colors.text.secondary },
  balanceRow: { flexDirection: "row", gap: spacing.md },
  list: { gap: spacing.md },
});

