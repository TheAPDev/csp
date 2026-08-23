import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import * as Haptics from "expo-haptics";
import { colors, typography, spacing, radius, shadows } from "@theme";
import { AssetImage } from "@components/AssetImage";
import { CosmeticItemDefinition } from "@apptypes";

const CURRENCY_LABEL: Record<CosmeticItemDefinition["currency"], string> = {
  coins: "Coins",
  adventureTickets: "Adventure Tickets",
  collectorTokens: "Collector Tokens",
};

interface ItemCardProps {
  item: CosmeticItemDefinition;
  owned: boolean;
  equipped: boolean;
  onPress: () => void;
}

/** One catalog tile — status badge (owned/equipped) replaces price once purchased. */
export function ItemCard({ item, owned, equipped, onPress }: ItemCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={item.name}
      style={({ pressed }) => [styles.card, shadows.sm, pressed && styles.pressed]}
      onPress={() => {
        Haptics.selectionAsync();
        onPress();
      }}
    >
      <AssetImage id={item.previewAssetId} style={styles.art} />
      <Text style={styles.name} numberOfLines={1}>
        {item.name}
      </Text>
      {equipped ? (
        <Text style={styles.equippedTag}>Equipped</Text>
      ) : owned ? (
        <Text style={styles.ownedTag}>In your Closet</Text>
      ) : (
        <Text style={styles.price}>
          {item.price} {CURRENCY_LABEL[item.currency]}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 140,
    backgroundColor: colors.background.elevated,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    padding: spacing.sm,
    alignItems: "center",
    gap: spacing.xs,
  },
  pressed: { opacity: 0.85 },
  art: { width: 88, height: 88, borderRadius: radius.md },
  name: { ...typography.label, color: colors.text.primary, textAlign: "center" },
  price: { ...typography.caption, color: colors.text.secondary },
  ownedTag: { ...typography.caption, color: colors.accent.positive },
  equippedTag: { ...typography.caption, color: colors.accent.secondary },
});
