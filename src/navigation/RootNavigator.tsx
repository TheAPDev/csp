import React, { useRef, useState } from "react";
import { View, StyleSheet } from "react-native";
import { WorldTransition } from "@components/index";
import { WorldId } from "@worlds/WorldRegistry";
import { transitionVariantFor } from "@navigation/transitionVariant";
import { duration } from "@theme";
import GroveWorld from "@worlds/worlds/Grove";
import MissionsWorld from "@worlds/worlds/Missions";
import TaleTrailsWorld from "@worlds/worlds/TaleTrails";
import TreasureHuntWorld from "@worlds/worlds/TreasureHunt";
import TheBeyondWorld from "@worlds/worlds/TheBeyond";
import ClosetWorld from "@worlds/worlds/Closet";
import VaultWorld from "@worlds/worlds/Vault";

const worldComponents: Record<WorldId, React.ComponentType<{ onNavigateToWorld?: (w: WorldId) => void }>> = {
  grove: GroveWorld,
  missions: MissionsWorld,
  taleTrails: TaleTrailsWorld,
  treasureHunt: TreasureHuntWorld,
  theBeyond: TheBeyondWorld,
  closet: ClosetWorld,
  vault: VaultWorld,
};

/**
 * Root navigation shell. Batch 03 replaces the generic tab-bar
 * world-switcher with gateway-based spatial navigation: the Grove
 * renders `WorldGateway` portals, and every other World renders a
 * `ReturnToGrove` affordance — both call back into this component's
 * `navigateToWorld`, which picks a cinematic transition variant per
 * route (see `transitionVariant.ts`) instead of one arbitrary slide
 * for every swap. World components stay registered the same way as
 * Batch 01 — a future World only needs registering, not new nav
 * plumbing.
 */
export function RootNavigator() {
  const [active, setActive] = useState<WorldId>("grove");
  const [transitioning, setTransitioning] = useState(false);
  const [variant, setVariant] = useState<ReturnType<typeof transitionVariantFor>>("fade");
  const pendingWorld = useRef<WorldId | null>(null);

  const ActiveWorld = worldComponents[active];

  function navigateToWorld(target: WorldId) {
    if (target === active || transitioning) return;
    pendingWorld.current = target;
    setVariant(transitionVariantFor(active, target));
    setTransitioning(true);
    // Swap the active World at the transition's midpoint (overlay at
    // full coverage), the same swap-mid-fade pattern the onboarding
    // hand-off into the Grove uses — see WONDERKIN_CONTINUITY §13.
    setTimeout(() => {
      if (pendingWorld.current) {
        setActive(pendingWorld.current);
        pendingWorld.current = null;
      }
    }, duration.worldTransition / 2);
  }

  function handleTransitionComplete() {
    setTransitioning(false);
  }

  return (
    <View style={styles.root}>
      <View style={styles.content}>
        <ActiveWorld onNavigateToWorld={navigateToWorld} />
      </View>
      <WorldTransition active={transitioning} variant={variant} onComplete={handleTransitionComplete} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { flex: 1 },
});
