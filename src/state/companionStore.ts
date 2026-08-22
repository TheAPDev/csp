import { create } from "zustand";
import { CompanionMood } from "@components/CompanionReaction";

interface CompanionStoreState {
  mood: CompanionMood;
  bondLevel: number;
  setMood: (mood: CompanionMood) => void;
  setBondLevel: (level: number) => void;
}

/**
 * Local-first Companion state for instant UI reactions. Sync layer to
 * Supabase (`services/supabase/companion.ts`) is intentionally kept
 * separate so offline play never blocks on network.
 */
export const useCompanionStore = create<CompanionStoreState>((set) => ({
  mood: "idle",
  bondLevel: 0,
  setMood: (mood) => set({ mood }),
  setBondLevel: (bondLevel) => set({ bondLevel }),
}));
