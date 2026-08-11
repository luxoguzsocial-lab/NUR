import type { PrayerId } from '@/store/settings';
import type { DayRecord, TrackedPrayer } from '@/store/tracker';

const TRACKED_PRAYERS: TrackedPrayer[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

export type JourneyPeriod = 'morning' | 'day' | 'evening' | 'night';
export type JourneyTaskId = 'prayer' | 'quran' | 'dhikr';

export interface JourneyTask {
  id: JourneyTaskId;
  completed: boolean;
  current: number;
  target: number;
}

export interface DailyJourney {
  period: JourneyPeriod;
  duePrayer: TrackedPrayer;
  tasks: JourneyTask[];
  completed: number;
  total: number;
}

export interface DailyJourneyInput {
  now: Date;
  prayerTimes: Record<PrayerId, Date>;
  dayRecord?: DayRecord;
  quranMinutes: number;
  quranGoalMinutes: number;
  dhikrCount: number;
  /** Muaf günde namaz görevi yolculuktan tamamen çıkarılır. */
  prayerExempt?: boolean;
}

export interface GentleWeekDay {
  dateISO: string;
  date: Date;
  completed: boolean;
  isToday: boolean;
  isFuture: boolean;
  isExempt: boolean;
  meaningfulAreas: number;
}

export interface GentleWeek {
  days: GentleWeekDay[];
  completedDays: number;
  goalDays: number;
  goalMet: boolean;
  remainingDays: number;
}

export interface GentleWeekInput {
  now: Date;
  trackerDays: Record<string, DayRecord>;
  quranMinutesByDay: Record<string, number>;
  dhikrByDay: Record<string, number>;
  goalDays: number;
  exemptDates?: readonly string[];
}

export function localDateISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getJourneyPeriod(hour: number): JourneyPeriod {
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'day';
  if (hour >= 17 && hour < 22) return 'evening';
  return 'night';
}

export function getDuePrayer(
  now: Date,
  prayerTimes: Record<PrayerId, Date>,
): TrackedPrayer {
  let due: TrackedPrayer = 'fajr';
  for (const prayer of TRACKED_PRAYERS) {
    if (prayerTimes[prayer].getTime() <= now.getTime()) due = prayer;
  }
  return due;
}

export function buildDailyJourney(input: DailyJourneyInput): DailyJourney {
  const duePrayer = getDuePrayer(input.now, input.prayerTimes);
  const quranTarget = Math.max(1, Math.min(5, input.quranGoalMinutes));
  const tasks: JourneyTask[] = [
    ...(!input.prayerExempt
      ? [{
          id: 'prayer' as const,
          completed: !!input.dayRecord?.prayers[duePrayer],
          current: input.dayRecord?.prayers[duePrayer] ? 1 : 0,
          target: 1,
        }]
      : []),
    {
      id: 'quran',
      completed: input.quranMinutes >= quranTarget,
      current: Math.min(input.quranMinutes, quranTarget),
      target: quranTarget,
    },
    {
      id: 'dhikr',
      completed: input.dhikrCount >= 33,
      current: Math.min(input.dhikrCount, 33),
      target: 33,
    },
  ];

  return {
    period: getJourneyPeriod(input.now.getHours()),
    duePrayer,
    tasks,
    completed: tasks.filter((task) => task.completed).length,
    total: tasks.length,
  };
}

function meaningfulAreasForDay(
  day: DayRecord | undefined,
  quranMinutes: number,
  dhikrCount: number,
): number {
  const hasPrayer = TRACKED_PRAYERS.some((prayer) => !!day?.prayers[prayer]);
  return [hasPrayer, quranMinutes >= 5, dhikrCount >= 33].filter(Boolean).length;
}

export function buildGentleWeek(input: GentleWeekInput): GentleWeek {
  const today = new Date(input.now.getFullYear(), input.now.getMonth(), input.now.getDate());
  const mondayOffset = (today.getDay() + 6) % 7;
  const monday = new Date(today);
  monday.setDate(today.getDate() - mondayOffset);
  const exemptDates = new Set(input.exemptDates ?? []);

  const days = Array.from({ length: 7 }, (_, index): GentleWeekDay => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    const dateISO = localDateISO(date);
    const meaningfulAreas = meaningfulAreasForDay(
      input.trackerDays[dateISO],
      input.quranMinutesByDay[dateISO] ?? 0,
      input.dhikrByDay[dateISO] ?? 0,
    );
    const isToday = date.getTime() === today.getTime();
    const isFuture = date.getTime() > today.getTime();
    const isExempt = !isFuture && exemptDates.has(dateISO);
    return {
      dateISO,
      date,
      meaningfulAreas,
      isToday,
      isFuture,
      isExempt,
      // Devamlilik kusursuzluk degildir: uc alandan herhangi ikisi yeterlidir.
      // Muaf günde namaz aranmaz; Kur'an + zikir varsa gün yine anlamlı sayılabilir.
      completed: !isFuture && meaningfulAreas >= 2,
    };
  });

  const completedDays = days.filter((day) => day.completed).length;
  const eligibleDays = days.filter((day) => !day.isExempt).length;
  const goalDays = Math.min(eligibleDays, Math.max(1, Math.round(input.goalDays)));
  return {
    days,
    completedDays,
    goalDays,
    goalMet: completedDays >= goalDays,
    remainingDays: Math.max(0, goalDays - completedDays),
  };
}
