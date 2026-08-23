import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MissionReward } from "@apptypes";

export type MissionStatus = "not_started" | "in_progress" | "complete";

export interface MissionCompletionRecord {
  missionId: string;
  completedAt: string;
  reward: MissionReward;
}

interface MissionsStoreState {
  progressByMissionId: Record<string, MissionStatus>;
  /** Most recent first. Capped so this never grows unbounded on-device. */
  completions: MissionCompletionRecord[];
  statusFor: (missionId: string) => MissionStatus;
  setStatus: (missionId: string, status: MissionStatus) => void;
  recordCompletion: (missionId: string, reward: MissionReward) => void;
}

/**
 * Local-first Mission progress + completion history. Supabase sync
 * (`services/supabase/missions.ts`) is best-effort and fired
 * alongside these updates, never in place of them — Missions must
 * stay fully playable offline.
 */
export const useMissionsStore = create<MissionsStoreState>()(
  persist(
    (set, get) => ({
      progressByMissionId: {},
      completions: [],
      statusFor: (missionId) => get().progressByMissionId[missionId] ?? "not_started",
      setStatus: (missionId, status) =>
        set({ progressByMissionId: { ...get().progressByMissionId, [missionId]: status } }),
      recordCompletion: (missionId, reward) =>
        set({
          progressByMissionId: { ...get().progressByMissionId, [missionId]: "complete" },
          completions: [{ missionId, completedAt: new Date().toISOString(), reward }, ...get().completions].slice(
            0,
            100
          ),
        }),
    }),
    {
      name: "wonderkin-missions",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
