import { Platform } from 'react-native';

import { buildDailyJourney, buildGentleWeek } from '@/lib/daily-journey';
import { todayISO } from '@/lib/format';
import { formatHijri, toHijri } from '@/lib/hijri';
import { getPrayerTimesForDate, PRAYER_ORDER } from '@/lib/prayer-times';
import { isPrivateWorshipExemptDate, usePrivateWorshipStore } from '@/store/private-worship';
import { useProgressStore } from '@/store/progress';
import type { PrayerId, SettingsState } from '@/store/settings';
import { useTasbihStore } from '@/store/tasbih';
import { useTrackerStore } from '@/store/tracker';

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
export function syncIosWidget(
  settings: Pick<
    SettingsState,
    | 'location'
    | 'calcMethod'
    | 'madhab'
    | 'adjustments'
    | 'dailyQuranGoalMinutes'
    | 'weeklyJourneyGoalDays'
  >,
): void {
  if (Platform.OS !== 'ios') return;

  const { location, calcMethod, madhab, adjustments } = settings;
  const now = new Date();
  const dateISO = todayISO(now);
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

  const trackerDays = useTrackerStore.getState().days;
  const quranMinutesByDay = useProgressStore.getState().quranMinutesByDay;
  const tasbihHistory = useTasbihStore.getState().dailyHistory;
  const dhikrByDay = Object.fromEntries(
    Object.entries(tasbihHistory).map(([date, counts]) => [
      date,
      Object.values(counts).reduce((sum, count) => sum + count, 0),
    ]),
  );
  const todayTimes = getPrayerTimesForDate(
    now,
    location.latitude,
    location.longitude,
    calcMethod,
    madhab,
    adjustments,
  );
  const journey = buildDailyJourney({
    now,
    prayerTimes: todayTimes.times,
    dayRecord: trackerDays[dateISO],
    quranMinutes: quranMinutesByDay[dateISO] ?? 0,
    quranGoalMinutes: settings.dailyQuranGoalMinutes,
    dhikrCount: dhikrByDay[dateISO] ?? 0,
    prayerExempt: isPrivateWorshipExemptDate(usePrivateWorshipStore.getState(), dateISO, dateISO),
  });
  const mondayOffset = (now.getDay() + 6) % 7;
  const exemptDates = Array.from({ length: mondayOffset + 1 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - mondayOffset + index);
    return todayISO(date);
  }).filter((iso) =>
    isPrivateWorshipExemptDate(usePrivateWorshipStore.getState(), iso, dateISO),
  );
  const week = buildGentleWeek({
    now,
    trackerDays,
    quranMinutesByDay,
    dhikrByDay,
    goalDays: settings.weeklyJourneyGoalDays,
    exemptDates,
  });
  const nextTask = journey.tasks.find((task) => !task.completed)?.id;
  const nextAction =
    nextTask === 'prayer'
      ? `${PRAYER_NAMES_TR[journey.duePrayer]} namazını kaydet`
      : nextTask === 'quran'
        ? "5 dk Kur'an oku"
        : nextTask === 'dhikr'
          ? '33 zikir ile kısa bir mola'
          : 'Bugünün yolculuğu tamam';

  setWidgetData(
    JSON.stringify({
      city: location.cityName,
      hijri: formatHijri(toHijri(now), 'tr'),
      prayers,
      journey: {
        completed: journey.completed,
        total: journey.total,
        weekCompleted: week.goalDays === 0 ? 1 : week.completedDays,
        weekGoal: Math.max(1, week.goalDays),
        nextAction,
      },
    }),
  );
}
