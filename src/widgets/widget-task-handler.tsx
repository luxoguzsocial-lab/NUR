import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import type { WidgetTaskHandlerProps } from 'react-native-android-widget';

import { buildDailyJourney, buildGentleWeek } from '@/lib/daily-journey';
import { formatTime, todayISO } from '@/lib/format';
import { formatHijri, toHijri } from '@/lib/hijri';
import { getNextPrayer, getPrayerTimesForDate, PRAYER_ORDER } from '@/lib/prayer-times';
import { isPrivateWorshipExemptDate, type ExemptionPeriod } from '@/lib/private-worship';
import type { CalcMethodId, MadhabId, PrayerId } from '@/store/settings';
import type { DayRecord } from '@/store/tracker';

import { NurBugunWidget } from './nur-bugun-widget';
import { NurVakitWidget, type WidgetPrayerRow } from './nur-vakit-widget';

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
    dailyQuranGoalMinutes?: number;
    weeklyJourneyGoalDays?: number;
  };
}

interface PersistedTracker {
  state?: { days?: Record<string, DayRecord> };
}

interface PersistedProgress {
  state?: { quranMinutesByDay?: Record<string, number> };
}

interface PersistedTasbih {
  state?: { dailyHistory?: Record<string, Record<string, number>> };
}

interface PersistedPrivateWorship {
  state?: { periods?: ExemptionPeriod[] };
}

function parsePersisted<T>(raw: string | null): T | undefined {
  if (!raw) return undefined;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return undefined;
  }
}

async function buildWidgetSnapshot() {
  const [settingsRaw, trackerRaw, progressRaw, tasbihRaw, privateWorshipRaw] = await Promise.all([
    AsyncStorage.getItem('nur-settings'),
    AsyncStorage.getItem('nur-tracker'),
    AsyncStorage.getItem('nur-progress'),
    AsyncStorage.getItem('nur-tasbih'),
    AsyncStorage.getItem('nur-private-worship'),
  ]);

  const persistedSettings = parsePersisted<PersistedSettings>(settingsRaw)?.state;
  const trackerDays = parsePersisted<PersistedTracker>(trackerRaw)?.state?.days ?? {};
  const quranMinutesByDay = parsePersisted<PersistedProgress>(progressRaw)?.state?.quranMinutesByDay ?? {};
  const tasbihHistory = parsePersisted<PersistedTasbih>(tasbihRaw)?.state?.dailyHistory ?? {};
  const privateWorship = {
    periods: parsePersisted<PersistedPrivateWorship>(privateWorshipRaw)?.state?.periods ?? [],
  };

  const latitude = persistedSettings?.location?.latitude ?? 41.0082;
  const longitude = persistedSettings?.location?.longitude ?? 28.9784;
  const cityName = persistedSettings?.location?.cityName ?? 'İstanbul';
  const calcMethod = persistedSettings?.calcMethod ?? 'diyanet';
  const madhab = persistedSettings?.madhab ?? 'hanafi';
  const adjustments = persistedSettings?.adjustments ?? {
    fajr: 0,
    sunrise: 0,
    dhuhr: 0,
    asr: 0,
    maghrib: 0,
    isha: 0,
  };
  const now = new Date();
  const dateISO = todayISO(now);
  const next = getNextPrayer(now, latitude, longitude, calcMethod, madhab, adjustments);
  const remainingMin = Math.max(0, Math.round(next.remainingMs / 60_000));
  const hours = Math.floor(remainingMin / 60);
  const minutes = remainingMin % 60;
  const remainingText = hours > 0 ? `${hours} sa ${minutes} dk kaldı` : `${minutes} dk kaldı`;

  const rowDay =
    next.time.getDate() !== now.getDate() && next.prayer === 'fajr'
      ? new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
      : now;
  const dayTimes = getPrayerTimesForDate(rowDay, latitude, longitude, calcMethod, madhab, adjustments);
  const todayTimes = getPrayerTimesForDate(now, latitude, longitude, calcMethod, madhab, adjustments);
  const rows: WidgetPrayerRow[] = PRAYER_ORDER.map((prayer) => ({
    label: PRAYER_NAMES_TR[prayer],
    time: formatTime(dayTimes.times[prayer]),
    isNext: prayer === next.prayer,
  }));

  const anchors: PrayerId[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
  let previousTime: Date | null = null;
  for (const prayer of anchors) {
    const time = todayTimes.times[prayer];
    if (time.getTime() <= now.getTime() && (!previousTime || time.getTime() > previousTime.getTime())) {
      previousTime = time;
    }
  }
  if (!previousTime) {
    const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
    previousTime = getPrayerTimesForDate(
      yesterday,
      latitude,
      longitude,
      calcMethod,
      madhab,
      adjustments,
    ).times.isha;
  }
  const span = next.time.getTime() - previousTime.getTime();
  const prayerProgress = span > 0 ? (now.getTime() - previousTime.getTime()) / span : 0;
  const night =
    now.getTime() >= todayTimes.times.maghrib.getTime() ||
    now.getTime() < todayTimes.times.sunrise.getTime();

  const dhikrByDay = Object.fromEntries(
    Object.entries(tasbihHistory).map(([date, counts]) => [
      date,
      Object.values(counts).reduce((sum, count) => sum + count, 0),
    ]),
  );
  const journey = buildDailyJourney({
    now,
    prayerTimes: todayTimes.times,
    dayRecord: trackerDays[dateISO],
    quranMinutes: quranMinutesByDay[dateISO] ?? 0,
    quranGoalMinutes: persistedSettings?.dailyQuranGoalMinutes ?? 10,
    dhikrCount: dhikrByDay[dateISO] ?? 0,
    prayerExempt: isPrivateWorshipExemptDate(privateWorship, dateISO, dateISO),
  });
  const mondayOffset = (now.getDay() + 6) % 7;
  const exemptDates = Array.from({ length: mondayOffset + 1 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - mondayOffset + index);
    return todayISO(date);
  }).filter((iso) => isPrivateWorshipExemptDate(privateWorship, iso, dateISO));
  const week = buildGentleWeek({
    now,
    trackerDays,
    quranMinutesByDay,
    dhikrByDay,
    goalDays: persistedSettings?.weeklyJourneyGoalDays ?? 4,
    exemptDates,
  });
  const nextTask = journey.tasks.find((task) => !task.completed)?.id;
  const nextAction =
    nextTask === 'prayer'
      ? `${PRAYER_NAMES_TR[journey.duePrayer]} namazını kaydet`
      : nextTask === 'quran'
        ? "5 dk Kur'an oku"
        : nextTask === 'dhikr'
          ? journey.period === 'morning'
            ? '33 sabah zikri'
            : journey.period === 'evening' || journey.period === 'night'
              ? '33 akşam zikri'
              : '33 zikir ile mola ver'
          : 'Bugünün yolculuğu tamam';

  return {
    prayerName: PRAYER_NAMES_TR[next.prayer],
    prayerTime: formatTime(next.time),
    remainingText,
    cityName,
    hijriText: formatHijri(toHijri(now), 'tr'),
    prayerProgress,
    rows,
    night,
    journey,
    week,
    nextAction,
  };
}

export async function renderWidgetForName(widgetName: string): Promise<React.JSX.Element> {
  const snapshot = await buildWidgetSnapshot();
  if (widgetName === 'NurBugun') {
    return (
      <NurBugunWidget
        prayerName={snapshot.prayerName}
        prayerTime={snapshot.prayerTime}
        remainingText={snapshot.remainingText}
        journeyCompleted={snapshot.journey.completed}
        journeyTotal={snapshot.journey.total}
        weekCompleted={snapshot.week.goalDays === 0 ? 1 : snapshot.week.completedDays}
        weekGoal={Math.max(1, snapshot.week.goalDays)}
        nextAction={snapshot.nextAction}
        night={snapshot.night}
      />
    );
  }

  return (
    <NurVakitWidget
      prayerName={snapshot.prayerName}
      time={snapshot.prayerTime}
      remainingText={snapshot.remainingText}
      cityName={snapshot.cityName}
      hijriText={snapshot.hijriText}
      progress={snapshot.prayerProgress}
      rows={snapshot.rows}
      night={snapshot.night}
    />
  );
}

/** Android WorkManager ve widget tiklamalari icin ortak gorev. */
export async function widgetTaskHandler(props: WidgetTaskHandlerProps): Promise<void> {
  props.renderWidget(await renderWidgetForName(props.widgetInfo.widgetName));
}
