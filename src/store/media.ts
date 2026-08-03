import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface MediaState {
  /** videoId -> son izlenme tarihi */
  watchHistory: Record<string, string>;
  followedCreators: string[];
  notInterested: string[];
  /** videoId -> bildirim nedeni */
  reported: Record<string, string>;
  /** Bugün izlenen toplam saniye (YYYY-MM-DD anahtarlı) */
  watchSecondsByDay: Record<string, number>;

  markWatched: (videoId: string) => void;
  toggleFollow: (creatorId: string) => void;
  markNotInterested: (videoId: string) => void;
  reportVideo: (videoId: string, reason: string) => void;
  addWatchSeconds: (dateISO: string, seconds: number) => void;
  clearHistory: () => void;
}

export const useMediaStore = create<MediaState>()(
  persist(
    (set) => ({
      watchHistory: {},
      followedCreators: [],
      notInterested: [],
      reported: {},
      watchSecondsByDay: {},
      markWatched: (videoId) =>
        set((s) => ({
          watchHistory: { ...s.watchHistory, [videoId]: new Date().toISOString() },
        })),
      toggleFollow: (creatorId) =>
        set((s) => ({
          followedCreators: s.followedCreators.includes(creatorId)
            ? s.followedCreators.filter((c) => c !== creatorId)
            : [...s.followedCreators, creatorId],
        })),
      markNotInterested: (videoId) =>
        set((s) => ({ notInterested: [...new Set([...s.notInterested, videoId])] })),
      reportVideo: (videoId, reason) =>
        set((s) => ({ reported: { ...s.reported, [videoId]: reason } })),
      addWatchSeconds: (dateISO, seconds) =>
        set((s) => ({
          watchSecondsByDay: {
            ...s.watchSecondsByDay,
            [dateISO]: (s.watchSecondsByDay[dateISO] ?? 0) + seconds,
          },
        })),
      clearHistory: () => set({ watchHistory: {}, watchSecondsByDay: {} }),
    }),
    { name: 'nur-media', storage: createJSONStorage(() => AsyncStorage) },
  ),
);

export interface AiSource {
  kind: 'ayah' | 'hadith' | 'tafsir' | 'book';
  /** Örn. "Bakara 2:255" veya "Buhârî, İman 1" */
  reference: string;
  /** Kaynak metnin kendisi (AI yorumundan ayrı gösterilir) */
  text: string;
  /** Hadis için sıhhat derecesi vb. */
  grading?: string;
  author?: string;
  verified: boolean;
}

export interface AiMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  /** Asistan cevapları için zorunlu — kaynaksız cevap gösterilmez */
  sources?: AiSource[];
  shortAnswer?: string;
  confidence?: 'high' | 'medium' | 'low';
  differences?: string;
  /** Yüksek riskli konu — din görevlisine yönlendirme gösterilir */
  referToScholar?: boolean;
  relatedTopics?: string[];
  demo: boolean;
  createdAt: string;
  feedback?: 'helpful' | 'incorrect';
}

interface AiState {
  messages: AiMessage[];
  append: (msg: AiMessage) => void;
  setFeedback: (id: string, feedback: 'helpful' | 'incorrect') => void;
  clearHistory: () => void;
}

export const useAiStore = create<AiState>()(
  persist(
    (set) => ({
      messages: [],
      append: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
      setFeedback: (id, feedback) =>
        set((s) => ({
          messages: s.messages.map((m) => (m.id === id ? { ...m, feedback } : m)),
        })),
      clearHistory: () => set({ messages: [] }),
    }),
    { name: 'nur-ai', storage: createJSONStorage(() => AsyncStorage) },
  ),
);
