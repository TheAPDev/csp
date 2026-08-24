import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { colors, typography, spacing, radius, touchTarget, shadows } from "@theme";
import { NavDestination } from "./BottomNav";
import { AssetImage } from "./AssetImage";
import { AssetId } from "@assets/registry";

export interface GatewayDestination extends NavDestination {
  /** Portal artwork â€” falls back to the themed placeholder like every other asset. */
  assetId: AssetId;
  /** One-line, plain-language description of where the portal leads. */
  hint: string;
}

interface WorldGatewayProps {
  destinations: GatewayDestination[];
  onEnter: (key: string) => void;
}

/**
 * Spatial world-switching navigation. Renders each reachable World as
 * an environmental gateway/portal placed around the edges of the
 * current scene â€” NOT a tab bar. This is the mechanism required by
 * the master protocol ("radial navigation / world paths / portals /
 * environmental gateways", "Do NOT create a generic tab bar for the
 * main magical worlds"). Consumes the same `NavDestination` shape
 * (via `GatewayDestination extends NavDestination`) that `BottomNav`
 * already established, per WONDERKIN_CONTINUITY Â§4 â€” no parallel nav
 * data contract.
 */
export function WorldGateway({ destinations, onEnter }: WorldGatewayProps) {
  return (
    <View style={styles.ring} pointerEvents="box-none">
      {destinations.map((d) => (
        <Pressable
          key={d.key}
          accessibilityRole="button"
          accessibilityLabel={`Go to ${d.label}`}
          style={({ pressed }) => [styles.gateway, shadows.glow, pressed && styles.pressed]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onEnter(d.key);
          }}
        >
          <View style={styles.portalRing}>
            <AssetImage id={d.assetId} style={styles.portalArt} />
          </View>
          <Text style={styles.label}>{d.label}</Text>
          <Text style={styles.hint} numberOfLines={1}>
            {d.hint}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const PORTAL_SIZE = 64;

const styles = StyleSheet.create({
  ring: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  gateway: {
    width: 92,
    alignItems: "center",
    minHeight: touchTarget.comfortable + 40,
  },
  pressed: { opacity: 0.8, transform: [{ scale: 0.96 }] },
  portalRing: {
    width: PORTAL_SIZE,
    height: PORTAL_SIZE,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: colors.border.default,
    backgroundColor: colors.background.surface,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  portalArt: { width: PORTAL_SIZE - 4, height: PORTAL_SIZE - 4, borderRadius: radius.pill },
  label: {
    ...typography.label,
    color: colors.text.primary,
    marginTop: spacing.xs,
    textAlign: "center",
  },
  hint: {
    ...typography.caption,
    color: colors.text.secondary,
    textAlign: "center",
  },
});

