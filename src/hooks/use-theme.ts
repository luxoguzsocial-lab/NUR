import { useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';

import { Colors, type ThemePalette } from '@/constants/theme';
import { getPrayerTimesForDate } from '@/lib/prayer-times';
import { useSettingsStore } from '@/store/settings';

/**
 * Gece penceresi: Akşam vaktinden ertesi günün Güneş (doğuş) vaktine kadar —
 * İmsak, Akşam ve Yatsı pencerelerinin tamamını kapsar.
 */
export function isNightAt(
  now: Date,
  latitude: number,
  longitude: number,
  calcMethod: Parameters<typeof getPrayerTimesForDate>[3],
  madhab: Parameters<typeof getPrayerTimesForDate>[4],
  adjustments: Parameters<typeof getPrayerTimesForDate>[5],
): boolean {
  const { times } = getPrayerTimesForDate(now, latitude, longitude, calcMethod, madhab, adjustments);
  return now.getTime() >= times.maghrib.getTime() || now.getTime() < times.sunrise.getTime();
}

export function useThemeMode(): 'light' | 'dark' {
  const system = useColorScheme();
  const pref = useSettingsStore((s) => s.theme);
  const location = useSettingsStore((s) => s.location);
  const calcMethod = useSettingsStore((s) => s.calcMethod);
  const madhab = useSettingsStore((s) => s.madhab);
  const adjustments = useSettingsStore((s) => s.adjustments);

  // Vakit sınırında (akşam/güneş) tema kendiliğinden dönsün diye dakikalık nabız
  const [, setTick] = useState(0);
  useEffect(() => {
    if (pref !== 'system') return;
    const id = setInterval(() => setTick((t) => (t + 1) % 1_000_000), 60_000);
    return () => clearInterval(id);
  }, [pref]);

  if (pref !== 'system') return pref;

  try {
    return isNightAt(
      new Date(), location.latitude, location.longitude, calcMethod, madhab, adjustments,
    )
      ? 'dark'
      : 'light';
  } catch {
    // Vakit hesabı başarısız olursa (uç koordinatlar) sistem temasına düş
    return system === 'dark' ? 'dark' : 'light';
  }
}

export function useTheme(): ThemePalette {
  return Colors[useThemeMode()];
}
