import { useSyncExternalStore } from 'react';

import { useSettingsStore } from '@/store/settings';

/** Persist edilen ayarların AsyncStorage'dan yüklenmesini bekler. */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    (onStoreChange) => useSettingsStore.persist.onFinishHydration(onStoreChange),
    () => useSettingsStore.persist.hasHydrated(),
  );
}
