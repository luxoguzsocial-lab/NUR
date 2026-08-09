import { Platform } from 'react-native';

import { formatHijri, toHijri } from '@/lib/hijri';
import { getPrayerTimesForDate, PRAYER_ORDER } from '@/lib/prayer-times';
import type { PrayerId, SettingsState } from '@/store/settings';

import { setWidgetData } from '../../modules/nur-widget-bridge';

const PRAYER_NAMES_TR: Record<PrayerId, string> = {
  fajr: 'İmsak',
  sunrise: 'Güneş',
  dhuhr: 'Öğle',
  asr: 'İkindi',
  maghrib: 'Akşam',
  isha: 'Yatsı',
};

/**
 * iOS widget'ının timeline'ı için bugün + yarının vakitlerini App Group'a yazar.
 * Şema targets/vakit-widget/index.swift içindeki WidgetPayload ile birebir aynıdır.
 * iOS dışında ve Expo Go'da sessizce atlanır.
 */
export function syncIosWidget(settings: Pick<SettingsState, 'location' | 'calcMethod' | 'madhab' | 'adjustments'>): void {
  if (Platform.OS !== 'ios') return;

  const { location, calcMethod, madhab, adjustments } = settings;
  const now = new Date();
  const prayers: { key: PrayerId; label: string; epoch: number }[] = [];

  for (const dayOffset of [0, 1]) {
    const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() + dayOffset);
    const { times } = getPrayerTimesForDate(
      day, location.latitude, location.longitude, calcMethod, madhab, adjustments,
    );
    for (const p of PRAYER_ORDER) {
      prayers.push({ key: p, label: PRAYER_NAMES_TR[p], epoch: Math.round(times[p].getTime() / 1000) });
    }
  }

  setWidgetData(
    JSON.stringify({
      city: location.cityName,
      hijri: formatHijri(toHijri(now), 'tr'),
      prayers,
    }),
  );
}
