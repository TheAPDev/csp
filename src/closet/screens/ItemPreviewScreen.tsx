import React, { useState } from "react";
import { View, Text, SafeAreaView, StyleSheet } from "react-native";
import { colors, typography, spacing } from "@theme";
import { AssetImage } from "@components/AssetImage";
import { PrimaryButton } from "@components/PrimaryButton";
import { SecondaryButton } from "@components/SecondaryButton";
import { Toast } from "@components/Toast";
import { RewardCelebration } from "@components/RewardCelebration";
import { CosmeticItemDefinition } from "@apptypes";
import { PurchaseOutcome } from "@state/closetStore";

const CURRENCY_LABEL: Record<CosmeticItemDefinition["currency"], string> = {
  coins: "Coins",
  adventureTickets: "Adventure Tickets",
  collectorTokens: "Collector Tokens",
};

interface ItemPreviewScreenProps {
  item: CosmeticItemDefinition;
  owned: boolean;
  equipped: boolean;
  onPurchase: (item: CosmeticItemDefinition) => PurchaseOutcome;
  onEquip: (item: CosmeticItemDefinition) => void;
  onBack: () => void;
}

/**
 * Item preview + purchase + equip, per Batch 07 spec. One clear
 * primary action at a time: Buy (if unowned), then Equip (once
 * owned) — never both buttons offering the same weight at once.
 */
export function ItemPreviewScreen({ item, owned, equipped, onPurchase, onEquip, onBack }: ItemPreviewScreenProps) {
  const [celebrating, setCelebrating] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [justPurchased, setJustPurchased] = useState(owned);

  function handleBuy() {
    const outcome = onPurchase(item);
    if (outcome === "purchased") {
      setJustPurchased(true);
      setCelebrating(true);
    } else if (outcome === "insufficient_currency") {
      setToast(`Not enough ${CURRENCY_LABEL[item.currency]} yet — keep exploring!`);
    } else if (outcome === "already_owned") {
      setJustPurchased(true);
    }
  }

  function handleEquip() {
    onEquip(item);
    onBack();
  }

  const isOwnedNow = owned || justPurchased;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        {celebrating ? (
          <RewardCelebration
            visible={celebrating}
            variant="purchase"
            line={item.companionLine}
            onDone={() => setCelebrating(false)}
          />
        ) : (
          <>
            <AssetImage id={item.previewAssetId} style={styles.art} />
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.description}>{item.description}</Text>

            {equipped ? (
              <Text style={styles.equippedLabel}>Currently equipped</Text>
            ) : isOwnedNow ? (
              <PrimaryButton label="Equip" onPress={handleEquip} style={styles.cta} />
            ) : (
              <PrimaryButton
                label={`Get for ${item.price} ${CURRENCY_LABEL[item.currency]}`}
                onPress={handleBuy}
                style={styles.cta}
              />
            )}

            <SecondaryButton label="Back to Closet" onPress={onBack} style={styles.cta} />
          </>
        )}
      </View>
      <Toast message={toast ?? ""} visible={!!toast} onHide={() => setToast(null)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  content: { flex: 1, alignItems: "center", justifyContent: "center", padding: spacing.xxl, gap: spacing.md },
  art: { width: 160, height: 160, borderRadius: spacing.lg },
  name: { ...typography.title, color: colors.text.primary, textAlign: "center" },
  description: { ...typography.body, color: colors.text.secondary, textAlign: "center" },
  equippedLabel: { ...typography.label, color: colors.accent.secondary },
  cta: { alignSelf: "stretch", marginTop: spacing.sm },
});
