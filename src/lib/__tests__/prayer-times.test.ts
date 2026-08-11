import { getNextPrayer, getPrayerTimesForDate, PRAYER_ORDER } from '@/lib/prayer-times';
import type { PrayerId } from '@/store/settings';

const NO_ADJUST: Record<PrayerId, number> = {
  fajr: 0, sunrise: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0,
};

const IST = { lat: 41.0082, lon: 28.9784 };
const date = new Date(2026, 7, 2); // 2 Ağustos 2026

describe('getPrayerTimesForDate', () => {
  it('vakitler kronolojik sırada (İstanbul, Diyanet)', () => {
    const { times } = getPrayerTimesForDate(date, IST.lat, IST.lon, 'diyanet', 'hanafi', NO_ADJUST);
    for (let i = 1; i < PRAYER_ORDER.length; i++) {
      const prev = times[PRAYER_ORDER[i - 1]!];
      const curr = times[PRAYER_ORDER[i]!];
      expect(curr.getTime()).toBeGreaterThan(prev.getTime());
    }
  });

  it('bütün vakitler aynı gün içinde makul saatlerde', () => {
    const { times } = getPrayerTimesForDate(date, IST.lat, IST.lon, 'diyanet', 'hanafi', NO_ADJUST);
    // Ağustos'ta İstanbul: imsak 03:00-05:00, yatsı 21:00-23:30 aralığında olmalı
    expect(times.fajr.getHours()).toBeGreaterThanOrEqual(3);
    expect(times.fajr.getHours()).toBeLessThanOrEqual(5);
    expect(times.isha.getHours()).toBeGreaterThanOrEqual(21);
  });

  it('Hanefi ikindisi standart ikindiden geç', () => {
    const hanafi = getPrayerTimesForDate(date, IST.lat, IST.lon, 'diyanet', 'hanafi', NO_ADJUST);
    const shafi = getPrayerTimesForDate(date, IST.lat, IST.lon, 'diyanet', 'shafi', NO_ADJUST);
    expect(hanafi.times.asr.getTime()).toBeGreaterThan(shafi.times.asr.getTime());
  });

  it('dakika düzeltmesi vakti kaydırır', () => {
    const base = getPrayerTimesForDate(date, IST.lat, IST.lon, 'diyanet', 'hanafi', NO_ADJUST);
    const adjusted = getPrayerTimesForDate(date, IST.lat, IST.lon, 'diyanet', 'hanafi', {
      ...NO_ADJUST,
      fajr: 5,
    });
    expect(adjusted.times.fajr.getTime() - base.times.fajr.getTime()).toBe(5 * 60_000);
  });

  it('farklı yöntemler farklı imsak üretebilir (ISNA vs Umm al-Qura)', () => {
    const isna = getPrayerTimesForDate(date, IST.lat, IST.lon, 'isna', 'shafi', NO_ADJUST);
    const uq = getPrayerTimesForDate(date, IST.lat, IST.lon, 'ummalqura', 'shafi', NO_ADJUST);
    expect(isna.times.fajr.getTime()).not.toBe(uq.times.fajr.getTime());
  });

  it('güney yarımkürede de çalışır (Cakarta)', () => {
    const { times } = getPrayerTimesForDate(date, -6.2088, 106.8456, 'ummalqura', 'shafi', NO_ADJUST);
    expect(times.maghrib.getTime()).toBeGreaterThan(times.dhuhr.getTime());
  });
});

describe('getNextPrayer', () => {
  it('gün ortasında sıradaki vakit güneş değil namaz vakti', () => {
    const noon = new Date(2026, 7, 2, 12, 0);
    const next = getNextPrayer(noon, IST.lat, IST.lon, 'diyanet', 'hanafi', NO_ADJUST);
    expect(next.prayer).not.toBe('sunrise');
    expect(next.remainingMs).toBeGreaterThan(0);
  });

  it('yatsıdan sonra sıradaki vakit yarının imsakı', () => {
    const lateNight = new Date(2026, 7, 2, 23, 55);
    const next = getNextPrayer(lateNight, IST.lat, IST.lon, 'diyanet', 'hanafi', NO_ADJUST);
    expect(next.prayer).toBe('fajr');
    expect(next.time.getDate()).toBe(3);
  });
});
