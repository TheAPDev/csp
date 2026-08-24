import React, { useEffect, useMemo, useState } from "react";
import { View, Pressable, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WorldScene } from "@worlds/WorldScene";
import { WorldId } from "@worlds/WorldRegistry";
import { colors, spacing } from "@theme";
import { CompanionReaction, GroveAmbient, GroveDecor } from "@components/index";
import { useCompanionStore } from "@state/companionStore";
import { useProgressionStore } from "@state/progressionStore";
import { useGroveStore, evolutionStageForLevel, groveBackgroundForStage } from "@state/groveStore";
import { leanFor } from "@companion/evolution";

interface GroveWorldProps {
  onNavigateToWorld?: (world: WorldId) => void;
}

const radialOptions: Array<{ id: WorldId; icon: string }> = [
  { id: "missions", icon: "✦" },
  { id: "treasureHunt", icon: "✧" },
  { id: "taleTrails", icon: "✹" },
  { id: "theBeyond", icon: "✺" },
  { id: "closet", icon: "◌" },
  { id: "vault", icon: "◎" },
];

export default function GroveWorld({ onNavigateToWorld }: GroveWorldProps) {
  const mood = useCompanionStore((s) => s.mood);
  const traits = useCompanionStore((s) => s.traits);
  const xp = useProgressionStore((s) => s.xp);
  const coins = useProgressionStore((s) => s.coins);
  const level = useProgressionStore((s) => s.level);
  const recordVisit = useGroveStore((s) => s.recordVisit);

  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    recordVisit();
  }, [recordVisit]);

  const evolutionStage = useMemo(() => evolutionStageForLevel(level), [level]);
  const backgroundAssetId = useMemo(() => groveBackgroundForStage(evolutionStage), [evolutionStage]);
  const lean = useMemo(() => leanFor(traits), [traits]);

  return (
    <WorldScene backgroundAssetId={backgroundAssetId}>
      <GroveAmbient intensity={evolutionStage === 2 ? 10 : evolutionStage === 1 ? 8 : 6} />
      <GroveDecor lean={lean} stage={evolutionStage} />

      <View style={styles.scene} pointerEvents="box-none">
        <View style={styles.statsPanel}>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>XP</Text>
            <Text style={styles.statValue}>{xp}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Coins</Text>
            <Text style={styles.statValue}>{coins}</Text>
          </View>
        </View>

        <View style={styles.centerStage} pointerEvents="box-none">
          <CompanionReaction mood={mood} size={170} onPress={() => undefined} />
        </View>

        <View style={styles.menuRoot} pointerEvents="box-none">
          {radialOptions.map((option, index) => {
            const startAngle = 0;
            const endAngle = 180;
            const angleDeg = startAngle + (endAngle - startAngle) * (index / (radialOptions.length - 1));
            const radius = 94;
            const arcX = menuOpen ? Math.cos((angleDeg * Math.PI) / 180) * radius : 0;
            const arcY = menuOpen ? -Math.sin((angleDeg * Math.PI) / 180) * radius - 26 : 0;

            return (
              <Pressable
                key={option.id}
                style={[
                  styles.menuOption,
                  {
                    opacity: menuOpen ? 1 : 0,
                    transform: [{ translateX: arcX }, { translateY: arcY }],
                    pointerEvents: menuOpen ? "auto" : "none",
                  },
                ]}
                onPress={() => onNavigateToWorld?.(option.id)}
              >
                <Text style={styles.optionIcon}>{option.icon}</Text>
              </Pressable>
            );
          })}

          <Pressable style={styles.menuButton} onPress={() => setMenuOpen((value) => !value)}>
            <Text style={styles.menuIcon}>⚡</Text>
          </Pressable>
        </View>
      </View>
    </WorldScene>
  );
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
  },
  statsPanel: {
    position: "absolute",
    top: 26,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(9, 16, 28, 0.72)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    zIndex: 19,
    minWidth: 200,
    justifyContent: "space-between",
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statDivider: {
    width: 1,
    height: 18,
    backgroundColor: "rgba(255,255,255,0.18)",
    marginHorizontal: 10,
  },
  statLabel: {
    color: colors.text.primary,
    fontSize: 12,
    opacity: 0.8,
    letterSpacing: 0.4,
  },
  statValue: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: "700",
  },
  centerStage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  menuRoot: {
    position: "absolute",
    bottom: 24,
    alignSelf: "center",
    width: 290,
    height: 170,
    justifyContent: "center",
    alignItems: "center",
  },
  menuButton: {
    position: "absolute",
    bottom: 2,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "rgba(23, 30, 46, 0.72)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.28)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  menuIcon: {
    fontSize: 28,
    color: colors.text.primary,
  },
  menuOption: {
    position: "absolute",
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "rgba(11, 16, 26, 0.7)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 11,
  },
  optionIcon: {
    fontSize: 22,
  },
});

