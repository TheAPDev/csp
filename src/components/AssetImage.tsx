import React from "react";
import { Image, View, StyleSheet, ImageStyle, StyleProp } from "react-native";
import { colors, radius } from "@theme";
import { AssetId, getAsset } from "@assets/registry";

interface AssetImageProps {
  id: AssetId;
  style?: StyleProp<ImageStyle>;
}

/**
 * Renders a registered asset by semantic ID. Falls back to a themed
 * placeholder block when no real asset has been supplied yet, so the
 * app never crashes on missing art during early batches.
 */
export function AssetImage({ id, style }: AssetImageProps) {
  const entry = getAsset(id);
  if (entry.source) {
    return <Image source={entry.source} style={style} resizeMode="cover" />;
  }
  return <View style={[styles.placeholder, style as any]} />;
}

const styles = StyleSheet.create({
  placeholder: {
    backgroundColor: colors.background.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
});
