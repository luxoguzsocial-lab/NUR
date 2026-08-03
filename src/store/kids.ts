import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

/** Çocuk Yolu ilerlemesi — yalnızca cihazda tutulur. */
interface KidsState {
  /** Öğrenildi işaretlenen harfler (harf karakteri) */
  learnedLetters: string[];
  /** Öğrenildi işaretlenen harekeler (hareke adı) */
  learnedHarakat: string[];
  /** Dinlenip "ezberledim" işaretlenen sureler */
  learnedSurahs: number[];

  toggleLetter: (char: string) => void;
  toggleHaraka: (name: string) => void;
  toggleSurah: (surah: number) => void;
  resetKids: () => void;
}

function toggle<T>(list: T[], item: T): T[] {
  return list.includes(item) ? list.filter((x) => x !== item) : [...list, item];
}

export const useKidsStore = create<KidsState>()(
  persist(
    (set) => ({
      learnedLetters: [],
      learnedHarakat: [],
      learnedSurahs: [],
      toggleLetter: (char) => set((s) => ({ learnedLetters: toggle(s.learnedLetters, char) })),
      toggleHaraka: (name) => set((s) => ({ learnedHarakat: toggle(s.learnedHarakat, name) })),
      toggleSurah: (surah) => set((s) => ({ learnedSurahs: toggle(s.learnedSurahs, surah) })),
      resetKids: () => set({ learnedLetters: [], learnedHarakat: [], learnedSurahs: [] }),
    }),
    { name: 'nur-kids', storage: createJSONStorage(() => AsyncStorage) },
  ),
);
