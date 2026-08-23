import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, SafeAreaView, StyleSheet } from "react-native";
import * as Haptics from "expo-haptics";
import { colors, typography, spacing, radius } from "@theme";
import { StatusControl } from "@components/StatusControl";
import { ReturnToGrove } from "@components/ReturnToGrove";
import { CosmeticCategory, CosmeticItemDefinition } from "@apptypes";
import { closetCategories, closetCategoryLabels, itemsForCategory } from "../content/catalog";
import { ItemCard } from "../components/ItemCard";

interface ClosetHomeScreenProps {
  coins: number;
  adventureTickets: number;
  collectorTokens: number;
  isOwned: (itemId: string) => boolean;
  isEquipped: (item: CosmeticItemDefinition) => boolean;
  onSelectItem: (item: CosmeticItemDefinition) => void;
  onReturnToGrove: () => void;
}

/**
 * Store entry + categories, per Batch 07 spec. One primary action per
 * screen (browse → tap an item) — purchase itself happens on the
 * preview screen, never directly from this grid, so a stray tap can
 * never spend currency by accident.
 */
export function ClosetHomeScreen({
  coins,
  adventureTickets,
  collectorTokens,
  isOwned,
  isEquipped,
  onSelectItem,
  onReturnToGrove,
}: ClosetHomeScreenProps) {
  const [category, setCategory] = useState<CosmeticCategory>("outfits");

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Companion's Closet</Text>

        <View style={styles.balanceRow}>
          <StatusControl iconAssetId="ICON_CURRENCY_PRIMARY" value={coins} />
          <StatusControl iconAssetId="ICON_ADVENTURE_TICKET" value={adventureTickets} />
          <StatusControl iconAssetId="ICON_COLLECTOR_TOKEN" value={collectorTokens} />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsRow}>
          {closetCategories.map((c) => (
            <Pressable
              key={c}
              accessibilityRole="button"
              style={[styles.tab, category === c && styles.tabActive]}
              onPress={() => {
                Haptics.selectionAsync();
                setCategory(c);
              }}
            >
              <Text style={[styles.tabLabel, category === c && styles.tabLabelActive]}>
                {closetCategoryLabels[c]}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.grid}>
          {itemsForCategory(category).map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              owned={isOwned(item.id)}
              equipped={isEquipped(item)}
              onPress={() => onSelectItem(item)}
            />
          ))}
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
  balanceRow: { flexDirection: "row", gap: spacing.md, flexWrap: "wrap" },
  tabsRow: { flexGrow: 0 },
  tab: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.background.elevated,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  tabActive: { backgroundColor: colors.accent.primary, borderColor: colors.accent.primary },
  tabLabel: { ...typography.label, color: colors.text.secondary },
  tabLabelActive: { color: colors.text.inverse },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.md },
});
