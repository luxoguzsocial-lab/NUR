import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type SavedType = 'ayah' | 'dua' | 'video' | 'aiAnswer' | 'lesson' | 'inspiration' | 'esma';

export interface SavedItem {
  /** `${type}:${refId}` */
  id: string;
  type: SavedType;
  refId: string;
  /** Liste görünümü için başlık */
  title: string;
  /** Kısa önizleme metni */
  preview?: string;
  collection?: string;
  savedAt: string;
  /** İçerik cihazda mı (çevrimdışı erişim durumu) */
  offline: boolean;
}

interface SavedState {
  items: SavedItem[];
  collections: string[];
  toggle: (item: Omit<SavedItem, 'id' | 'savedAt'>) => void;
  isSaved: (type: SavedType, refId: string) => boolean;
  remove: (id: string) => void;
  addCollection: (name: string) => void;
  assignCollection: (id: string, collection: string | undefined) => void;
  resetAll: () => void;
}

export const useSavedStore = create<SavedState>()(
  persist(
    (set, get) => ({
      items: [],
      collections: [],
      toggle: (item) =>
        set((s) => {
          const id = `${item.type}:${item.refId}`;
          const exists = s.items.some((i) => i.id === id);
          return exists
            ? { items: s.items.filter((i) => i.id !== id) }
            : { items: [{ ...item, id, savedAt: new Date().toISOString() }, ...s.items] };
        }),
      isSaved: (type, refId) => get().items.some((i) => i.id === `${type}:${refId}`),
      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      addCollection: (name) =>
        set((s) =>
          s.collections.includes(name) ? s : { collections: [...s.collections, name] },
        ),
      assignCollection: (id, collection) =>
        set((s) => ({
          items: s.items.map((i) => (i.id === id ? { ...i, collection } : i)),
        })),
      resetAll: () => set({ items: [], collections: [] }),
    }),
    { name: 'nur-saved', storage: createJSONStorage(() => AsyncStorage) },
  ),
);
