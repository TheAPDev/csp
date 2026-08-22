import React from "react";
import { View, Pressable, Text, StyleSheet } from "react-native";
import * as Haptics from "expo-haptics";
import { colors, typography, spacing, radius, touchTarget, shadows } from "@theme";

export interface NavDestination {
  key: string;
  label: string;
  icon: React.ReactNode;
}

interface BottomNavProps {
  destinations: NavDestination[];
  activeKey: string;
  onSelect: (key: string) => void;
}

/**
 * Bottom navigation foundation. Radial/orbit navigation variants for
 * The Grove hub can be layered on top of this same `destinations`
 * contract in a later batch — do not create a parallel nav data shape.
 */
export function BottomNav({ destinations, activeKey, onSelect }: BottomNavProps) {
  return (
    <View style={[styles.wrap, shadows.lg]}>
      {destinations.map((d) => {
        const active = d.key === activeKey;
        return (
          <Pressable
            key={d.key}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            onPress={() => {
              Haptics.selectionAsync();
              onSelect(d.key);
            }}
            style={styles.item}
          >
            <View style={[styles.iconWrap, active && styles.iconWrapActive]}>{d.icon}</View>
            <Text style={[styles.label, active && styles.labelActive]}>{d.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    backgroundColor: colors.background.elevated,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.md,
    borderTopWidth: 1,
    borderColor: colors.border.subtle,
  },
  item: { flex: 1, alignItems: "center", justifyContent: "center", gap: spacing.xxs, minHeight: touchTarget.minimum },
  iconWrap: { width: 40, height: 40, borderRadius: radius.pill, alignItems: "center", justifyContent: "center" },
  iconWrapActive: { backgroundColor: colors.background.surface },
  label: { ...typography.caption, color: colors.text.secondary },
  labelActive: { color: colors.text.primary },
});
