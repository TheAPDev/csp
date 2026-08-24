import React, { useMemo, useState } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StoryPlayer } from "@story/StoryPlayer";
import { StoryScene } from "@story/StoryScene";
import { StoryEpisodeDefinition, StoryChoiceOption } from "@apptypes";
import { StoryBeat } from "@story/types";
import { withCompanionName } from "../content/storyDefinitions";
import { ChoicePrompt } from "../components/ChoicePrompt";
import { useCompanionStore } from "@state/companionStore";

interface EpisodePlayerScreenProps {
  episode: StoryEpisodeDefinition;
  onComplete: (choiceId?: string) => void;
}

type Phase = "opening" | "choice" | "reaction" | "closing";

/**
 * Sequences one episode: opening beats play through the existing
 * `StoryPlayer` unmodified; if the episode has a `choice`, a
 * dedicated `ChoicePrompt` screen (not a StoryBeat) pauses the story;
 * the chosen option plays one short reaction `StoryScene` beat
 * (tap-to-continue, same as any other beat); then `closingBeats` play
 * through a second `StoryPlayer` instance â€” reconnecting to the same
 * ending regardless of choice. This keeps `StoryPlayer`/`StoryBeat`
 * completely unchanged, per the continuity doc's stability rule.
 */
export function EpisodePlayerScreen({ episode, onComplete }: EpisodePlayerScreenProps) {
  const companionName = useCompanionStore((s) => s.name) || "your Companion";
  const [phase, setPhase] = useState<Phase>("opening");
  const [chosenOption, setChosenOption] = useState<StoryChoiceOption | null>(null);

  const substitute = (beats: StoryBeat[]): StoryBeat[] =>
    beats.map((b) => ({
      ...b,
      speaker: b.speaker ? withCompanionName(b.speaker, companionName) : b.speaker,
      line: b.line ? withCompanionName(b.line, companionName) : b.line,
    }));

  const openingBeats = useMemo(() => substitute(episode.openingBeats), [episode.id, companionName]);
  const closingBeats = useMemo(() => substitute(episode.closingBeats), [episode.id, companionName]);

  const reactionBeat: StoryBeat | null = chosenOption
    ? {
        id: `${episode.id}-reaction-${chosenOption.id}`,
        backgroundAssetId: episode.thumbnailAssetId,
        speaker: companionName,
        line: chosenOption.companionLine,
        cameraEffect: "none",
        haptic: "light",
      }
    : null;

  if (phase === "opening") {
    return (
      <StoryPlayer
        beats={openingBeats}
        onComplete={() => setPhase(episode.choice ? "choice" : "closing")}
      />
    );
  }

  if (phase === "choice" && episode.choice) {
    return (
      <ChoicePrompt
        prompt={episode.choice}
        companionName={companionName}
        onChoose={(option: StoryChoiceOption) => {
          setChosenOption(option);
          setPhase("reaction");
        }}
      />
    );
  }

  if (phase === "reaction" && reactionBeat) {
    return (
      <Pressable style={styles.fill} onPress={() => setPhase("closing")} accessibilityRole="button" accessibilityLabel="Continue the story">
        <StoryScene beat={reactionBeat} />
      </Pressable>
    );
  }

  return <StoryPlayer beats={closingBeats} onComplete={() => onComplete(chosenOption?.id)} />;
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
});

