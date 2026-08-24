import React from "react";
import { View, StyleSheet, ImageStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, zIndex } from "@theme";
import { AssetImage } from "@components/AssetImage";
import { AssetId } from "@assets/registry";

export interface WorldSceneProps {
  backgroundAssetId: AssetId;
  children?: React.ReactNode;
}

/**
 * Base architecture every World (Grove, Missions, Tale Trails,
 * Treasure Hunt, The Beyond) renders through. A World supplies its
 * own background asset and content; it must NOT invent its own
 * layout system, color palette, or navigation chrome.
 */
export function WorldScene({ backgroundAssetId, children }: WorldSceneProps) {
  return (
    <View style={styles.root}>
      <AssetImage id={backgroundAssetId} style={styles.background as ImageStyle} />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background.primary },
  background: { ...StyleSheet.absoluteFillObject, zIndex: zIndex.world },
  content: { flex: 1, zIndex: zIndex.hud },
});

