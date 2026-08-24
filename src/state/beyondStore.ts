import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MissionReward } from "@apptypes";

export interface BeyondCompletionRecord {
  regionId: string;
  completedAt: string;
  reward: MissionReward;
}

interface BeyondStoreState {
  /** Point-of-interest ids discovered so far, per region. */
  discoveredByRegion: Record<string, string[]>;
  /** Most recent first, capped — same shape/philosophy as missionsStore/storiesStore/treasureHuntStore. */
  completions: BeyondCompletionRecord[];
  isDiscovered: (regionId: string, pointId: string) => boolean;
  discover: (regionId: string, pointId: string) => void;
  isRegionComplete: (regionId: string, totalPoints: number) => boolean;
  recordCompletion: (regionId: string, reward: MissionReward) => void;
}

/**
 * Local-first Beyond exploration progress. Follows the exact same
 * pattern as missionsStore/storiesStore/treasureHuntStore — one
 * store per World's own progress concept, all reading/writing
 * currencies and XP through the single `progressionStore`, never
 * duplicating it (see WONDERKIN_CONTINUITY §STATE AUDIT, Batch 09).
 */
export const useBeyondStore = create<BeyondStoreState>()(
  persist(
    (set, get) => ({
      discoveredByRegion: {},
      completions: [],
      isDiscovered: (regionId, pointId) => (get().discoveredByRegion[regionId] ?? []).includes(pointId),
      discover: (regionId, pointId) => {
        const existing = get().discoveredByRegion[regionId] ?? [];
        if (existing.includes(pointId)) return;
        set({ discoveredByRegion: { ...get().discoveredByRegion, [regionId]: [...existing, pointId] } });
      },
      isRegionComplete: (regionId, totalPoints) => (get().discoveredByRegion[regionId] ?? []).length >= totalPoints,
      recordCompletion: (regionId, reward) =>
        set({
          completions: [{ regionId, completedAt: new Date().toISOString(), reward }, ...get().completions].slice(
            0,
            100
          ),
        }),
    }),
    {
      name: "wonderkin-beyond",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
