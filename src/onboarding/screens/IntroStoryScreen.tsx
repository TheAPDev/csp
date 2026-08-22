import React from "react";
import { StoryPlayer } from "@story/index";
import { useOnboardingStore } from "@state/onboardingStore";
import { introStoryBeats } from "../content/storyBeats";

/** The cinematic introduction — an interactive story, not a slideshow. */
export function IntroStoryScreen() {
  const advance = useOnboardingStore((s) => s.advance);
  return <StoryPlayer beats={introStoryBeats} onComplete={advance} />;
}
