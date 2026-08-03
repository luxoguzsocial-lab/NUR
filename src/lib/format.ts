import type { Language } from '@/store/settings';

const LOCALE: Record<Language, string> = { tr: 'tr-TR', en: 'en-US', ar: 'ar' };

export function formatTime(date: Date): string {
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

export function formatDateLong(date: Date, language: Language): string {
  try {
    return date.toLocaleDateString(LOCALE[language], {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      weekday: 'long',
    });
  } catch {
    return date.toDateString();
  }
}

export function formatDateShort(date: Date, language: Language): string {
  try {
    return date.toLocaleDateString(LOCALE[language], { day: 'numeric', month: 'short' });
  } catch {
    return date.toDateString();
  }
}

/** ms -> "1 sa 23 dk" / "12 dk" / "45 sn" biçiminde kalan süre. */
export function formatRemaining(ms: number, t: (key: string) => string): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) return `${hours} ${t('common.hourShort')} ${minutes} ${t('common.minuteShort')}`;
  if (minutes > 0) return `${minutes} ${t('common.minuteShort')} ${seconds} ${t('common.secondShort')}`;
  return `${seconds} ${t('common.secondShort')}`;
}

export function todayISO(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
