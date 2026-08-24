import React from "react";
import { View, Text, ScrollView, SafeAreaView, StyleSheet } from "react-native";
import { colors, typography, spacing } from "@theme";
import { BeyondRegionDefinition } from "@apptypes";
import { beyondRegions } from "../content/regions";
import { BeyondRegionCard } from "../components/BeyondRegionCard";
import { useBeyondStore } from "@state/beyondStore";
import { ReturnToGrove } from "@components/ReturnToGrove";

interface BeyondHomeScreenProps {
  onSelectRegion: (region: BeyondRegionDefinition) => void;
  onSealedTease: () => void;
  onReturnToGrove: () => void;
}

/** Discovery: every region in one continuous list — available and sealed side by side, so The Beyond reads as one expansive place, not two zones. */
export function BeyondHomeScreen({ onSelectRegion, onSealedTease, onReturnToGrove }: BeyondHomeScreenProps) {
  const isRegionComplete = useBeyondStore((s) => s.isRegionComplete);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>The Beyond</Text>
        <Text style={styles.subtitle}>Further than the Grove, deeper than any map — go gently.</Text>

        {beyondRegions.map((region) => (
          <BeyondRegionCard
            key={region.id}
            region={region}
            explored={isRegionComplete(region.id, region.points?.length ?? 0)}
            onPress={() => onSelectRegion(region)}
            onSealedPress={onSealedTease}
          />
        ))}

        <ReturnToGrove onPress={onReturnToGrove} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "transparent" },
  scrollContent: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  title: { ...typography.display, color: colors.text.primary },
  subtitle: { ...typography.body, color: colors.text.secondary, marginTop: spacing.xs, marginBottom: spacing.lg },
});
