import { StoryEpisodeDefinition } from "@apptypes";

/**
 * Static local seed, mirroring `missions/content/missionDefinitions.ts`.
 * `services/supabase/stories.ts` reads Supabase first and falls back
 * to this so Tale Trails stays playable offline / before a backend
 * exists — same guest-continuation philosophy as onboarding/Missions.
 *
 * Each episode is a *lightweight* branch, not a tree: `openingBeats`
 * always play, an optional two-way `choice` plays one short reaction
 * beat, then `closingBeats` reconnect identically either way.
 */
export const storyEpisodes: StoryEpisodeDefinition[] = [
  {
    id: "lanternPath",
    title: "The Lantern Path",
    teaser: "A trail of light needs a friend to follow it home.",
    thumbnailAssetId: "STORY_LANTERN_PATH_BG",
    available: true,
    openingBeats: [
      {
        id: "lantern-1",
        backgroundAssetId: "STORY_LANTERN_PATH_BG",
        speaker: "Narrator",
        line: "The trail glowed faintly under the old trees, like it was waiting for someone.",
        cameraEffect: "drift",
        haptic: "light",
      },
      {
        id: "lantern-2",
        backgroundAssetId: "STORY_LANTERN_PATH_BG",
        speaker: "{companionName}",
        line: "Look — a little light, blinking on and off. It looks lost.",
        cameraEffect: "push",
        particles: true,
      },
    ],
    choice: {
      speaker: "{companionName}",
      line: "What should we do?",
      options: [
        {
          id: "goAlone",
          label: "Follow it ourselves",
          companionLine: "Just the two of us, then. Stay close!",
          mood: "curious",
        },
        {
          id: "callFriends",
          label: "Call the other Grove friends",
          companionLine: "Good thinking — more eyes, more light!",
          mood: "happy",
        },
      ],
    },
    closingBeats: [
      {
        id: "lantern-3",
        backgroundAssetId: "STORY_LANTERN_PATH_GLADE_BG",
        speaker: "Narrator",
        line: "The light led them into a glade full of tiny glowing lanterns, all blinking together now.",
        cameraEffect: "pull",
        particles: true,
        haptic: "success",
      },
      {
        id: "lantern-4",
        backgroundAssetId: "STORY_LANTERN_PATH_GLADE_BG",
        speaker: "{companionName}",
        line: "It wasn't lost at all. It just wanted to show us this.",
        cameraEffect: "none",
      },
    ],
    firesideLine:
      "I keep thinking about that little light. It wasn't scared of the dark — it just needed someone to notice it. I liked noticing it with you.",
    reward: { xp: 40, coins: 15, collectorTokens: 1 },
    traitLean: { curiosity: 0.05, bond: 0.04 },
  },
  {
    id: "tideCove",
    title: "Tide Cove Secrets",
    teaser: "The tide only opens this cove for a few minutes a day.",
    thumbnailAssetId: "STORY_TIDE_COVE_BG",
    available: true,
    openingBeats: [
      {
        id: "tide-1",
        backgroundAssetId: "STORY_TIDE_COVE_BG",
        speaker: "Narrator",
        line: "The water pulled back just enough to reveal a narrow path of wet stone.",
        cameraEffect: "drift",
      },
      {
        id: "tide-2",
        backgroundAssetId: "STORY_TIDE_COVE_BG",
        speaker: "{companionName}",
        line: "Quick — before the tide changes its mind!",
        cameraEffect: "push",
        haptic: "light",
      },
    ],
    // No choice this episode — not every Tale Trails story branches.
    closingBeats: [
      {
        id: "tide-3",
        backgroundAssetId: "STORY_TIDE_COVE_DEPTHS_BG",
        speaker: "Narrator",
        line: "Deep in the cove, the walls shimmered with tiny shells shaped like stars.",
        cameraEffect: "pull",
        particles: true,
        haptic: "success",
      },
    ],
    firesideLine:
      "That cove only shows itself for a little while each day. I'm glad we happened to be there for it.",
    reward: { xp: 35, coins: 15, adventureTickets: 1 },
    traitLean: { heart: 0.04, bond: 0.04 },
  },
  {
    id: "starLoom",
    title: "The Star Loom",
    teaser: "Somewhere, someone is weaving the night sky.",
    thumbnailAssetId: "STORY_SEALED_CHAPTER",
    available: false,
    openingBeats: [],
    closingBeats: [],
    firesideLine: "",
    reward: { xp: 0, coins: 0 },
    traitLean: {},
  },
  {
    id: "rootWhispers",
    title: "Whispers Under the Roots",
    teaser: "The oldest tree in the Grove remembers everything.",
    thumbnailAssetId: "STORY_SEALED_CHAPTER",
    available: false,
    openingBeats: [],
    closingBeats: [],
    firesideLine: "",
    reward: { xp: 0, coins: 0 },
    traitLean: {},
  },
];

export function getEpisodeById(id: string): StoryEpisodeDefinition | undefined {
  return storyEpisodes.find((e) => e.id === id);
}

/** Substitutes the `{companionName}` template token used throughout episode content. */
export function withCompanionName(line: string, companionName: string): string {
  return line.replace(/\{companionName\}/g, companionName || "your Companion");
}
