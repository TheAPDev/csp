import React from "react";
import { View, Text, ScrollView, StyleSheet, ImageStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AssetImage } from "@components/AssetImage";
import { PrimaryButton } from "@components/PrimaryButton";
import { IconButton } from "@components/IconButton";
import { colors, typography, spacing, radius } from "@theme";
import { StoryEpisodeDefinition } from "@apptypes";

interface EpisodeDetailScreenProps {
  episode: StoryEpisodeDefinition;
  onStart: () => void;
  onBack: () => void;
}

export function EpisodeDetailScreen({ episode, onStart, onBack }: EpisodeDetailScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <IconButton onPress={onBack} style={styles.back}>
          <Text style={styles.backLabel}>â†</Text>
        </IconButton>
        <AssetImage id={episode.thumbnailAssetId} style={styles.hero as ImageStyle} />
        <Text style={styles.title}>{episode.title}</Text>
        <Text style={styles.teaser}>{episode.teaser}</Text>
        <PrimaryButton label="Begin the Trail" onPress={onStart} style={styles.cta} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "transparent" },
  content: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  back: { marginBottom: spacing.md },
  backLabel: { ...typography.heading, color: colors.text.primary },
  hero: { width: "100%", height: 200, borderRadius: radius.lg, marginBottom: spacing.lg },
  title: { ...typography.display, color: colors.text.primary, marginBottom: spacing.sm },
  teaser: { ...typography.bodyLarge, color: colors.text.secondary, marginBottom: spacing.xl },
  cta: { alignSelf: "stretch" },
});

