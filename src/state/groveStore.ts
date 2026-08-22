import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GroveEvolutionStage } from "@apptypes";
import { AssetId } from "@assets/registry";

interface GroveStoreState {
  lastVisitedAt: string | null;
  /** Recorded on every Grove mount so a future batch can add "welcome back" beats. */
  recordVisit: () => void;
}

/**
 * Grove environmental state. The evolution *stage* itself is derived
 * (see `evolutionStageForLevel` / `groveBackgroundForStage` below) from
 * `progressionStore.level` rather than stored independently, so the
 * Grove can never drift out of sync with progression. Only visit
 * timestamps are persisted here.
 */
export const useGroveStore = create<GroveStoreState>()(
  persist(
    (set) => ({
      lastVisitedAt: null,
      recordVisit: () => set({ lastVisitedAt: new Date().toISOString() }),
    }),
    {
      name: "wonderkin-grove",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

/**
 * Maps a progression level to a Grove evolution stage. Thresholds are
 * intentionally low so a child sees the Grove change within their
 * first few sessions. Stage only ever increases in the UI — never
 * pass a stale/lower level in.
 */
export function evolutionStageForLevel(level: number): GroveEvolutionStage {
  if (level >= 6) return 2;
  if (level >= 3) return 1;
  return 0;
}

const stageBackground: Record<GroveEvolutionStage, AssetId> = {
  0: "GROVE_BACKGROUND",
  1: "GROVE_BACKGROUND_BLOOM",
  2: "GROVE_BACKGROUND_RADIANT",
};

/** The single place that turns an evolution stage into a background AssetId. */
export function groveBackgroundForStage(stage: GroveEvolutionStage): AssetId {
  return stageBackground[stage];
}
