import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MissionReward } from "@apptypes";

export type EpisodeStatus = "not_started" | "in_progress" | "complete";

export interface EpisodeCompletionRecord {
  episodeId: string;
  completedAt: string;
  reward: MissionReward;
  choiceId?: string;
}

interface StoriesStoreState {
  progressByEpisodeId: Record<string, EpisodeStatus>;
  completions: EpisodeCompletionRecord[];
  statusFor: (episodeId: string) => EpisodeStatus;
  setStatus: (episodeId: string, status: EpisodeStatus) => void;
  recordCompletion: (episodeId: string, reward: MissionReward, choiceId?: string) => void;
}

/**
 * Local-first Tale Trails progress + completion history — same shape
 * and same local-first-with-best-effort-sync philosophy as
 * `state/missionsStore.ts`, per the batch's "reuse progression"
 * instruction rather than inventing a parallel pattern.
 */
export const useStoriesStore = create<StoriesStoreState>()(
  persist(
    (set, get) => ({
      progressByEpisodeId: {},
      completions: [],
      statusFor: (episodeId) => get().progressByEpisodeId[episodeId] ?? "not_started",
      setStatus: (episodeId, status) =>
        set({ progressByEpisodeId: { ...get().progressByEpisodeId, [episodeId]: status } }),
      recordCompletion: (episodeId, reward, choiceId) =>
        set({
          progressByEpisodeId: { ...get().progressByEpisodeId, [episodeId]: "complete" },
          completions: [
            { episodeId, completedAt: new Date().toISOString(), reward, choiceId },
            ...get().completions,
          ].slice(0, 100),
        }),
    }),
    {
      name: "wonderkin-taletrails",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
