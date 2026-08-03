import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface Dhikr {
  id: string;
  label: string;
  arabic: string;
  /** Türkçe anlamı (hazır zikirlerde dolu) */
  meaningTr?: string;
  custom?: boolean;
  target: number;
  /** Kaynak (hazır zikirler için) */
  source?: string;
}

/** Tesbih tanesi renk seçenekleri (açık/koyu temada okunaklı orta tonlar). */
export const BEAD_COLORS: { id: string; hex: string; labelTr: string }[] = [
  { id: 'altin', hex: '#E3B341', labelTr: 'Altın' },
  { id: 'zumrut', hex: '#2EA88C', labelTr: 'Zümrüt' },
  { id: 'mercan', hex: '#D9534F', labelTr: 'Mercan' },
  { id: 'fume', hex: '#4A4E54', labelTr: 'Füme' },
  { id: 'kehribar', hex: '#A9713C', labelTr: 'Kehribar' },
  { id: 'lacivert', hex: '#4169E1', labelTr: 'Lacivert' },
];

interface TasbihState {
  dhikrList: Dhikr[];
  activeId: string;
  /** dhikrId -> mevcut sayaç (kaldığı yerden devam) */
  counts: Record<string, number>;
  /** YYYY-MM-DD -> dhikrId -> çekilen adet (zikir bazlı günlük geçmiş) */
  dailyHistory: Record<string, Record<string, number>>;
  vibration: boolean;
  /** Hedef bitince sıradaki zikre otomatik geç */
  chainMode: boolean;
  /** Günlük toplam zikir hedefi */
  dailyGoal: number;
  /** Tık sesi */
  sound: boolean;
  beadColorId: string;

  setActive: (id: string) => void;
  increment: (dateISO: string) => void;
  resetCount: (id: string) => void;
  setOption: (key: 'vibration' | 'sound' | 'chainMode', value: boolean) => void;
  setDailyGoal: (n: number) => void;
  addCustomDhikr: (label: string, target: number) => void;
  removeCustomDhikr: (id: string) => void;
  setBeadColor: (id: string) => void;
}

export const PRESET_DHIKRS: Dhikr[] = [
  {
    id: 'subhanallah',
    label: 'Sübhanallah',
    arabic: 'سُبْحَانَ اللّٰهِ',
    meaningTr: "Allah'ı bütün noksanlıklardan tenzih ederim.",
    target: 33,
    source: 'Müslim, Mesâcid 144',
  },
  {
    id: 'alhamdulillah',
    label: 'Elhamdülillah',
    arabic: 'اَلْحَمْدُ لِلّٰهِ',
    meaningTr: "Hamd, âlemlerin Rabbi Allah'a mahsustur.",
    target: 33,
    source: 'Müslim, Mesâcid 144',
  },
  {
    id: 'allahuakbar',
    label: 'Allahu Ekber',
    arabic: 'اَللّٰهُ أَكْبَرُ',
    meaningTr: 'Allah en büyüktür.',
    target: 33,
    source: 'Müslim, Mesâcid 144',
  },
  {
    id: 'lailaheillallah',
    label: 'Lâ ilâhe illallah',
    arabic: 'لَا إِلٰهَ إِلَّا اللّٰهُ',
    meaningTr: "Allah'tan başka ilah yoktur.",
    target: 100,
    source: 'Buhârî, Deavât 65',
  },
  {
    id: 'estagfirullah',
    label: 'Estağfirullah',
    arabic: 'أَسْتَغْفِرُ اللّٰهَ',
    meaningTr: "Allah'tan bağışlanma dilerim.",
    target: 100,
    source: 'Müslim, Zikir 41',
  },
  {
    id: 'salavat',
    label: 'Salavât-ı Şerife',
    arabic: 'اَللّٰهُمَّ صَلِّ عَلٰى مُحَمَّدٍ',
    meaningTr: "Allah'ım! Muhammed'e salât (rahmet) eyle.",
    target: 100,
    source: 'Müslim, Salât 70',
  },
];

export const useTasbihStore = create<TasbihState>()(
  persist(
    (set) => ({
      dhikrList: PRESET_DHIKRS,
      activeId: PRESET_DHIKRS[0]!.id,
      counts: {},
      dailyHistory: {},
      vibration: true,
      sound: false,
      chainMode: false,
      dailyGoal: 100,
      beadColorId: BEAD_COLORS[0]!.id,
      setActive: (id) => set({ activeId: id }),
      increment: (dateISO) =>
        set((s) => {
          const day = s.dailyHistory[dateISO] ?? {};
          return {
            counts: { ...s.counts, [s.activeId]: (s.counts[s.activeId] ?? 0) + 1 },
            dailyHistory: {
              ...s.dailyHistory,
              [dateISO]: { ...day, [s.activeId]: (day[s.activeId] ?? 0) + 1 },
            },
          };
        }),
      resetCount: (id) => set((s) => ({ counts: { ...s.counts, [id]: 0 } })),
      setOption: (key, value) => set({ [key]: value } as Partial<TasbihState>),
      setDailyGoal: (n) => set({ dailyGoal: Math.max(1, n) }),
      addCustomDhikr: (label, target) =>
        set((s) => {
          const id = 'custom-' + s.dhikrList.length + '-' + label.slice(0, 12);
          return {
            dhikrList: [...s.dhikrList, { id, label, arabic: '', target, custom: true }],
            activeId: id,
          };
        }),
      removeCustomDhikr: (id) =>
        set((s) => ({
          dhikrList: s.dhikrList.filter((d) => d.id !== id || !d.custom),
          activeId: s.activeId === id ? PRESET_DHIKRS[0]!.id : s.activeId,
        })),
      setBeadColor: (id) => set({ beadColorId: id }),
    }),
    {
      name: 'nur-tasbih',
      version: 2,
      storage: createJSONStorage(() => AsyncStorage),
      // v1 -> v2: dailyHistory sayı tutuyordu, artık zikir bazlı; hazır zikir
      // listesi de anlam alanı kazandı. Eski liste ve toplamlar taşınmaz.
      migrate: (persisted) => {
        const state = persisted as Partial<TasbihState> & {
          dailyHistory?: Record<string, unknown>;
        };
        const dailyHistory: Record<string, Record<string, number>> = {};
        for (const [date, value] of Object.entries(state.dailyHistory ?? {})) {
          if (typeof value === 'object' && value !== null) {
            dailyHistory[date] = value as Record<string, number>;
          }
        }
        return {
          ...state,
          dhikrList: PRESET_DHIKRS,
          activeId: PRESET_DHIKRS.some((d) => d.id === state.activeId)
            ? (state.activeId as string)
            : PRESET_DHIKRS[0]!.id,
          dailyHistory,
          beadColorId: state.beadColorId ?? BEAD_COLORS[0]!.id,
        };
      },
    },
  ),
);
