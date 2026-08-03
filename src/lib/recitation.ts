/**
 * Sesli Kur'an okuma (kıraat) yardımcıları.
 *
 * Ses dosyaları everyayah.com'dan ayet ayet mp3 olarak akıtılır:
 *   https://everyayah.com/data/<kari>/<SSS><AAA>.mp3
 * (SSS: 3 haneli sure, AAA: 3 haneli ayet numarası)
 *
 * Sesli okuma internet bağlantısı gerektirir; ağ hatasında hook nazik bir
 * hata durumu döndürür (ekranlar bunu kullanıcıya uygun dille gösterir).
 */

import { useAudioPlayer, useAudioPlayerStatus, type AudioStatus } from 'expo-audio';
import { useCallback, useState } from 'react';

export interface Reciter {
  /** everyayah.com klasör adı */
  id: string;
  name: string;
}

export const RECITERS: Reciter[] = [
  { id: 'Alafasy_128kbps', name: 'Mişârî Râşid el-Afâsî' },
  { id: 'Husary_128kbps', name: 'Mahmûd Halîl el-Husarî' },
];

export const DEFAULT_RECITER_ID = 'Alafasy_128kbps';

/** Ayarlardaki değeri bilinen bir kâriye çevirir (eski/bilinmeyen değerler varsayılana düşer). */
export function normalizeReciterId(id: string): string {
  return RECITERS.some((r) => r.id === id) ? id : DEFAULT_RECITER_ID;
}

export function getReciterName(id: string): string {
  return RECITERS.find((r) => r.id === normalizeReciterId(id))?.name ?? '';
}

function pad3(n: number): string {
  return String(n).padStart(3, '0');
}

/** (sure, ayet, kâri) -> everyayah.com mp3 adresi. */
export function recitationUrl(surah: number, ayah: number, reciterId: string): string {
  return `https://everyayah.com/data/${normalizeReciterId(reciterId)}/${pad3(surah)}${pad3(ayah)}.mp3`;
}

/**
 * Ses dosyasına erişilebiliyor mu? Ağ yoksa veya sunucuya ulaşılamıyorsa false.
 * (HEAD isteği; 405 dönen sunucular da "erişilebilir" sayılır.)
 */
export async function checkRecitationReachable(url: string): Promise<boolean> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(url, { method: 'HEAD', signal: controller.signal });
    return res.ok || res.status === 405;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

export interface RecitationTarget {
  surah: number;
  ayah: number;
}

export interface AyahRecitation {
  /** Şu an yüklü/çalan ayet (yoksa null) */
  current: RecitationTarget | null;
  /** Oynatıcı durumu (didJustFinish, playing, isBuffering...) */
  status: AudioStatus;
  /** URL doğrulaması sürerken hedef ayet */
  pendingTarget: RecitationTarget | null;
  /** Ağ/erişim hatası oluştu mu (ekran nazik bir uyarı gösterir) */
  networkError: boolean;
  clearNetworkError: () => void;
  /** Ayeti çalmaya başlar; ağ hatasında false döner. */
  play: (surah: number, ayah: number) => Promise<boolean>;
  /** Yüklü ayeti baştan oynatır. */
  replay: () => Promise<void>;
  pause: () => void;
  /** Bu ayet şu an çalıyor mu? */
  isPlayingAyah: (surah: number, ayah: number) => boolean;
  /** Bu ayet için istek/yükleme sürüyor mu? */
  isPendingAyah: (surah: number, ayah: number) => boolean;
}

/**
 * Ayet ayet sesli okuma hook'u. Tek bir oynatıcıyı paylaşır;
 * bileşen kapanınca expo-audio oynatıcıyı otomatik serbest bırakır.
 */
export function useAyahRecitation(reciterId: string): AyahRecitation {
  const player = useAudioPlayer(null);
  const status = useAudioPlayerStatus(player);
  const [current, setCurrent] = useState<RecitationTarget | null>(null);
  const [pendingTarget, setPendingTarget] = useState<RecitationTarget | null>(null);
  const [networkError, setNetworkError] = useState(false);

  const play = useCallback(
    async (surah: number, ayah: number): Promise<boolean> => {
      setNetworkError(false);
      setPendingTarget({ surah, ayah });
      const url = recitationUrl(surah, ayah, reciterId);
      const reachable = await checkRecitationReachable(url);
      if (!reachable) {
        setPendingTarget(null);
        setNetworkError(true);
        return false;
      }
      player.replace({ uri: url });
      player.play();
      setCurrent({ surah, ayah });
      setPendingTarget(null);
      return true;
    },
    [player, reciterId],
  );

  const replay = useCallback(async (): Promise<void> => {
    if (!current) return;
    await player.seekTo(0);
    player.play();
  }, [player, current]);

  const pause = useCallback((): void => {
    player.pause();
  }, [player]);

  const isPlayingAyah = useCallback(
    (surah: number, ayah: number): boolean =>
      !!current && current.surah === surah && current.ayah === ayah && status.playing,
    [current, status.playing],
  );

  const isPendingAyah = useCallback(
    (surah: number, ayah: number): boolean =>
      !!pendingTarget && pendingTarget.surah === surah && pendingTarget.ayah === ayah,
    [pendingTarget],
  );

  return {
    current,
    status,
    pendingTarget,
    networkError,
    clearNetworkError: () => setNetworkError(false),
    play,
    replay,
    pause,
    isPlayingAyah,
    isPendingAyah,
  };
}
