import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import {
  isPrivateWorshipActive,
  trimClosedExemptionHistory,
  type ExemptionPeriod,
  type PrivateWorshipSnapshot,
} from '@/lib/private-worship';

export {
  getActiveExemptionPeriod,
  isPrivateWorshipActive,
  isPrivateWorshipExemptDate,
  shouldMutePrayerNotifications,
} from '@/lib/private-worship';
export type { ExemptionPeriod } from '@/lib/private-worship';

export interface PrivateWorshipState extends PrivateWorshipSnapshot {
  /** Aktif dönemde yalnızca namaz bildirimlerini geçici olarak durdurur. */
  mutePrayerNotifications: boolean;
  startExemption: (dateISO: string) => void;
  endExemption: (dateISO: string) => void;
  setMutePrayerNotifications: (muted: boolean) => void;
  clearClosedPeriods: (keepFromDateISO: string) => void;
  resetAll: () => void;
}

const INITIAL_STATE = {
  periods: [] as ExemptionPeriod[],
  mutePrayerNotifications: true,
};

export const usePrivateWorshipStore = create<PrivateWorshipState>()(
  persist(
    (set) => ({
      ...INITIAL_STATE,
      startExemption: (dateISO) =>
        set((state) => {
          if (isPrivateWorshipActive(state)) return state;
          return { periods: [...state.periods, { startDate: dateISO, endDate: null }] };
        }),
      endExemption: (dateISO) =>
        set((state) => ({
          periods: state.periods.flatMap((period) => {
            if (period.endDate !== null) return [period];
            if (dateISO <= period.startDate) return [];
            return [{ ...period, endDate: dateISO }];
          }),
        })),
      setMutePrayerNotifications: (mutePrayerNotifications) =>
        set({ mutePrayerNotifications }),
      clearClosedPeriods: (keepFromDateISO) =>
        set((state) => ({
          periods: trimClosedExemptionHistory(state.periods, keepFromDateISO),
        })),
      resetAll: () => set({ ...INITIAL_STATE }),
    }),
    {
      name: 'nur-private-worship',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
