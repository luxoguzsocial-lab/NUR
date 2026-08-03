import {
  CalculationMethod,
  CalculationParameters,
  Coordinates,
  Madhab,
  PrayerTimes,
} from 'adhan';

import type { CalcMethodId, MadhabId, PrayerId } from '@/store/settings';

export interface DayPrayerTimes {
  date: Date;
  times: Record<PrayerId, Date>;
  methodId: CalcMethodId;
}

export interface NextPrayerInfo {
  prayer: PrayerId;
  time: Date;
  /** Kalan süre (ms) */
  remainingMs: number;
}

export const PRAYER_ORDER: PrayerId[] = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'];

export function calculationParams(methodId: CalcMethodId, madhab: MadhabId): CalculationParameters {
  const params = (() => {
    switch (methodId) {
      case 'diyanet':
        return CalculationMethod.Turkey();
      case 'mwl':
        return CalculationMethod.MuslimWorldLeague();
      case 'ummalqura':
        return CalculationMethod.UmmAlQura();
      case 'isna':
        return CalculationMethod.NorthAmerica();
      case 'egyptian':
        return CalculationMethod.Egyptian();
      case 'karachi':
        return CalculationMethod.Karachi();
    }
  })();
  params.madhab = madhab === 'hanafi' ? Madhab.Hanafi : Madhab.Shafi;
  return params;
}

function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60_000);
}

export function getPrayerTimesForDate(
  date: Date,
  latitude: number,
  longitude: number,
  methodId: CalcMethodId,
  madhab: MadhabId,
  adjustments: Record<PrayerId, number>,
): DayPrayerTimes {
  const coordinates = new Coordinates(latitude, longitude);
  const pt = new PrayerTimes(coordinates, date, calculationParams(methodId, madhab));
  return {
    date,
    methodId,
    times: {
      fajr: addMinutes(pt.fajr, adjustments.fajr),
      sunrise: addMinutes(pt.sunrise, adjustments.sunrise),
      dhuhr: addMinutes(pt.dhuhr, adjustments.dhuhr),
      asr: addMinutes(pt.asr, adjustments.asr),
      maghrib: addMinutes(pt.maghrib, adjustments.maghrib),
      isha: addMinutes(pt.isha, adjustments.isha),
    },
  };
}

/**
 * Bir sonraki namazı bulur; bugünün bütün vakitleri geçtiyse yarının imsakını döndürür.
 * Güneş (sunrise) namaz sayılmadığı için sonraki vakit hesabında atlanır.
 */
export function getNextPrayer(
  now: Date,
  latitude: number,
  longitude: number,
  methodId: CalcMethodId,
  madhab: MadhabId,
  adjustments: Record<PrayerId, number>,
): NextPrayerInfo {
  for (const dayOffset of [0, 1]) {
    const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() + dayOffset);
    const { times } = getPrayerTimesForDate(day, latitude, longitude, methodId, madhab, adjustments);
    for (const prayer of PRAYER_ORDER) {
      if (prayer === 'sunrise') continue;
      const t = times[prayer];
      if (t.getTime() > now.getTime()) {
        return { prayer, time: t, remainingMs: t.getTime() - now.getTime() };
      }
    }
  }
  // Kutup bölgeleri gibi uç durumlar için emniyet: yarının öğlesi
  const fallbackDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const { times } = getPrayerTimesForDate(
    fallbackDay, latitude, longitude, methodId, madhab, adjustments,
  );
  return {
    prayer: 'dhuhr',
    time: times.dhuhr,
    remainingMs: times.dhuhr.getTime() - now.getTime(),
  };
}

export function getMonthlyPrayerTimes(
  year: number,
  monthIndex: number,
  latitude: number,
  longitude: number,
  methodId: CalcMethodId,
  madhab: MadhabId,
  adjustments: Record<PrayerId, number>,
): DayPrayerTimes[] {
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const result: DayPrayerTimes[] = [];
  for (let day = 1; day <= daysInMonth; day++) {
    result.push(
      getPrayerTimesForDate(
        new Date(year, monthIndex, day), latitude, longitude, methodId, madhab, adjustments,
      ),
    );
  }
  return result;
}
