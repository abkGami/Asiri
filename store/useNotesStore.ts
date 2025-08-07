import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Note = {
  id: string;
  title: string;
  details: string;
  createdAt: number;
  updatedAt: number;
};

type NotesStore = {
  notes: Note[];
  loadNotes: () => Promise<void>;
  addOrUpdateNote: (note: Partial<Note>) => void;
  deleteNote: (id: string) => void;
};

export const useNotesStore = create<NotesStore>((set, get) => ({
  notes: [],

  loadNotes: async () => {
    const raw = await AsyncStorage.getItem('notes');
    if (raw) {
      const notes = JSON.parse(raw) as Note[];
      const sorted = notes.sort((a, b) => b.updatedAt - a.updatedAt);
      set({ notes: sorted });
    }
  },

  addOrUpdateNote: (note) => {
    const notes = get().notes;
    const now = Date.now();
    const existing = notes.find((n) => n.id === note.id);

    const updatedNote = existing
      ? { ...existing, ...note, updatedAt: now }
      : {
          id: note.id || Date.now().toString(),
          title: note.title || "",
          details: note.details || "",
          createdAt: now,
          updatedAt: now,
        };

    const updatedNotes = existing
      ? notes.map((n) => (n.id === updatedNote.id ? updatedNote : n))
      : [updatedNote, ...notes];

    AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
    set({ notes: updatedNotes });
  },

  deleteNote: (id) => {
    const filtered = get().notes.filter((n) => n.id !== id);
    AsyncStorage.setItem('notes', JSON.stringify(filtered));
    set({ notes: filtered });
  },
}));
