import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { RootNavigator } from "@navigation/RootNavigator";
import { OnboardingFlow } from "@onboarding/OnboardingFlow";
import { useOnboardingStore } from "@state/onboardingStore";
import { WorldTransition } from "@components/index";
import { LoadingIndicator } from "@components/LoadingIndicator";
import { colors } from "@theme";

type Phase = "onboarding" | "grove";

/**
 * Entry route. Gates between the first-time child journey
 * (`OnboardingFlow`, Batch 02) and the main World navigator, using
 * the same `WorldTransition` overlay RootNavigator uses between
 * Worlds — the hand-off into The Grove is the shared cinematic
 * transition system, not a plain screen swap.
 */
export default function Index() {
  const hasHydrated = useOnboardingStore((s) => s.hasHydrated);
  const completed = useOnboardingStore((s) => s.completed);
  const forceOnboarding = process.env.EXPO_PUBLIC_FORCE_ONBOARDING === "1" || __DEV__;

  const [initialized, setInitialized] = useState(false);
  const [phase, setPhase] = useState<Phase>("onboarding");
  const [transitioning, setTransitioning] = useState(false);

  // Decide the starting phase once, after the persisted onboarding
  // state has actually loaded — never guess ahead of hydration.
  useEffect(() => {
    if (hasHydrated && !initialized) {
      if (forceOnboarding) {
        useOnboardingStore.getState().restart();
        setPhase("onboarding");
      } else {
        setPhase(completed ? "grove" : "onboarding");
      }
      setInitialized(true);
    }
  }, [hasHydrated, initialized, completed, forceOnboarding]);

  if (!hasHydrated || !initialized) {
    return <LoadingIndicator />;
  }

  function handleOnboardingFinished() {
    setTransitioning(true);
    setTimeout(() => setPhase("grove"), 150);
  }

  return (
    <View style={styles.flex}>
      {phase === "onboarding" && <OnboardingFlow onFinished={handleOnboardingFinished} />}
      {phase === "grove" && <RootNavigator />}
      <WorldTransition active={transitioning} onComplete={() => setTransitioning(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background.primary },
});
