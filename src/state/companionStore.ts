import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CompanionMood } from "@components/CompanionReaction";
import { CompanionTraits } from "@apptypes";

const DEFAULT_TRAITS: CompanionTraits = {
  heart: 0.5,
  courage: 0.5,
  curiosity: 0.5,
  voice: 0.5,
  bond: 0.3,
};

interface CompanionStoreState {
  mood: CompanionMood;
  bondLevel: number;
  /** Companion's given name, set during onboarding's Naming step. */
  name: string;
  /**
   * Five continuous internal traits (0..1) — see CompanionTraits.
   * Never rendered as a number/score in any UI (Child UX Rule §9).
   * Batch 02 nudges these quietly from egg choice + First Promise.
   */
  traits: CompanionTraits;
  setMood: (mood: CompanionMood) => void;
  setBondLevel: (level: number) => void;
  setName: (name: string) => void;
  /** Nudge one trait by a small signed amount, clamped to [0, 1]. */
  nudgeTrait: (trait: keyof CompanionTraits, amount: number) => void;
}

/**
 * Local-first Companion state for instant UI reactions. Sync layer to
 * Supabase (`services/supabase/companion.ts`) is intentionally kept
 * separate so offline play never blocks on network. Persisted to
 * AsyncStorage so the Companion's name/traits survive an app restart.
 */
export const useCompanionStore = create<CompanionStoreState>()(
  persist(
    (set, get) => ({
      mood: "idle",
      bondLevel: 0,
      name: "",
      traits: DEFAULT_TRAITS,
      setMood: (mood) => set({ mood }),
      setBondLevel: (bondLevel) => set({ bondLevel }),
      setName: (name) => set({ name }),
      nudgeTrait: (trait, amount) => {
        const current = get().traits;
        const next = Math.max(0, Math.min(1, current[trait] + amount));
        set({ traits: { ...current, [trait]: next } });
      },
    }),
    {
      name: "wonderkin-companion",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
