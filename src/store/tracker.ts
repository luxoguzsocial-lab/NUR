import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { PrayerId } from '@/store/settings';

export type TrackedPrayer = Exclude<PrayerId, 'sunrise'>;

export interface DayRecord {
  prayers: Partial<Record<TrackedPrayer, boolean>>;
  fasting?: boolean;
  dhikrCount?: number;
}

/**
 * İbadet takibi — veriler yalnızca cihazda tutulur, hiçbir sosyal
 * karşılaştırma/sıralama/puanlama amaçlı kullanılamaz (bkz. docs/P0-SPEC.md #20).
 */
interface TrackerState {
  /** YYYY-MM-DD -> kayıt */
  days: Record<string, DayRecord>;
  /** Kaza borcu: vakit -> kalan adet (yalnızca kullanıcıya görünür) */
  qada: Record<TrackedPrayer, number>;
  /** Kaza oruç borcu (gün) */
  qadaFasting: number;
  togglePrayer: (dateISO: string, prayer: TrackedPrayer) => void;
  setQada: (prayer: TrackedPrayer, count: number) => void;
  decrementQada: (prayer: TrackedPrayer) => void;
  setQadaFasting: (days: number) => void;
  decrementQadaFasting: () => void;
  toggleFasting: (dateISO: string) => void;
  addDhikr: (dateISO: string, count: number) => void;
  resetAll: () => void;
}

export const useTrackerStore = create<TrackerState>()(
  persist(
    (set) => ({
      days: {},
      qada: { fajr: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0 },
      qadaFasting: 0,
      setQada: (prayer, count) =>
        set((s) => ({ qada: { ...s.qada, [prayer]: Math.max(0, count) } })),
      decrementQada: (prayer) =>
        set((s) => ({ qada: { ...s.qada, [prayer]: Math.max(0, (s.qada[prayer] ?? 0) - 1) } })),
      setQadaFasting: (days) => set({ qadaFasting: Math.max(0, days) }),
      decrementQadaFasting: () => set((s) => ({ qadaFasting: Math.max(0, s.qadaFasting - 1) })),
      togglePrayer: (dateISO, prayer) =>
        set((s) => {
          const day = s.days[dateISO] ?? { prayers: {} };
          return {
            days: {
              ...s.days,
              [dateISO]: {
                ...day,
                prayers: { ...day.prayers, [prayer]: !day.prayers[prayer] },
              },
            },
          };
        }),
      toggleFasting: (dateISO) =>
        set((s) => {
          const day = s.days[dateISO] ?? { prayers: {} };
          return { days: { ...s.days, [dateISO]: { ...day, fasting: !day.fasting } } };
        }),
      addDhikr: (dateISO, count) =>
        set((s) => {
          const day = s.days[dateISO] ?? { prayers: {} };
          return {
            days: {
              ...s.days,
              [dateISO]: { ...day, dhikrCount: (day.dhikrCount ?? 0) + count },
            },
          };
        }),
      resetAll: () => set({ days: {}, qada: { fajr: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0 }, qadaFasting: 0 }),
    }),
    { name: 'nur-tracker', storage: createJSONStorage(() => AsyncStorage) },
  ),
);
