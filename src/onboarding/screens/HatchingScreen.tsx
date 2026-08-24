import React, { useEffect, useState } from "react";
import { Pressable, Text, View, StyleSheet, ImageStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { AssetImage } from "@components/AssetImage";
import { ParticleField } from "@story/index";
import { colors, typography, spacing, radius } from "@theme";
import { useOnboardingStore } from "@state/onboardingStore";
import { useCompanionStore } from "@state/companionStore";
import { eggDefinitions } from "../content/eggs";
import { CompanionTraits } from "@apptypes";

/**
 * A short, one-way cinematic beat (see NO_BACK_STEPS in onboardingStore
 * â€” hatching cannot be replayed). Auto-advances, but a tap also
 * advances immediately so an interrupted/slow animation never
 * soft-locks the child.
 */
export function HatchingScreen() {
  const selectedEgg = useOnboardingStore((s) => s.selectedEgg);
  const advance = useOnboardingStore((s) => s.advance);
  const nudgeTrait = useCompanionStore((s) => s.nudgeTrait);
  const [burst, setBurst] = useState(false);
  const [done, setDone] = useState(false);
  const [appliedTraits, setAppliedTraits] = useState(false);

  const egg = eggDefinitions.find((e) => e.id === selectedEgg) ?? eggDefinitions[0];

  useEffect(() => {
    if (!appliedTraits) {
      // Apply the egg's subtle internal trait lean once, on hatch â€” never shown to the child.
      (Object.entries(egg.traitLean) as [keyof CompanionTraits, number][]).forEach(([trait, amount]) => {
        nudgeTrait(trait, amount);
      });
      setAppliedTraits(true);
    }
    const burstTimer = setTimeout(() => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setBurst(true);
    }, 700);
    const doneTimer = setTimeout(() => setDone(true), 1800);
    return () => {
      clearTimeout(burstTimer);
      clearTimeout(doneTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleContinue() {
    advance();
  }

  return (
    <Pressable
      style={styles.root}
      onPress={handleContinue}
      accessibilityRole="button"
      accessibilityLabel="Continue"
    >
      <View style={styles.center}>
        <AssetImage id={egg.assetId} style={styles.egg as ImageStyle} />
        <ParticleField active={burst} count={14} />
      </View>
      <Text style={styles.hint}>{done ? "Tap to continue" : "Something is happeningâ€¦"}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background.primary, alignItems: "center", justifyContent: "center" },
  center: { alignItems: "center", justifyContent: "center" },
  egg: { width: 120, height: 160, borderRadius: radius.lg },
  hint: { ...typography.caption, color: colors.text.secondary, position: "absolute", bottom: spacing.xxl },
});

