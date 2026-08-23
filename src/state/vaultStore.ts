import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RedemptionRequest, RedemptionStatus, VaultRewardDefinition } from "@apptypes";
import { useProgressionStore } from "@state/progressionStore";
import { recordRedemptionRequest } from "@services/supabase/vault";

export type RedemptionOutcome = "requested" | "already_requested" | "insufficient_currency";

interface VaultStoreState {
  requests: RedemptionRequest[];
  /** Progress toward a reward is simply the child's current Collector Token balance vs its cost. */
  progressFor: (reward: VaultRewardDefinition) => { have: number; need: number; eligible: boolean };
  hasActiveRequest: (rewardId: string) => boolean;
  /**
   * Safe redemption path: blocks a second active request for the same
   * reward (no duplicate reward), and blocks spending more Collector
   * Tokens than the child has (no negative balance). Does NOT collect
   * any payment information — this only queues a parent hand-off.
   */
  requestRedemption: (reward: VaultRewardDefinition) => RedemptionOutcome;
}

export const useVaultStore = create<VaultStoreState>()(
  persist(
    (set, get) => ({
      requests: [],

      progressFor: (reward) => {
        const have = useProgressionStore.getState().collectorTokens;
        return { have, need: reward.costCollectorTokens, eligible: have >= reward.costCollectorTokens };
      },

      hasActiveRequest: (rewardId) =>
        get().requests.some((r) => r.reward_id === rewardId && r.status !== "fulfilled"),

      requestRedemption: (reward) => {
        if (get().hasActiveRequest(reward.id)) return "already_requested";

        const progression = useProgressionStore.getState();
        if (progression.collectorTokens < reward.costCollectorTokens) return "insufficient_currency";

        progression.addCollectorTokens(-reward.costCollectorTokens);

        const request: RedemptionRequest = {
          id: `${Date.now()}-${Math.round(Math.random() * 1000)}`,
          profile_id: "local-guest",
          reward_id: reward.id,
          status: "requested" as RedemptionStatus,
          requested_at: new Date().toISOString(),
        };
        set({ requests: [request, ...get().requests] });
        // Best-effort Supabase sync — never blocks the local request.
        recordRedemptionRequest("local-guest", reward.id);
        return "requested";
      },
    }),
    {
      name: "wonderkin-vault",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
