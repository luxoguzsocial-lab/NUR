/**
 * Hicri takvim dönüşümü — tabular (civil / Kuveyt) algoritması.
 *
 * Not: Diyanet ve bazı ülkeler hilal gözlemine göre ±1 gün farklı ilan
 * edebilir; arayüz bu belirsizliği kullanıcıya bildirir (P0-SPEC #19).
 */

export interface HijriDate {
  year: number;
  /** 1-12 (1 = Muharrem) */
  month: number;
  day: number;
}

const HIJRI_EPOCH_JDN = 1948440;

export function gregorianToJdn(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return (
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  );
}

export function jdnToGregorian(jdn: number): { year: number; month: number; day: number } {
  const a = jdn + 32044;
  const b = Math.floor((4 * a + 3) / 146097);
  const c = a - Math.floor(146097 * b / 4);
  const d = Math.floor((4 * c + 3) / 1461);
  const e = c - Math.floor(1461 * d / 4);
  const m = Math.floor((5 * e + 2) / 153);
  return {
    day: e - Math.floor((153 * m + 2) / 5) + 1,
    month: m + 3 - 12 * Math.floor(m / 10),
    year: 100 * b + d - 4800 + Math.floor(m / 10),
  };
}

export function toHijri(date: Date): HijriDate {
  const jdn = gregorianToJdn(date.getFullYear(), date.getMonth() + 1, date.getDate());
  let l = jdn - HIJRI_EPOCH_JDN + 10632;
  const n = Math.floor((l - 1) / 10631);
  l = l - 10631 * n + 354;
  const j =
    Math.floor((10985 - l) / 5316) * Math.floor((50 * l) / 17719) +
    Math.floor(l / 5670) * Math.floor((43 * l) / 15238);
  l =
    l -
    Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
    Math.floor(j / 16) * Math.floor((15238 * j) / 43) +
    29;
  const month = Math.floor((24 * l) / 709);
  const day = l - Math.floor((709 * month) / 24);
  const year = 30 * n + j - 30;
  return { year, month, day };
}

export function hijriToGregorian(hijri: HijriDate): Date {
  const jdn =
    Math.floor((11 * hijri.year + 3) / 30) +
    354 * hijri.year +
    30 * hijri.month -
    Math.floor((hijri.month - 1) / 2) +
    hijri.day +
    HIJRI_EPOCH_JDN -
    385;
  const g = jdnToGregorian(jdn);
  return new Date(g.year, g.month - 1, g.day);
}

export const HIJRI_MONTHS_TR = [
  'Muharrem', 'Safer', 'Rebiülevvel', 'Rebiülahir', 'Cemaziyelevvel', 'Cemaziyelahir',
  'Recep', 'Şaban', 'Ramazan', 'Şevval', 'Zilkade', 'Zilhicce',
] as const;

export const HIJRI_MONTHS_EN = [
  'Muharram', 'Safar', "Rabi' al-Awwal", "Rabi' al-Thani", 'Jumada al-Ula', 'Jumada al-Akhirah',
  'Rajab', "Sha'ban", 'Ramadan', 'Shawwal', "Dhu al-Qi'dah", 'Dhu al-Hijjah',
] as const;

export const HIJRI_MONTHS_AR = [
  'مُحَرَّم', 'صَفَر', 'رَبِيع الأوَّل', 'رَبِيع الثاني', 'جُمَادى الأولى', 'جُمَادى الآخرة',
  'رَجَب', 'شَعْبان', 'رَمَضان', 'شَوَّال', 'ذو القعدة', 'ذو الحجة',
] as const;

export function formatHijri(hijri: HijriDate, language: 'tr' | 'en' | 'ar'): string {
  const months =
    language === 'tr' ? HIJRI_MONTHS_TR : language === 'en' ? HIJRI_MONTHS_EN : HIJRI_MONTHS_AR;
  return `${hijri.day} ${months[hijri.month - 1]} ${hijri.year}`;
}

export function isRamadan(date: Date): boolean {
  return toHijri(date).month === 9;
}

/** Hicri ayın gün sayısı (tabular): tek aylar 30, çift aylar 29; artık yılda Zilhicce 30. */
export function hijriMonthLength(year: number, month: number): number {
  if (month % 2 === 1) return 30;
  if (month === 12 && (11 * year + 14) % 30 < 11) return 30;
  return 29;
}
