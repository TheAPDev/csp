import React from "react";
import { View, StyleSheet } from "react-native";
import { AssetImage } from "./AssetImage";
import { CompanionLean, groveDecorForLean } from "@companion/evolution";
import { GroveEvolutionStage } from "@apptypes";
import { radius, opacity } from "@theme";

interface GroveDecorProps {
  lean: CompanionLean;
  stage: GroveEvolutionStage;
}

/**
 * A small, purely decorative pair of Grove ornaments reflecting the
 * Companion's current developmental lean (Ember/Tide/Whisper — see
 * `@companion/evolution`). Gated by evolution stage rather than
 * shown from the very first visit, so the Grove visibly earns new
 * detail as the child's journey progresses — "this is MY place"
 * (master protocol, Batch 08 "World Response"). No interaction
 * required, mirroring `GroveAmbient`'s pattern; never labels the
 * lean or explains why it's there.
 */
export function GroveDecor({ lean, stage }: GroveDecorProps) {
  if (stage < 1) return null;

  const [primary, secondary] = groveDecorForLean(lean);

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
      <AssetImage id={primary} style={[styles.decor, styles.decorLeft]} />
      {stage >= 2 && <AssetImage id={secondary} style={[styles.decor, styles.decorRight]} />}
    </View>
  );
}

const styles = StyleSheet.create({
  decor: {
    position: "absolute",
    width: 56,
    height: 56,
    borderRadius: radius.md,
    opacity: opacity.hover,
  },
  decorLeft: { left: 20, bottom: 220 },
  decorRight: { right: 20, bottom: 260 },
});
