import { MissionDefinition, MissionCategory } from "@apptypes";
import { AssetId } from "@assets/registry";

/** Category -> card art. Missions within a category share art until real per-mission art exists. */
export const categoryAsset: Record<MissionCategory, AssetId> = {
  kindDeeds: "MISSION_CARD_KIND_DEEDS",
  braveSparks: "MISSION_CARD_BRAVE_SPARKS",
  curiousFinds: "MISSION_CARD_CURIOUS_FINDS",
  storyVoices: "MISSION_CARD_STORY_VOICES",
  groveBonds: "MISSION_CARD_GROVE_BONDS",
};

/** Category -> child-facing label. Flavor, not a scoreboard — see master protocol §VALUES. */
export const categoryLabel: Record<MissionCategory, string> = {
  kindDeeds: "Kind Deeds",
  braveSparks: "Brave Sparks",
  curiousFinds: "Curious Finds",
  storyVoices: "Story Voices",
  groveBonds: "Grove Bonds",
};

/**
 * Local mission content seed. Mirrors the shape of the
 * `mission_definitions` Supabase table (see schema.sql) — the app
 * reads from Supabase first and falls back to this array, so
 * Missions is always playable (`services/supabase/missions.ts`).
 *
 * Each mission's `traitLean` is internal-only and never rendered —
 * the `prompt` is written to let the world communicate the value
 * rather than naming a trait (master protocol §VALUES).
 */
export const missionDefinitions: MissionDefinition[] = [
  {
    id: "morning-light-hunter",
    category: "curiousFinds",
    length: "quick",
    title: "Morning Light Hunter",
    prompt: "Find something in your home that catches the morning light, and snap a photo of it.",
    submissionType: "photo",
    reward: { xp: 20, coins: 10 },
    traitLean: { curiosity: 0.05 },
  },
  {
    id: "brave-first-step",
    category: "braveSparks",
    length: "quick",
    title: "Brave First Step",
    prompt: "Right after you do something a little nerve-wracking today, snap a photo to remember it.",
    submissionType: "photo",
    reward: { xp: 25, coins: 10 },
    traitLean: { courage: 0.06 },
  },
  {
    id: "kindness-in-action",
    category: "kindDeeds",
    length: "quick",
    title: "Kindness in Action",
    prompt: "Snap a photo of something kind you did or gave to someone today.",
    submissionType: "photo",
    reward: { xp: 20, coins: 15 },
    traitLean: { heart: 0.06 },
  },
  {
    id: "grove-wanderer",
    category: "groveBonds",
    length: "quick",
    title: "Grove Wanderer",
    prompt: "Snap a photo of your favorite cozy spot to sit with your Companion.",
    submissionType: "photo",
    reward: { xp: 15, coins: 10, collectorTokens: 1 },
    traitLean: { bond: 0.05 },
  },
  {
    id: "voice-of-your-own",
    category: "storyVoices",
    length: "quick",
    title: "Voice of Your Own",
    prompt: "Tell your Companion about the best part of your day.",
    submissionType: "voice",
    reward: { xp: 20, coins: 10 },
    traitLean: { voice: 0.06 },
  },
  {
    id: "the-long-watch",
    category: "curiousFinds",
    length: "long",
    title: "The Long Watch",
    prompt: "Over the next few days, notice how the sky changes, and tell your Companion what you saw.",
    submissionType: "reflection",
    reward: { xp: 60, coins: 30, adventureTickets: 1 },
    traitLean: { curiosity: 0.08 },
  },
  {
    id: "guardians-blessing",
    category: "groveBonds",
    length: "long",
    title: "Guardian's Blessing",
    prompt: "Ask a grown-up to share their own First Promise with you.",
    submissionType: "guardian",
    reward: { xp: 50, coins: 20, collectorTokens: 2 },
    traitLean: { bond: 0.08, heart: 0.03 },
  },
  {
    id: "quiz-of-wonders",
    category: "curiousFinds",
    length: "quick",
    title: "Quiz of Wonders",
    prompt: "Answer your Companion's curious little questions about the world.",
    submissionType: "quiz",
    reward: { xp: 15, coins: 5 },
    traitLean: { curiosity: 0.04 },
  },
  {
    id: "story-in-motion",
    category: "storyVoices",
    length: "long",
    title: "Story in Motion",
    prompt: "Act out your favorite part of a story you love, for your Companion to watch.",
    submissionType: "video",
    reward: { xp: 55, coins: 25, adventureTickets: 1 },
    traitLean: { voice: 0.08, courage: 0.03 },
  },
];

export function getMissionById(id: string): MissionDefinition | undefined {
  return missionDefinitions.find((m) => m.id === id);
}
