import React from "react";
import { View, Text, SafeAreaView, StyleSheet } from "react-native";
import { colors, typography, spacing } from "@theme";
import { PrimaryButton } from "@components/PrimaryButton";
import { RewardCelebration } from "@components/RewardCelebration";
import { VaultRewardDefinition } from "@apptypes";

interface ParentHandoffScreenProps {
  reward: VaultRewardDefinition;
  onDone: () => void;
}

/**
 * Redemption confirmation, per Batch 07 spec ("parent handoff
 * placeholder"). This is explicitly a placeholder: no payment or
 * shipping information is collected from the child anywhere here —
 * it just tells the child a grown-up will take it from here, and logs
 * the request (see `vaultStore.requestRedemption`) for a future
 * Parent Space batch to surface and fulfill.
 */
export function ParentHandoffScreen({ reward, onDone }: ParentHandoffScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <RewardCelebration
          visible
          variant="redemption"
          line={`${reward.name} is on its way! Ask a grown-up to check the request.`}
        />
        <Text style={styles.note}>
          No information is needed from you — a grown-up will see this request and take care
          of the rest.
        </Text>
        <PrimaryButton label="Back to the Vault" onPress={onDone} style={styles.cta} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  content: { flex: 1, alignItems: "center", justifyContent: "center", padding: spacing.xxl, gap: spacing.lg },
  note: { ...typography.body, color: colors.text.secondary, textAlign: "center" },
  cta: { alignSelf: "stretch" },
});
