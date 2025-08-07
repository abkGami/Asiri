import { create } from "zustand";

type Entry = {
  id: string;
  title?: string;
  site?: string;
  username?: string;
  value?: string;
};

type VaultStore = {
  seedPhrases: Entry[];
  passwords: Entry[];
  nextOfKin: { username: string } | null;
  setSeedPhrases: (data: Entry[]) => void;
  setPasswords: (data: Entry[]) => void;
  setNextOfKin: (nok: { username: string }) => void;
};

export const useVaultStore = create<VaultStore>((set) => ({
  seedPhrases: [],
  passwords: [],
  nextOfKin: null,
  setSeedPhrases: (data) => set({ seedPhrases: data }),
  setPasswords: (data) => set({ passwords: data }),
  setNextOfKin: (nok) => set({ nextOfKin: nok }),
}));
