import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CosmeticCategory, CosmeticItemDefinition } from "@apptypes";
import { useProgressionStore } from "@state/progressionStore";
import { findClosetItem } from "@closet/content/catalog";
import { recordCosmeticPurchase, saveEquippedSlots } from "@services/supabase/closet";

export type PurchaseOutcome = "purchased" | "already_owned" | "insufficient_currency";

interface ClosetStoreState {
  ownedItemIds: string[];
  equipped: Partial<Record<CosmeticCategory, string>>;
  isOwned: (itemId: string) => boolean;
  /**
   * Single safe purchase path. Checks ownership (idempotent — buying
   * an already-owned item is a no-op, never a duplicate charge) and
   * balance (never lets a currency go negative) BEFORE spending
   * anything, per the master protocol's currency-safety requirement.
   */
  purchase: (item: CosmeticItemDefinition) => PurchaseOutcome;
  equip: (itemId: string) => void;
}

export const useClosetStore = create<ClosetStoreState>()(
  persist(
    (set, get) => ({
      ownedItemIds: [],
      equipped: {},
      isOwned: (itemId) => get().ownedItemIds.includes(itemId),

      purchase: (item) => {
        if (get().ownedItemIds.includes(item.id)) return "already_owned";

        const progression = useProgressionStore.getState();
        const balanceByCurrency = {
          coins: progression.coins,
          adventureTickets: progression.adventureTickets,
          collectorTokens: progression.collectorTokens,
        };
        if (balanceByCurrency[item.currency] < item.price) return "insufficient_currency";

        // Deduct first (guarded above, so this can never go negative),
        // then grant ownership — mirrors the reward-grant ordering
        // used by Missions/Tale Trails/Treasure Hunt.
        if (item.currency === "coins") progression.addCoins(-item.price);
        if (item.currency === "adventureTickets") progression.addAdventureTickets(-item.price);
        if (item.currency === "collectorTokens") progression.addCollectorTokens(-item.price);

        set({ ownedItemIds: [...get().ownedItemIds, item.id] });
        // Best-effort Supabase sync — never blocks the local purchase.
        recordCosmeticPurchase("local-guest", item.id);
        return "purchased";
      },

      equip: (itemId) => {
        const item = findClosetItem(itemId);
        if (!item || !get().ownedItemIds.includes(itemId)) return;
        const nextSlots = { ...get().equipped, [item.category]: itemId };
        set({ equipped: nextSlots });
        saveEquippedSlots("local-guest", nextSlots);
      },
    }),
    {
      name: "wonderkin-closet",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
