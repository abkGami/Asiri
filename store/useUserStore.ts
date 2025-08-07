// stores/useUserStore.ts
import { create } from 'zustand';
// import { mmkv } from '@/libs/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';


type UserStore = {
  username: string;
  setUsername: (username: string) => void;
  loadUsername: () => Promise<void>;
};

export const useUserStore = create<UserStore>((set) => ({
  username: '',
  setUsername: (username: string) => {
    AsyncStorage.setItem('username', username);
    set({ username });
  },
  loadUsername: async () => {
    const stored = await AsyncStorage.getItem('username');
    if (stored) {
      set({ username: stored });
    }
  },
}));
