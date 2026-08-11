import { buildDailyJourney, buildGentleWeek, getJourneyPeriod } from '../daily-journey';

const prayerTimes = {
  fajr: new Date(2026, 7, 10, 4, 30),
  sunrise: new Date(2026, 7, 10, 6, 0),
  dhuhr: new Date(2026, 7, 10, 13, 15),
  asr: new Date(2026, 7, 10, 17, 30),
  maghrib: new Date(2026, 7, 10, 20, 15),
  isha: new Date(2026, 7, 10, 21, 45),
};

describe('daily journey', () => {
  it('selects the latest due prayer and derives three gentle tasks', () => {
    const journey = buildDailyJourney({
      now: new Date(2026, 7, 10, 18, 0),
      prayerTimes,
      dayRecord: { prayers: { asr: true } },
      quranMinutes: 5,
      quranGoalMinutes: 10,
      dhikrCount: 12,
    });

    expect(journey.period).toBe('evening');
    expect(journey.duePrayer).toBe('asr');
    expect(journey.completed).toBe(2);
    expect(journey.tasks.find((task) => task.id === 'dhikr')?.target).toBe(33);
  });

  it('caps the journey Quran task at five minutes', () => {
    const journey = buildDailyJourney({
      now: new Date(2026, 7, 10, 8, 0),
      prayerTimes,
      quranMinutes: 4,
      quranGoalMinutes: 20,
      dhikrCount: 0,
    });
    expect(journey.tasks.find((task) => task.id === 'quran')).toMatchObject({
      current: 4,
      target: 5,
      completed: false,
    });
  });

  it('removes prayer tracking from an exempt day without penalizing other practices', () => {
    const journey = buildDailyJourney({
      now: new Date(2026, 7, 10, 18, 0),
      prayerTimes,
      quranMinutes: 5,
      quranGoalMinutes: 10,
      dhikrCount: 33,
      prayerExempt: true,
    });
    expect(journey.tasks.map((task) => task.id)).toEqual(['quran', 'dhikr']);
    expect(journey).toMatchObject({ completed: 2, total: 2 });
  });

  it('uses calm day periods', () => {
    expect(getJourneyPeriod(6)).toBe('morning');
    expect(getJourneyPeriod(14)).toBe('day');
    expect(getJourneyPeriod(19)).toBe('evening');
    expect(getJourneyPeriod(1)).toBe('night');
  });
});

describe('gentle week', () => {
  it('counts meaningful days without resetting or requiring perfection', () => {
    const week = buildGentleWeek({
      now: new Date(2026, 7, 12, 12, 0), // Wednesday
      trackerDays: {
        '2026-08-10': { prayers: { fajr: true } },
        '2026-08-11': { prayers: { dhuhr: true } },
      },
      quranMinutesByDay: { '2026-08-10': 5, '2026-08-12': 8 },
      dhikrByDay: { '2026-08-11': 33, '2026-08-12': 33 },
      goalDays: 4,
    });

    expect(week.completedDays).toBe(3);
    expect(week.remainingDays).toBe(1);
    expect(week.days.filter((day) => day.isFuture).every((day) => !day.completed)).toBe(true);
  });

  it('marks exempt days as protected and lowers an otherwise impossible weekly goal', () => {
    const week = buildGentleWeek({
      now: new Date(2026, 7, 16, 12, 0), // Sunday
      trackerDays: {},
      quranMinutesByDay: {},
      dhikrByDay: {},
      goalDays: 5,
      exemptDates: ['2026-08-10', '2026-08-11', '2026-08-12'],
    });

    expect(week.days.filter((day) => day.isExempt)).toHaveLength(3);
    expect(week.goalDays).toBe(4);
    expect(week.days.filter((day) => day.isExempt).every((day) => !day.completed)).toBe(true);
  });

  it('treats a fully exempt week as protected instead of an unmet streak', () => {
    const exemptDates = Array.from({ length: 7 }, (_, index) => `2026-08-${String(10 + index).padStart(2, '0')}`);
    const week = buildGentleWeek({
      now: new Date(2026, 7, 16, 12, 0),
      trackerDays: {},
      quranMinutesByDay: {},
      dhikrByDay: {},
      goalDays: 5,
      exemptDates,
    });
    expect(week.goalDays).toBe(0);
    expect(week.goalMet).toBe(true);
    expect(week.remainingDays).toBe(0);
  });
});
