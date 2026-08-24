import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, typography, spacing } from "@theme";
import { AssetImage } from "@components/AssetImage";
import { ProgressBar } from "@components/ProgressBar";
import { PrimaryButton } from "@components/PrimaryButton";
import { SecondaryButton } from "@components/SecondaryButton";
import { VaultRewardDefinition } from "@apptypes";

interface VaultRewardDetailScreenProps {
  reward: VaultRewardDefinition;
  have: number;
  need: number;
  eligible: boolean;
  requested: boolean;
  onRedeem: () => void;
  onBack: () => void;
}

/**
 * Locked vs eligible, per Batch 07 spec. A locked reward shows plain
 * progress and no button that could be mistaken for a purchase â€” the
 * child is never one accidental tap away from spending Collector
 * Tokens they don't yet have.
 */
export function VaultRewardDetailScreen({
  reward,
  have,
  need,
  eligible,
  requested,
  onRedeem,
  onBack,
}: VaultRewardDetailScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <AssetImage id={reward.previewAssetId} style={styles.art} />
        <Text style={styles.name}>{reward.name}</Text>
        <Text style={styles.description}>{reward.description}</Text>

        <View style={styles.progressWrap}>
          <Text style={styles.fraction}>
            {Math.min(have, need)} / {need} Collector Tokens
          </Text>
          <ProgressBar progress={have / need} />
        </View>

        {requested ? (
          <Text style={styles.statusLine}>
            This one's already on its way to a grown-up to arrange.
          </Text>
        ) : eligible ? (
          <PrimaryButton label="Redeem this Reward" onPress={onRedeem} style={styles.cta} />
        ) : (
          <Text style={styles.statusLine}>Keep exploring to earn more Collector Tokens.</Text>
        )}

        <SecondaryButton label="Back to the Vault" onPress={onBack} style={styles.cta} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  content: { flex: 1, alignItems: "center", justifyContent: "center", padding: spacing.xxl, gap: spacing.md },
  art: { width: 160, height: 160, borderRadius: spacing.lg },
  name: { ...typography.title, color: colors.text.primary, textAlign: "center" },
  description: { ...typography.body, color: colors.text.secondary, textAlign: "center" },
  progressWrap: { alignSelf: "stretch", gap: spacing.xs },
  fraction: { ...typography.caption, color: colors.text.secondary, textAlign: "center" },
  statusLine: { ...typography.body, color: colors.text.secondary, textAlign: "center" },
  cta: { alignSelf: "stretch", marginTop: spacing.sm },
});

