import React from "react";
import { View, Text, SafeAreaView, StyleSheet } from "react-native";
import { WorldScene } from "@worlds/WorldScene";
import { CompanionReaction } from "@components/CompanionReaction";
import { Dialogue } from "@components/Dialogue";
import { PrimaryButton } from "@components/PrimaryButton";
import { colors, typography, spacing } from "@theme";
import { StoryEpisodeDefinition } from "@apptypes";
import { withCompanionName } from "../content/storyDefinitions";
import { useCompanionStore } from "@state/companionStore";

interface FiresideScreenProps {
  episode: StoryEpisodeDefinition;
  onContinue: () => void;
}

/**
 * Companion Fireside — the episode's emotional close. This is a
 * reflection, not a report card: no "Moral of the story", no grading
 * of the child's choice. Just the Companion thinking out loud, the
 * same way a friend would after an adventure.
 */
export function FiresideScreen({ episode, onContinue }: FiresideScreenProps) {
  const companionName = useCompanionStore((s) => s.name) || "your Companion";

  return (
    <WorldScene backgroundAssetId="FIRESIDE_BACKGROUND">
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <CompanionReaction mood="happy" size={140} />
          <Text style={styles.title}>Fireside</Text>
          <View style={styles.dialogueWrap}>
            <Dialogue speakerName={companionName} line={withCompanionName(episode.firesideLine, companionName)} />
          </View>
          <PrimaryButton label="Continue" onPress={onContinue} style={styles.cta} />
        </View>
      </SafeAreaView>
    </WorldScene>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  content: { flex: 1, alignItems: "center", justifyContent: "center", padding: spacing.xl, gap: spacing.md },
  title: { ...typography.display, color: colors.text.primary },
  dialogueWrap: { width: "100%", marginBottom: spacing.lg },
  cta: { alignSelf: "stretch" },
});
