import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

/**
 * Kur'an Okuma Koçu ilerlemesi — yalnızca cihazda tutulur.
 *
 * Seviye, kullanıcının kendi değerlendirmesidir (puan/rozet değildir):
 *   1 = zorlandım · 2 = fena değil · 3 = akıcı
 */
export type CoachLevel = 1 | 2 | 3;

export interface CoachSessionLog {
  dateISO: string;
  /** Çalışılan ayet sayısı (tekrarlar dahil değil, benzersiz ayet) */
  studied: number;
  /** "Zorlandım" işaretlenen ayet sayısı */
  struggled: number;
  surah: number;
}

export interface CoachPosition {
  surah: number;
  /** Ayet numarası (1 tabanlı) */
  ayah: number;
}

interface CoachState {
  /** "sure:ayet" -> son değerlendirme seviyesi */
  levels: Record<string, CoachLevel>;
  lastPosition: CoachPosition | null;
  /** Son oturum kayıtları (en yenisi başta, en çok 30) */
  sessions: CoachSessionLog[];

  rateAyah: (surah: number, ayah: number, level: CoachLevel) => void;
  setLastPosition: (pos: CoachPosition | null) => void;
  logSession: (log: CoachSessionLog) => void;
  resetCoach: () => void;
}

export function coachKey(surah: number, ayah: number): string {
  return `${surah}:${ayah}`;
}

export const useCoachStore = create<CoachState>()(
  persist(
    (set) => ({
      levels: {},
      lastPosition: null,
      sessions: [],
      rateAyah: (surah, ayah, level) =>
        set((s) => ({ levels: { ...s.levels, [coachKey(surah, ayah)]: level } })),
      setLastPosition: (pos) => set({ lastPosition: pos }),
      logSession: (log) => set((s) => ({ sessions: [log, ...s.sessions].slice(0, 30) })),
      resetCoach: () => set({ levels: {}, lastPosition: null, sessions: [] }),
    }),
    { name: 'nur-coach', storage: createJSONStorage(() => AsyncStorage) },
  ),
);
