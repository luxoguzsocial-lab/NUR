import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface AyahRef {
  surah: number;
  ayah: number;
}

export interface Bookmark extends AyahRef {
  id: string;
  createdAt: string;
}

export interface AyahNote extends AyahRef {
  id: string;
  text: string;
  updatedAt: string;
}

export interface ReadingHistoryEntry extends AyahRef {
  dateISO: string;
}

export interface KhatmPlan {
  id: string;
  name: string;
  totalDays: number;
  startDateISO: string;
  /** Tamamlanan gün indeksleri (0 tabanlı) */
  completedDays: number[];
  active: boolean;
}

export interface MemorizationItem {
  surah: number;
  /** Ezberlendi olarak işaretlenen ayet numaraları */
  memorizedAyahs: number[];
  /** Tekrar programı: son tekrar tarihi */
  lastReviewISO?: string;
}

/** Aralıklı tekrar kaydı ("surah:ayah" anahtarlı). */
export interface SrsEntry {
  /** 0 tabanlı aşama; aralıklar: 1, 3, 7, 21, 45 gün */
  stage: number;
  /** Sonraki tekrar tarihi (YYYY-MM-DD) */
  dueISO: string;
}

export const SRS_INTERVALS_DAYS = [1, 3, 7, 21, 45] as const;

export interface ProgressState {
  lastRead: AyahRef | null;
  /** "surah:ayah" -> aralıklı tekrar durumu */
  srs: Record<string, SrsEntry>;
  readingHistory: ReadingHistoryEntry[];
  bookmarks: Bookmark[];
  notes: AyahNote[];
  khatmPlans: KhatmPlan[];
  memorization: Record<number, MemorizationItem>;
  /** lessonId -> tamamlandı */
  completedLessons: Record<string, boolean>;
  /** lessonId -> kişisel not */
  lessonNotes: Record<string, string>;
  /** dateISO (YYYY-MM-DD) -> okunan dakika */
  quranMinutesByDay: Record<string, number>;

  setLastRead: (ref: AyahRef) => void;
  toggleBookmark: (ref: AyahRef) => void;
  isBookmarked: (ref: AyahRef) => boolean;
  upsertNote: (ref: AyahRef, text: string) => void;
  deleteNote: (id: string) => void;
  addKhatmPlan: (plan: Omit<KhatmPlan, 'id' | 'completedDays' | 'active'>) => void;
  toggleKhatmDay: (planId: string, dayIndex: number) => void;
  removeKhatmPlan: (planId: string) => void;
  toggleMemorizedAyah: (surah: number, ayah: number) => void;
  /** SRS: başarılıysa aşama ilerler, değilse başa döner. */
  reviewAyah: (surah: number, ayah: number, success: boolean) => void;
  markReviewed: (surah: number) => void;
  setLessonCompleted: (lessonId: string, done: boolean) => void;
  setLessonNote: (lessonId: string, text: string) => void;
  addQuranMinutes: (dateISO: string, minutes: number) => void;
  resetAll: () => void;
}

const EMPTY = {
  lastRead: null,
  srs: {} as Record<string, SrsEntry>,
  readingHistory: [] as ReadingHistoryEntry[],
  bookmarks: [] as Bookmark[],
  notes: [] as AyahNote[],
  khatmPlans: [] as KhatmPlan[],
  memorization: {} as Record<number, MemorizationItem>,
  completedLessons: {} as Record<string, boolean>,
  lessonNotes: {} as Record<string, string>,
  quranMinutesByDay: {} as Record<string, number>,
};

const keyOf = (ref: AyahRef) => `${ref.surah}:${ref.ayah}`;

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      ...EMPTY,
      setLastRead: (ref) =>
        set((s) => ({
          lastRead: ref,
          readingHistory: [
            { ...ref, dateISO: new Date().toISOString() },
            ...s.readingHistory.filter((h) => keyOf(h) !== keyOf(ref)),
          ].slice(0, 100),
        })),
      toggleBookmark: (ref) =>
        set((s) => {
          const existing = s.bookmarks.find((b) => keyOf(b) === keyOf(ref));
          return existing
            ? { bookmarks: s.bookmarks.filter((b) => b.id !== existing.id) }
            : {
                bookmarks: [
                  { ...ref, id: keyOf(ref), createdAt: new Date().toISOString() },
                  ...s.bookmarks,
                ],
              };
        }),
      isBookmarked: (ref) => get().bookmarks.some((b) => keyOf(b) === keyOf(ref)),
      upsertNote: (ref, text) =>
        set((s) => {
          const id = keyOf(ref);
          const rest = s.notes.filter((n) => n.id !== id);
          if (!text.trim()) return { notes: rest };
          return { notes: [{ ...ref, id, text, updatedAt: new Date().toISOString() }, ...rest] };
        }),
      deleteNote: (id) => set((s) => ({ notes: s.notes.filter((n) => n.id !== id) })),
      addKhatmPlan: (plan) =>
        set((s) => ({
          khatmPlans: [
            ...s.khatmPlans.map((p) => ({ ...p, active: false })),
            { ...plan, id: `khatm-${s.khatmPlans.length + 1}-${plan.startDateISO}`, completedDays: [], active: true },
          ],
        })),
      toggleKhatmDay: (planId, dayIndex) =>
        set((s) => ({
          khatmPlans: s.khatmPlans.map((p) =>
            p.id === planId
              ? {
                  ...p,
                  completedDays: p.completedDays.includes(dayIndex)
                    ? p.completedDays.filter((d) => d !== dayIndex)
                    : [...p.completedDays, dayIndex],
                }
              : p,
          ),
        })),
      removeKhatmPlan: (planId) =>
        set((s) => ({ khatmPlans: s.khatmPlans.filter((p) => p.id !== planId) })),
      toggleMemorizedAyah: (surah, ayah) =>
        set((s) => {
          const item = s.memorization[surah] ?? { surah, memorizedAyahs: [] };
          const memorizedAyahs = item.memorizedAyahs.includes(ayah)
            ? item.memorizedAyahs.filter((a) => a !== ayah)
            : [...item.memorizedAyahs, ayah];
          return { memorization: { ...s.memorization, [surah]: { ...item, memorizedAyahs } } };
        }),
      reviewAyah: (surah, ayah, success) =>
        set((s) => {
          const key = `${surah}:${ayah}`;
          const prev = s.srs[key];
          const stage = success ? Math.min((prev?.stage ?? -1) + 1, SRS_INTERVALS_DAYS.length - 1) : 0;
          const days = SRS_INTERVALS_DAYS[stage]!;
          const due = new Date();
          due.setDate(due.getDate() + days);
          const dueISO = `${due.getFullYear()}-${String(due.getMonth() + 1).padStart(2, '0')}-${String(due.getDate()).padStart(2, '0')}`;
          return { srs: { ...s.srs, [key]: { stage, dueISO } } };
        }),
      markReviewed: (surah) =>
        set((s) => {
          const item = s.memorization[surah];
          if (!item) return s;
          return {
            memorization: {
              ...s.memorization,
              [surah]: { ...item, lastReviewISO: new Date().toISOString() },
            },
          };
        }),
      setLessonCompleted: (lessonId, done) =>
        set((s) => ({ completedLessons: { ...s.completedLessons, [lessonId]: done } })),
      setLessonNote: (lessonId, text) =>
        set((s) => ({ lessonNotes: { ...s.lessonNotes, [lessonId]: text } })),
      addQuranMinutes: (dateISO, minutes) =>
        set((s) => ({
          quranMinutesByDay: {
            ...s.quranMinutesByDay,
            [dateISO]: (s.quranMinutesByDay[dateISO] ?? 0) + minutes,
          },
        })),
      resetAll: () => set({ ...EMPTY }),
    }),
    { name: 'nur-progress', storage: createJSONStorage(() => AsyncStorage) },
  ),
);
