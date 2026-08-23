import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import * as Haptics from "expo-haptics";
import { colors, typography, spacing } from "@theme";
import { ParticleField, ParticleTone } from "@story/index";
import { CompanionReaction, CompanionMood } from "./CompanionReaction";

export type CelebrationVariant = "purchase" | "vaultProgress" | "redemption";

const VARIANT_CONFIG: Record<
  CelebrationVariant,
  { tone: ParticleTone; count: number; mood: CompanionMood; haptic: Haptics.ImpactFeedbackStyle }
> = {
  // Frequent Coin/cosmetic buys — light, quick, low-ceremony.
  purchase: { tone: "secondary", count: 8, mood: "happy", haptic: Haptics.ImpactFeedbackStyle.Light },
  // Reaching a Vault milestone — bigger, warmer, more ceremony (rare currency, prestige feel).
  vaultProgress: { tone: "caution", count: 16, mood: "curious", haptic: Haptics.ImpactFeedbackStyle.Medium },
  // A completed physical-reward redemption request — the biggest moment in the economy.
  redemption: { tone: "positive", count: 22, mood: "celebrating", haptic: Haptics.ImpactFeedbackStyle.Heavy },
};

interface RewardCelebrationProps {
  visible: boolean;
  variant: CelebrationVariant;
  /** Short child-facing line — varies per specific reward, not one generic phrase. */
  line: string;
  onDone?: () => void;
}

/**
 * The economy's single celebration surface, per master protocol
 * REWARD ANIMATION rule ("do not use the same celebration for every
 * reward"). Reuses `ParticleField` (extended in Batch 07 with a
 * `tone` prop) and `CompanionReaction` rather than inventing a new
 * animation system — only the tone, particle count, Companion mood,
 * and haptic weight vary per variant.
 */
export function RewardCelebration({ visible, variant, line, onDone }: RewardCelebrationProps) {
  const [active, setActive] = useState(false);
  const config = VARIANT_CONFIG[variant];

  useEffect(() => {
    if (visible) {
      setActive(true);
      Haptics.impactAsync(config.haptic);
      const timer = setTimeout(() => {
        setActive(false);
        onDone?.();
      }, 1400);
      return () => clearTimeout(timer);
    }
  }, [visible, variant]);

  if (!visible) return null;

  return (
    <View style={styles.wrap} pointerEvents="none">
      <View style={styles.center}>
        <ParticleField active={active} count={config.count} tone={config.tone} />
        <CompanionReaction mood={config.mood} size={96} />
      </View>
      <Text style={styles.line}>{line}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", justifyContent: "center", gap: spacing.sm },
  center: { alignItems: "center", justifyContent: "center" },
  line: { ...typography.body, color: colors.text.primary, textAlign: "center", paddingHorizontal: spacing.xl },
});
