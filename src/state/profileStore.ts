import { create } from "zustand";
import { Profile, Progression, Currencies } from "@apptypes";

interface ProfileStoreState {
  profile: Profile | null;
  progression: Progression | null;
  currencies: Currencies | null;
  setProfile: (p: Profile | null) => void;
  setProgression: (p: Progression | null) => void;
  setCurrencies: (c: Currencies | null) => void;
}

export const useProfileStore = create<ProfileStoreState>((set) => ({
  profile: null,
  progression: null,
  currencies: null,
  setProfile: (profile) => set({ profile }),
  setProgression: (progression) => set({ progression }),
  setCurrencies: (currencies) => set({ currencies }),
}));
