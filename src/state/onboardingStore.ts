import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { EggId } from "@apptypes";

export type OnboardingStep =
  | "welcome"
  | "account"
  | "begin"
  | "introStory"
  | "eggSelection"
  | "hatching"
  | "companionReveal"
  | "naming"
  | "firstPromise"
  | "complete";

const STEP_ORDER: OnboardingStep[] = [
  "welcome",
  "account",
  "begin",
  "introStory",
  "eggSelection",
  "hatching",
  "companionReveal",
  "naming",
  "firstPromise",
  "complete",
];

/** Steps that cannot be returned to via the back affordance. */
const NO_BACK_STEPS: ReadonlySet<OnboardingStep> = new Set(["welcome", "hatching", "complete"]);

interface OnboardingStoreState {
  step: OnboardingStep;
  selectedEgg: EggId | null;
  companionName: string;
  firstPromiseId: string | null;
  completed: boolean;
  /** True once the persisted store has finished loading from AsyncStorage. */
  hasHydrated: boolean;
  goToStep: (step: OnboardingStep) => void;
  advance: () => void;
  goBack: () => void;
  canGoBack: () => boolean;
  selectEgg: (egg: EggId) => void;
  setCompanionName: (name: string) => void;
  setFirstPromise: (id: string) => void;
  complete: () => void;
  /** Resets the whole journey — used for QA/testing "restart" flows. */
  restart: () => void;
  setHasHydrated: (v: boolean) => void;
}

/**
 * Drives the first-time child journey (Batch 02). Persisted so an
 * interrupted session (app killed mid-flow) resumes at the same step
 * rather than restarting or losing the child's choices so far.
 */
export const useOnboardingStore = create<OnboardingStoreState>()(
  persist(
    (set, get) => ({
      step: "welcome",
      selectedEgg: null,
      companionName: "",
      firstPromiseId: null,
      completed: false,
      hasHydrated: false,

      goToStep: (step) => set({ step }),

      advance: () => {
        const idx = STEP_ORDER.indexOf(get().step);
        const next = STEP_ORDER[Math.min(idx + 1, STEP_ORDER.length - 1)];
        set({ step: next, completed: next === "complete" });
      },

      goBack: () => {
        if (!get().canGoBack()) return;
        const idx = STEP_ORDER.indexOf(get().step);
        const prev = STEP_ORDER[Math.max(idx - 1, 0)];
        set({ step: prev });
      },

      canGoBack: () => !NO_BACK_STEPS.has(get().step),

      selectEgg: (egg) => set({ selectedEgg: egg }),
      setCompanionName: (companionName) => set({ companionName }),
      setFirstPromise: (firstPromiseId) => set({ firstPromiseId }),
      complete: () => set({ step: "complete", completed: true }),

      restart: () =>
        set({
          step: "welcome",
          selectedEgg: null,
          companionName: "",
          firstPromiseId: null,
          completed: false,
        }),

      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: "wonderkin-onboarding",
      storage: createJSONStorage(() => AsyncStorage),
      // Never persist hasHydrated itself — it must always start false
      // so app/index.tsx can show a loading state until rehydration
      // genuinely completes on this launch.
      partialize: (state) => ({
        step: state.step,
        selectedEgg: state.selectedEgg,
        companionName: state.companionName,
        firstPromiseId: state.firstPromiseId,
        completed: state.completed,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
