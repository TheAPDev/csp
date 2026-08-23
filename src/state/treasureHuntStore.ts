import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MissionReward } from "@apptypes";

export interface TreasureCollectionRecord {
  treasureId: string;
  collectedAt: string;
  reward: MissionReward;
}

interface TreasureHuntStoreState {
  /** Most recent first, capped — mirrors missionsStore.completions. Demo treasures are re-collectible each visit, so this is a history log, not a one-time completion flag. */
  collections: TreasureCollectionRecord[];
  recordCollection: (treasureId: string, reward: MissionReward) => void;
}

export const useTreasureHuntStore = create<TreasureHuntStoreState>()(
  persist(
    (set, get) => ({
      collections: [],
      recordCollection: (treasureId, reward) =>
        set({
          collections: [{ treasureId, collectedAt: new Date().toISOString(), reward }, ...get().collections].slice(
            0,
            100
          ),
        }),
    }),
    {
      name: "wonderkin-treasure-hunt",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
