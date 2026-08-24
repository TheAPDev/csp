import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useOnboardingStore, OnboardingStep } from "@state/onboardingStore";
import { LoadingIndicator } from "@components/LoadingIndicator";
import { IconButton } from "@components/IconButton";
import { colors, typography, spacing, zIndex } from "@theme";
import { AccountEntryScreen } from "./screens/AccountEntryScreen";
import { BeginScreen } from "./screens/BeginScreen";
import { IntroStoryScreen } from "./screens/IntroStoryScreen";
import { EggSelectionScreen } from "./screens/EggSelectionScreen";
import { HatchingScreen } from "./screens/HatchingScreen";
import { CompanionRevealScreen } from "./screens/CompanionRevealScreen";
import { NamingScreen } from "./screens/NamingScreen";
import { FirstPromiseScreen } from "./screens/FirstPromiseScreen";

interface OnboardingFlowProps {
  /** Called once the child completes the First Promise step. */
  onFinished: () => void;
}

/**
 * Orchestrates the first-time child journey as a single-screen state
 * machine (mirrors RootNavigator's World-switch pattern). Each step
 * owns its own screen component; this file only owns sequencing and
 * the shared back affordance.
 */
export function OnboardingFlow({ onFinished }: OnboardingFlowProps) {
  const step = useOnboardingStore((s) => s.step);
  const hasHydrated = useOnboardingStore((s) => s.hasHydrated);
  const goBack = useOnboardingStore((s) => s.goBack);
  const canGoBack = useOnboardingStore((s) => s.canGoBack());

  useEffect(() => {
    if (step === "complete") onFinished();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  if (!hasHydrated) return <LoadingIndicator />;

  return (
    <View style={styles.root}>
      {renderStep(step)}
      {canGoBack && (
        <IconButton onPress={goBack} style={styles.back}>
          <Text style={styles.backLabel}>â†</Text>
        </IconButton>
      )}
    </View>
  );
}

function renderStep(step: OnboardingStep) {
  switch (step) {
    case "account":
      return <AccountEntryScreen />;
    case "begin":
      return <BeginScreen />;
    case "introStory":
      return <IntroStoryScreen />;
    case "eggSelection":
      return <EggSelectionScreen />;
    case "hatching":
      return <HatchingScreen />;
    case "companionReveal":
      return <CompanionRevealScreen />;
    case "naming":
      return <NamingScreen />;
    case "firstPromise":
      return <FirstPromiseScreen />;
    case "complete":
      return null;
    default:
      return null;
  }
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background.primary },
  back: { position: "absolute", top: spacing.xl, left: spacing.lg, zIndex: zIndex.hud },
  backLabel: { ...typography.heading, color: colors.text.primary },
});

