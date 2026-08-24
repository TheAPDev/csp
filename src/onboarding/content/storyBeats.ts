import { StoryBeat } from "@story/types";

/** The cinematic introduction played once, before egg selection. */
export const introStoryBeats: StoryBeat[] = [
  {
    id: "beat-dreaming",
    backgroundAssetId: "ONBOARDING_STORY_BACKGROUND",
    videoAssetId: "ONBOARDING_STORY_VIDEO",
    cameraEffect: "drift",
    speaker: "Narrator",
    line: "Long before you arrived, WONDERKIN was already dreaming.",
    haptic: "light",
  },
  {
    id: "beat-eggs",
    backgroundAssetId: "ONBOARDING_STORY_BACKGROUND",
    videoAssetId: "ONBOARDING_STORY_VIDEO",
    cameraEffect: "push",
    speaker: "Narrator",
    line: "Somewhere past the last lantern light, three eggs waited for someone to find them.",
    particles: true,
    haptic: "light",
  },
  {
    id: "beat-you",
    backgroundAssetId: "ONBOARDING_STORY_BACKGROUND",
    videoAssetId: "ONBOARDING_STORY_VIDEO",
    cameraEffect: "pull",
    speaker: "Narrator",
    line: "Tonight, that someone is you.",
    particles: true,
    haptic: "medium",
  },
];
