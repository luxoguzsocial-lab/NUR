import * as Speech from 'expo-speech';

/**
 * Arapça metni Arap telaffuzuyla seslendirme yardımcıları.
 *
 * Öncelik her zaman verideki Arapça asıldır (ör. ق kalın "gaf" okunur);
 * cihazda Arapça ses yoksa varsayılan ses Arap harflerini hiç okuyamayıp
 * sessiz kaldığı için Türkçe okunuş metnine otomatik geri düşülür.
 * (Kur'an ayetlerinde gerçek hafız kaydı esastır — bkz. lib/recitation.ts;
 * bu yardımcı harf/hece/dua gibi kayıt bulunmayan kısa metinler içindir.)
 */

// undefined = henüz bakılmadı; null = cihazda Arapça ses yok
let cachedArabicVoice: string | null | undefined;

async function findArabicVoice(): Promise<string | null> {
  if (cachedArabicVoice !== undefined) return cachedArabicVoice;
  try {
    let voices = await Speech.getAvailableVoicesAsync();
    // Web'de ses listesi ilk çağrıda boş dönebilir; kısa bekleyip bir kez daha dene
    if (voices.length === 0) {
      await new Promise((resolve) => setTimeout(resolve, 250));
      voices = await Speech.getAvailableVoicesAsync();
    }
    const arabic = voices.find((v) => v.language?.toLowerCase().startsWith('ar'));
    cachedArabicVoice = arabic?.identifier ?? null;
  } catch {
    cachedArabicVoice = null;
  }
  return cachedArabicVoice;
}

/**
 * Arapça metni seslendirir. Cihazda Arapça ses yoksa ve `fallbackReading`
 * verildiyse okunuş metni Türkçe sesle okunur.
 */
export async function speakArabic(
  arabic: string,
  fallbackReading?: string,
  rate = 0.8,
): Promise<void> {
  Speech.stop();
  const voice = await findArabicVoice();
  if (voice) {
    Speech.speak(arabic, { language: 'ar', voice, rate });
  } else if (fallbackReading) {
    Speech.speak(fallbackReading, { language: 'tr-TR', rate: Math.min(rate + 0.1, 1) });
  } else {
    // Ses bulunamadıysa yine de dene — bazı platformlar dil koduyla çözer
    Speech.speak(arabic, { language: 'ar', rate });
  }
}

/** Açıklama/etiket gibi Türkçe metinler için (çocuk ekranlarında yönerge okuma). */
export function speakTurkish(text: string, rate = 0.9): void {
  Speech.stop();
  Speech.speak(text, { language: 'tr-TR', rate });
}

export function stopSpeech(): void {
  Speech.stop();
}
