import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { colors } from "@theme";
import { WorldScene } from "@worlds/WorldScene";
import { Toast } from "@components/Toast";
import { StoryEpisodeDefinition, CompanionTraits } from "@apptypes";
import { useStoriesStore } from "@state/storiesStore";
import { useProgressionStore } from "@state/progressionStore";
import { useCompanionStore } from "@state/companionStore";
import { recordEpisodeCompletion } from "@services/supabase/stories";
import { TaleTrailsHomeScreen } from "./screens/TaleTrailsHomeScreen";
import { EpisodeDetailScreen } from "./screens/EpisodeDetailScreen";
import { EpisodePlayerScreen } from "./screens/EpisodePlayerScreen";
import { FiresideScreen } from "./screens/FiresideScreen";
import { StoryRewardScreen } from "./screens/StoryRewardScreen";

type Step =
  | { name: "home" }
  | { name: "detail"; episode: StoryEpisodeDefinition }
  | { name: "playing"; episode: StoryEpisodeDefinition }
  | { name: "fireside"; episode: StoryEpisodeDefinition }
  | { name: "reward"; episode: StoryEpisodeDefinition };

interface TaleTrailsFlowProps {
  onReturnToGrove: () => void;
}

/**
 * Orchestrates the full Tale Trails journey, mirroring `MissionsFlow`'s
 * single-owner-of-sequencing pattern: discovery -> detail -> player
 * (opening -> optional choice -> closing) -> Fireside -> reward -> back
 * to discovery.
 */
export function TaleTrailsFlow({ onReturnToGrove }: TaleTrailsFlowProps) {
  const [step, setStep] = useState<Step>({ name: "home" });
  const [tease, setTease] = useState(false);

  const setEpisodeStatus = useStoriesStore((s) => s.setStatus);
  const recordCompletion = useStoriesStore((s) => s.recordCompletion);
  const addXp = useProgressionStore((s) => s.addXp);
  const addCoins = useProgressionStore((s) => s.addCoins);
  const addAdventureTickets = useProgressionStore((s) => s.addAdventureTickets);
  const addCollectorTokens = useProgressionStore((s) => s.addCollectorTokens);
  const pushNotification = useProgressionStore((s) => s.pushNotification);
  const nudgeTrait = useCompanionStore((s) => s.nudgeTrait);
  const setMood = useCompanionStore((s) => s.setMood);

  function grantReward(episode: StoryEpisodeDefinition, choiceId?: string) {
    const { reward } = episode;
    addXp(reward.xp);
    addCoins(reward.coins);
    if (reward.adventureTickets) addAdventureTickets(reward.adventureTickets);
    if (reward.collectorTokens) addCollectorTokens(reward.collectorTokens);
    (Object.entries(episode.traitLean) as [keyof CompanionTraits, number][]).forEach(([trait, amount]) => {
      nudgeTrait(trait, amount);
    });
    recordCompletion(episode.id, reward, choiceId);
    setMood("celebrating");
    pushNotification({ profile_id: "local-guest", kind: "adventure", message: `${episode.title} — trail complete!` });
    // Best-effort Supabase sync — never blocks the local reward flow.
    recordEpisodeCompletion("local-guest", episode.id);
  }

  // Player/Fireside render their own full-bleed cinematic backgrounds
  // (StoryScene/FiresideScreen); only discovery + detail use the
  // shared Tale Trails World background, mirroring how Missions skips
  // WorldScene for its camera/preview steps.
  const usesWorldBackground = step.name === "home" || step.name === "detail";

  const content = (
    <>
      {step.name === "home" && (
        <TaleTrailsHomeScreen
          onSelectEpisode={(episode) => {
            setEpisodeStatus(episode.id, "in_progress");
            setStep({ name: "detail", episode });
          }}
          onSealedTease={() => setTease(true)}
          onReturnToGrove={onReturnToGrove}
        />
      )}

      {step.name === "detail" && (
        <EpisodeDetailScreen
          episode={step.episode}
          onStart={() => setStep({ name: "playing", episode: step.episode })}
          onBack={() => setStep({ name: "home" })}
        />
      )}

      {step.name === "playing" && (
        <EpisodePlayerScreen
          episode={step.episode}
          onComplete={(choiceId) => {
            grantReward(step.episode, choiceId);
            setStep({ name: "fireside", episode: step.episode });
          }}
        />
      )}

      {step.name === "fireside" && (
        <FiresideScreen episode={step.episode} onContinue={() => setStep({ name: "reward", episode: step.episode })} />
      )}

      {step.name === "reward" && (
        <StoryRewardScreen episode={step.episode} onContinue={() => setStep({ name: "home" })} />
      )}
    </>
  );

  return (
    <View style={styles.root}>
      {usesWorldBackground ? <WorldScene backgroundAssetId="TALE_TRAILS_BACKGROUND">{content}</WorldScene> : content}
      <Toast
        message="This trail is still forming — check back soon!"
        visible={tease}
        onHide={() => setTease(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background.primary },
});
