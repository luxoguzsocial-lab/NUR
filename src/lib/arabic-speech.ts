import * as Speech from 'expo-speech';

/**
 * Arapça metni Arap telaffuzuyla seslendirir (ör. ق kalın "gaf" olarak okunur).
 * Türkçe okunuş metni DEĞİL, verideki Arapça asıl okunur; "dinle" özellikleri
 * bunun için hep bu yardımcıyı kullanmalıdır. (Kur'an ayetlerinde gerçek hafız
 * kaydı esastır — bkz. lib/recitation.ts; bu yardımcı harf/kelime/dua gibi
 * kayıt bulunmayan kısa metinler içindir.)
 */
export function speakArabic(text: string, rate = 0.8): void {
  Speech.stop();
  Speech.speak(text, { language: 'ar', rate });
}

/** Açıklama/etiket gibi Türkçe metinler için (çocuk ekranlarında yönerge okuma). */
export function speakTurkish(text: string, rate = 0.9): void {
  Speech.stop();
  Speech.speak(text, { language: 'tr-TR', rate });
}

export function stopSpeech(): void {
  Speech.stop();
}
