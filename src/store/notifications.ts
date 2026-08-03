import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type NotificationCategory =
  | 'prayer'
  | 'quranGoal'
  | 'khatm'
  | 'memorization'
  | 'learning'
  | 'religiousDay'
  | 'ramadan'
  | 'newContent';

export interface AppNotification {
  id: string;
  category: NotificationCategory;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
}

interface NotificationState {
  items: AppNotification[];
  push: (n: Omit<AppNotification, 'id' | 'createdAt' | 'read'>) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      items: [],
      push: (n) =>
        set((s) => ({
          items: [
            {
              ...n,
              id: `${n.category}-${s.items.length}-${new Date().getTime()}`,
              createdAt: new Date().toISOString(),
              read: false,
            },
            ...s.items,
          ].slice(0, 200),
        })),
      markRead: (id) =>
        set((s) => ({ items: s.items.map((i) => (i.id === id ? { ...i, read: true } : i)) })),
      markAllRead: () => set((s) => ({ items: s.items.map((i) => ({ ...i, read: true })) })),
      clearAll: () => set({ items: [] }),
    }),
    { name: 'nur-notifications', storage: createJSONStorage(() => AsyncStorage) },
  ),
);
