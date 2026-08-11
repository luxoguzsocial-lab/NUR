import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { LocationSetting } from '@/store/settings';

export interface TravelState {
  active: boolean;
  autoDetectEnabled: boolean;
  homeLocation: LocationSetting | null;
  destination: LocationSetting | null;
  pendingDestination: LocationSetting | null;
  lastCheckedAt: number | null;
  dismissedCityName: string | null;
  dismissedAt: number | null;
  setAutoDetectEnabled: (enabled: boolean) => void;
  setPendingDestination: (destination: LocationSetting | null) => void;
  markChecked: (timestamp: number) => void;
  dismissPending: () => void;
  clearDismissed: () => void;
  activate: (currentLocation: LocationSetting, destination: LocationSetting) => void;
  finish: () => void;
  resetAll: () => void;
}

const INITIAL_STATE = {
  active: false,
  autoDetectEnabled: false,
  homeLocation: null,
  destination: null,
  pendingDestination: null,
  lastCheckedAt: null,
  dismissedCityName: null,
  dismissedAt: null,
};

export const useTravelStore = create<TravelState>()(
  persist(
    (set) => ({
      ...INITIAL_STATE,
      setAutoDetectEnabled: (autoDetectEnabled) => set({ autoDetectEnabled }),
      setPendingDestination: (pendingDestination) => set({ pendingDestination }),
      markChecked: (lastCheckedAt) => set({ lastCheckedAt }),
      dismissPending: () =>
        set((state) => ({
          pendingDestination: null,
          dismissedCityName: state.pendingDestination?.cityName ?? state.dismissedCityName,
          dismissedAt: Date.now(),
        })),
      clearDismissed: () => set({ dismissedCityName: null, dismissedAt: null }),
      activate: (currentLocation, destination) =>
        set((state) => ({
          active: true,
          homeLocation: state.active && state.homeLocation ? state.homeLocation : currentLocation,
          destination,
          pendingDestination: null,
          dismissedCityName: null,
          dismissedAt: null,
        })),
      finish: () =>
        set({
          active: false,
          homeLocation: null,
          destination: null,
          pendingDestination: null,
        }),
      resetAll: () => set({ ...INITIAL_STATE }),
    }),
    { name: 'nur-travel', storage: createJSONStorage(() => AsyncStorage) },
  ),
);
