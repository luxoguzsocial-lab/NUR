import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import type { WidgetTaskHandlerProps } from 'react-native-android-widget';

import { formatTime } from '@/lib/format';
import { getNextPrayer } from '@/lib/prayer-times';
import type { CalcMethodId, MadhabId, PrayerId } from '@/store/settings';

import { NurVakitWidget } from './nur-vakit-widget';

const PRAYER_NAMES_TR: Record<PrayerId, string> = {
  fajr: 'İmsak',
  sunrise: 'Güneş',
  dhuhr: 'Öğle',
  asr: 'İkindi',
  maghrib: 'Akşam',
  isha: 'Yatsı',
};

interface PersistedSettings {
  state?: {
    location?: { latitude: number; longitude: number; cityName: string };
    calcMethod?: CalcMethodId;
    madhab?: MadhabId;
    adjustments?: Record<PrayerId, number>;
  };
}

/**
 * Widget güncelleme görevi: AsyncStorage'daki ayarlardan sıradaki vakti
 * hesaplar ve widget'ı çizer. Android WorkManager tarafından periyodik
 * olarak (~30 dk) ve widget eklendiğinde çağrılır.
 */
export async function widgetTaskHandler(props: WidgetTaskHandlerProps): Promise<void> {
  let latitude = 41.0082;
  let longitude = 28.9784;
  let cityName = 'İstanbul';
  let calcMethod: CalcMethodId = 'diyanet';
  let madhab: MadhabId = 'hanafi';
  let adjustments: Record<PrayerId, number> = {
    fajr: 0, sunrise: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0,
  };

  try {
    const raw = await AsyncStorage.getItem('nur-settings');
    if (raw) {
      const parsed = JSON.parse(raw) as PersistedSettings;
      const st = parsed.state;
      if (st?.location) {
        latitude = st.location.latitude;
        longitude = st.location.longitude;
        cityName = st.location.cityName;
      }
      if (st?.calcMethod) calcMethod = st.calcMethod;
      if (st?.madhab) madhab = st.madhab;
      if (st?.adjustments) adjustments = st.adjustments;
    }
  } catch {
    // Ayar okunamazsa varsayılanlarla devam et.
  }

  const now = new Date();
  const next = getNextPrayer(now, latitude, longitude, calcMethod, madhab, adjustments);
  const remainingMin = Math.max(0, Math.round(next.remainingMs / 60_000));
  const hours = Math.floor(remainingMin / 60);
  const mins = remainingMin % 60;
  const remainingText =
    hours > 0 ? `${hours} sa ${mins} dk kaldı` : `${mins} dk kaldı`;

  props.renderWidget(
    <NurVakitWidget
      prayerName={PRAYER_NAMES_TR[next.prayer]}
      time={formatTime(next.time)}
      remainingText={remainingText}
      cityName={cityName}
    />,
  );
}
