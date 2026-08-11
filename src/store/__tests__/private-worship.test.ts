import {
  isPrivateWorshipActive,
  isPrivateWorshipExemptDate,
  shouldMutePrayerNotifications,
  trimClosedExemptionHistory,
} from '../../lib/private-worship';

describe('private worship mode helpers', () => {
  it('includes the start and excludes the day on which the mode is ended', () => {
    const state = {
      periods: [{ startDate: '2026-08-03', endDate: '2026-08-08' }],
      mutePrayerNotifications: true,
    };
    expect(isPrivateWorshipExemptDate(state, '2026-08-03')).toBe(true);
    expect(isPrivateWorshipExemptDate(state, '2026-08-07')).toBe(true);
    expect(isPrivateWorshipExemptDate(state, '2026-08-08')).toBe(false);
  });

  it('does not create an exempt day when a period starts and ends on the same date', () => {
    const state = {
      periods: [{ startDate: '2026-08-03', endDate: '2026-08-03' }],
      mutePrayerNotifications: true,
    };
    expect(isPrivateWorshipExemptDate(state, '2026-08-03')).toBe(false);
    expect(isPrivateWorshipActive(state)).toBe(false);
  });

  it('caps an open range at the latest known day', () => {
    const state = {
      periods: [{ startDate: '2026-08-03', endDate: null }],
      mutePrayerNotifications: true,
    };
    expect(isPrivateWorshipExemptDate(state, '2026-08-05', '2026-08-06')).toBe(true);
    expect(isPrivateWorshipExemptDate(state, '2026-08-07', '2026-08-06')).toBe(false);
    expect(isPrivateWorshipActive(state)).toBe(true);
    expect(shouldMutePrayerNotifications(state)).toBe(true);
  });

  it('clears old history while retaining only the current-week overlap', () => {
    const periods = trimClosedExemptionHistory(
      [
        { startDate: '2026-07-20', endDate: '2026-07-25' },
        { startDate: '2026-08-07', endDate: '2026-08-12' },
        { startDate: '2026-08-14', endDate: null },
      ],
      '2026-08-10',
    );
    expect(periods).toEqual([
      { startDate: '2026-08-10', endDate: '2026-08-12' },
      { startDate: '2026-08-14', endDate: null },
    ]);
  });
});
