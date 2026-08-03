import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type Language = 'tr' | 'en' | 'ar';
export type ThemePref = 'system' | 'light' | 'dark';
export type CalcMethodId = 'diyanet' | 'mwl' | 'ummalqura' | 'isna' | 'egyptian' | 'karachi';
export type MadhabId = 'hanafi' | 'shafi';
export type PrayerId = 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export interface LocationSetting {
  mode: 'auto' | 'manual';
  latitude: number;
  longitude: number;
  /** İl adı (manuel) veya ters geokodlanmış şehir */
  cityName: string;
  districtName?: string;
}

export interface NotificationPrefs {
  prayersEnabled: boolean;
  perPrayer: Record<PrayerId, boolean>;
  /** Vakitten kaç dakika önce hatırlatma (0 = tam vaktinde) */
  reminderMinutesBefore: number;
  adhanSound: 'default' | 'silent' | 'beep';
  quranGoal: boolean;
  khatm: boolean;
  memorization: boolean;
  learning: boolean;
  religiousDays: boolean;
  ramadan: boolean;
  newContent: boolean;
}

export interface QuranPrefs {
  fontSize: number;
  lineHeightMultiplier: number;
  arabicFont: 'system' | 'serif';
  showTranslation: boolean;
  showTransliteration: boolean;
  showTajweed: boolean;
  /** Renk körlüğü için renk yerine alt çizgi/işaret gösterimi */
  tajweedAccessibleMarks: boolean;
  reciter: string;
}

export interface SettingsState {
  onboardingCompleted: boolean;
  /** İsteğe bağlı kullanıcı adı — yalnızca selamlamada kullanılır, cihazda kalır */
  userName: string;
  language: Language;
  theme: ThemePref;
  location: LocationSetting;
  calcMethod: CalcMethodId;
  madhab: MadhabId;
  /** Vakit başına dakika düzeltmesi */
  adjustments: Record<PrayerId, number>;
  notifications: NotificationPrefs;
  quran: QuranPrefs;
  videoAutoplay: boolean;
  playbackSpeed: number;
  dataSaver: boolean;
  analyticsEnabled: boolean;
  trackerEnabled: boolean;
  aiHistoryEnabled: boolean;
  dailyQuranGoalMinutes: number;
  dailyMemorizationGoalAyahs: number;
  dailyWatchReminderMinutes: number;

  set: <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => void;
  setNotification: <K extends keyof NotificationPrefs>(key: K, value: NotificationPrefs[K]) => void;
  setQuranPref: <K extends keyof QuranPrefs>(key: K, value: QuranPrefs[K]) => void;
  setAdjustment: (prayer: PrayerId, minutes: number) => void;
  resetAll: () => void;
}

const DEFAULT_LOCATION: LocationSetting = {
  mode: 'manual',
  latitude: 41.0082,
  longitude: 28.9784,
  cityName: 'İstanbul',
};

const DEFAULTS = {
  onboardingCompleted: false,
  userName: '',
  language: 'tr' as Language,
  theme: 'system' as ThemePref,
  location: DEFAULT_LOCATION,
  calcMethod: 'diyanet' as CalcMethodId,
  madhab: 'hanafi' as MadhabId,
  adjustments: { fajr: 0, sunrise: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0 },
  notifications: {
    prayersEnabled: true,
    perPrayer: { fajr: true, sunrise: false, dhuhr: true, asr: true, maghrib: true, isha: true },
    reminderMinutesBefore: 0,
    adhanSound: 'default' as const,
    quranGoal: true,
    khatm: true,
    memorization: true,
    learning: true,
    religiousDays: true,
    ramadan: true,
    newContent: false,
  },
  quran: {
    fontSize: 26,
    lineHeightMultiplier: 1.8,
    arabicFont: 'system' as const,
    showTranslation: true,
    showTransliteration: false,
    showTajweed: false,
    tajweedAccessibleMarks: false,
    reciter: 'demo',
  },
  videoAutoplay: true,
  playbackSpeed: 1,
  dataSaver: false,
  analyticsEnabled: false,
  trackerEnabled: true,
  aiHistoryEnabled: true,
  dailyQuranGoalMinutes: 10,
  dailyMemorizationGoalAyahs: 1,
  dailyWatchReminderMinutes: 30,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...DEFAULTS,
      set: (key, value) => set({ [key]: value } as Partial<SettingsState>),
      setNotification: (key, value) =>
        set((s) => ({ notifications: { ...s.notifications, [key]: value } })),
      setQuranPref: (key, value) => set((s) => ({ quran: { ...s.quran, [key]: value } })),
      setAdjustment: (prayer, minutes) =>
        set((s) => ({ adjustments: { ...s.adjustments, [prayer]: minutes } })),
      resetAll: () => set({ ...DEFAULTS }),
    }),
    { name: 'nur-settings', storage: createJSONStorage(() => AsyncStorage) },
  ),
);
