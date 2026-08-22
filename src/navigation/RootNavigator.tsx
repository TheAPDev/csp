import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { BottomNav, NavDestination, WorldTransition } from "@components/index";
import { worldRegistry, WorldId } from "@worlds/WorldRegistry";
import GroveWorld from "@worlds/worlds/Grove";
import MissionsWorld from "@worlds/worlds/Missions";
import TaleTrailsWorld from "@worlds/worlds/TaleTrails";
import TreasureHuntWorld from "@worlds/worlds/TreasureHunt";
import TheBeyondWorld from "@worlds/worlds/TheBeyond";
import { Text } from "react-native";
import { colors } from "@theme";

const worldComponents: Record<WorldId, React.ComponentType> = {
  grove: GroveWorld,
  missions: MissionsWorld,
  taleTrails: TaleTrailsWorld,
  treasureHunt: TreasureHuntWorld,
  theBeyond: TheBeyondWorld,
};

const destinations: NavDestination[] = (Object.keys(worldRegistry) as WorldId[]).map((id) => ({
  key: id,
  label: worldRegistry[id].displayName,
  icon: <Text style={{ color: colors.text.secondary }}>●</Text>,
}));

/**
 * Root navigation shell. Uses the BottomNav component + WorldRegistry
 * so future batches only need to register a World, not build new
 * navigation plumbing. Radial nav for the Grove hub can wrap this
 * same state in a later batch.
 */
export function RootNavigator() {
  const [active, setActive] = useState<WorldId>("grove");
  const [transitioning, setTransitioning] = useState(false);
  const ActiveWorld = worldComponents[active];

  function handleSelect(key: string) {
    if (key === active) return;
    setTransitioning(true);
    setTimeout(() => setActive(key as WorldId), 150);
  }

  return (
    <View style={styles.root}>
      <View style={styles.content}>
        <ActiveWorld />
      </View>
      <BottomNav destinations={destinations} activeKey={active} onSelect={handleSelect} />
      <WorldTransition active={transitioning} onComplete={() => setTransitioning(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { flex: 1 },
});
