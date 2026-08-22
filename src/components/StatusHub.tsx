import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import * as Haptics from "expo-haptics";
import { colors, typography, spacing, radius, touchTarget, shadows } from "@theme";
import { IconButton } from "./IconButton";
import { Sheet } from "./Sheet";
import { StatusControl } from "./StatusControl";

interface StatusHubProps {
  level: number;
  xp: number;
  coins: number;
  adventureTickets: number;
  collectorTokens: number;
  unreadNotifications: number;
  onOpenNotifications?: () => void;
}

/**
 * The Grove's ONLY status surface. The Product Bible explicitly
 * replaces dashboard-style XP/Level/Coins rows with this: a single
 * small pill (level badge + a quiet unread dot) that expands into a
 * Sheet on tap. Nothing numeric sits on the Grove's main canvas.
 */
export function StatusHub({
  level,
  xp,
  coins,
  adventureTickets,
  collectorTokens,
  unreadNotifications,
  onOpenNotifications,
}: StatusHubProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <View style={styles.pillWrap}>
        <IconButton
          onPress={() => {
            Haptics.selectionAsync();
            setOpen(true);
          }}
          style={[styles.pill, shadows.md]}
        >
          <Text style={styles.levelText}>{level}</Text>
          {unreadNotifications > 0 && <View style={styles.dot} />}
        </IconButton>
      </View>

      <Sheet visible={open} onClose={() => setOpen(false)}>
        <Text style={styles.sheetTitle}>Your Journey</Text>
        <View style={styles.row}>
          <StatusControl iconAssetId="ICON_XP" value={`${xp} XP`} />
          <StatusControl iconAssetId="ICON_CURRENCY_PRIMARY" value={coins} />
        </View>
        <View style={styles.row}>
          <StatusControl iconAssetId="ICON_ADVENTURE_TICKET" value={adventureTickets} />
          <StatusControl iconAssetId="ICON_COLLECTOR_TOKEN" value={collectorTokens} />
        </View>
        {unreadNotifications > 0 && (
          <IconButton
            onPress={() => {
              setOpen(false);
              onOpenNotifications?.();
            }}
            style={styles.notificationRow}
          >
            <Text style={styles.notificationText}>
              {unreadNotifications} new {unreadNotifications === 1 ? "moment" : "moments"} to see
            </Text>
          </IconButton>
        )}
      </Sheet>
    </>
  );
}

const styles = StyleSheet.create({
  pillWrap: { position: "absolute" },
  pill: {
    width: touchTarget.comfortable,
    height: touchTarget.comfortable,
    backgroundColor: colors.background.elevated,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  levelText: { ...typography.label, color: colors.text.primary },
  dot: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 9,
    height: 9,
    borderRadius: radius.pill,
    backgroundColor: colors.accent.caution,
  },
  sheetTitle: { ...typography.title, color: colors.text.primary, marginBottom: spacing.lg },
  row: { flexDirection: "row", gap: spacing.md, marginBottom: spacing.md },
  notificationRow: {
    width: "100%",
    height: undefined,
    minHeight: touchTarget.minimum,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.sm,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  notificationText: { ...typography.body, color: colors.text.primary },
});
