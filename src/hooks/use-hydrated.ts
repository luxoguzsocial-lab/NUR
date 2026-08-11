import { useSyncExternalStore } from 'react';

import { useSettingsStore } from '@/store/settings';
import { usePrivateWorshipStore } from '@/store/private-worship';
import { useTravelStore } from '@/store/travel';

/** Persist edilen ayarların AsyncStorage'dan yüklenmesini bekler. */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    (onStoreChange) => {
      const unsubscribers = [
        useSettingsStore.persist.onFinishHydration(onStoreChange),
        usePrivateWorshipStore.persist.onFinishHydration(onStoreChange),
        useTravelStore.persist.onFinishHydration(onStoreChange),
      ];
      return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
    },
    () =>
      useSettingsStore.persist.hasHydrated() &&
      usePrivateWorshipStore.persist.hasHydrated() &&
      useTravelStore.persist.hasHydrated(),
    () => false,
  );
}
