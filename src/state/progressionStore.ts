import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NotificationItem } from "@apptypes";

interface ProgressionStoreState {
  xp: number;
  level: number;
  coins: number;
  adventureTickets: number;
  collectorTokens: number;
  /**
   * Kept as full objects (not just a count) so a future notification
   * center can render them, but the Grove HUD only ever surfaces an
   * unobtrusive unread indicator — never a list or a number here.
   */
  notifications: NotificationItem[];
  addXp: (amount: number) => void;
  addCoins: (amount: number) => void;
  addAdventureTickets: (amount: number) => void;
  addCollectorTokens: (amount: number) => void;
  pushNotification: (n: Omit<NotificationItem, "id" | "read" | "created_at">) => void;
  markAllNotificationsRead: () => void;
  unreadNotificationCount: () => number;
}

/**
 * XP thresholds are intentionally simple and generous for the 6-9
 * target — leveling up should feel frequent and celebratory, not like
 * a grind. This is a local read model; `services/supabase/progress.ts`
 * remains the source of truth once synced.
 */
function levelForXp(xp: number): number {
  return Math.floor(xp / 100) + 1;
}

/**
 * Local-first progression state. XP / Level / Coins / Adventure
 * Tickets / Collector Tokens / Notifications exist architecturally
 * here per the Batch 03 spec, but the Grove screen intentionally
 * exposes them only through the single unobtrusive StatusHub — never
 * as a dashboard row. See Child UX Rule §8.
 */
export const useProgressionStore = create<ProgressionStoreState>()(
  persist(
    (set, get) => ({
      xp: 0,
      level: 1,
      coins: 0,
      adventureTickets: 1,
      collectorTokens: 0,
      notifications: [],
      addXp: (amount) => {
        const nextXp = Math.max(0, get().xp + amount);
        set({ xp: nextXp, level: levelForXp(nextXp) });
      },
      addCoins: (amount) => set({ coins: Math.max(0, get().coins + amount) }),
      addAdventureTickets: (amount) =>
        set({ adventureTickets: Math.max(0, get().adventureTickets + amount) }),
      addCollectorTokens: (amount) =>
        set({ collectorTokens: Math.max(0, get().collectorTokens + amount) }),
      pushNotification: (n) =>
        set({
          notifications: [
            {
              ...n,
              id: `${Date.now()}-${Math.round(Math.random() * 1000)}`,
              read: false,
              created_at: new Date().toISOString(),
            },
            ...get().notifications,
          ].slice(0, 30),
        }),
      markAllNotificationsRead: () =>
        set({ notifications: get().notifications.map((n) => ({ ...n, read: true })) }),
      unreadNotificationCount: () => get().notifications.filter((n) => !n.read).length,
    }),
    {
      name: "wonderkin-progression",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
