import React from "react";
import { View, Text, ScrollView, SafeAreaView, StyleSheet } from "react-native";
import { colors, typography, spacing } from "@theme";
import { StoryEpisodeDefinition } from "@apptypes";
import { storyEpisodes } from "../content/storyDefinitions";
import { EpisodeCard } from "../components/EpisodeCard";
import { useStoriesStore } from "@state/storiesStore";
import { ReturnToGrove } from "@components/ReturnToGrove";

interface TaleTrailsHomeScreenProps {
  onSelectEpisode: (episode: StoryEpisodeDefinition) => void;
  onSealedTease: () => void;
  onReturnToGrove: () => void;
}

/** Discovery: available chapters first, sealed chapters after — the library reads as one continuous shelf, not two separate zones. */
export function TaleTrailsHomeScreen({ onSelectEpisode, onSealedTease, onReturnToGrove }: TaleTrailsHomeScreenProps) {
  const statusFor = useStoriesStore((s) => s.statusFor);
  const available = storyEpisodes.filter((e) => e.available);
  const sealed = storyEpisodes.filter((e) => !e.available);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Tale Trails</Text>
        <Text style={styles.subtitle}>Pick a trail — your Companion will come along.</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
          {[...available, ...sealed].map((episode) => (
            <EpisodeCard
              key={episode.id}
              episode={episode}
              status={statusFor(episode.id)}
              onPress={() => onSelectEpisode(episode)}
              onSealedPress={onSealedTease}
            />
          ))}
        </ScrollView>

        <ReturnToGrove onPress={onReturnToGrove} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "transparent" },
  scrollContent: { paddingTop: spacing.lg, paddingBottom: spacing.xxxl },
  title: { ...typography.display, color: colors.text.primary, marginHorizontal: spacing.lg },
  subtitle: {
    ...typography.body,
    color: colors.text.secondary,
    marginHorizontal: spacing.lg,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  row: { gap: spacing.md, paddingHorizontal: spacing.lg },
});
