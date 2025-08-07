import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Contact = {
  name: string;
  address: string;
  network: string;
};

type ContactsStore = {
  contacts: Contact[];
  loadContacts: () => Promise<void>;
  addContact: (contact: Contact) => void;
  deleteContact: (address: string) => void;
};

export const useContactsStore = create<ContactsStore>((set, get) => ({
  contacts: [],

  loadContacts: async () => {
    const raw = await AsyncStorage.getItem('contacts');
    if (raw) {
      set({ contacts: JSON.parse(raw) });
    }
  },

  addContact: (contact) => {
    const updated = [contact, ...get().contacts];
    AsyncStorage.setItem('contacts', JSON.stringify(updated));
    set({ contacts: updated });
  },

  deleteContact: (address: string) => {
  const updated = get().contacts.filter(c => c.address !== address);
  AsyncStorage.setItem('contacts', JSON.stringify(updated));
  set({ contacts: updated });
},

// updateContact: (address: string, updatedContact: Contact) => {
//   const updated = get().contacts.map(c =>
//     c.address === address ? updatedContact : c
//   );
//   AsyncStorage.setItem('contacts', JSON.stringify(updated));
//   set({ contacts: updated });
// },


}));

