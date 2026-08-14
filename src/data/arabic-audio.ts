/**
 * Çocuk Yolu Arapça ses kayıtları (tools/build-arabic-audio.mjs üretir).
 * Kayıtlar Arap alfabesinin orijinal okunuşuyla, ar-SA sesiyle üretilmiştir;
 * diziler src/data/elifba.ts içindeki ELIFBA/HARAKAT sırasıyla birebir aynıdır.
 * ELLE DÜZENLEMEYİN — betiği çalıştırıp yeniden üretin.
 */

/** ELIFBA[i] harfinin kaydı (harf adı + örnek kelime, Arapça) */
export const LETTER_AUDIO: number[] = [
  require('../../assets/sounds/arabic/letter-01.mp3') as number,
  require('../../assets/sounds/arabic/letter-02.mp3') as number,
  require('../../assets/sounds/arabic/letter-03.mp3') as number,
  require('../../assets/sounds/arabic/letter-04.mp3') as number,
  require('../../assets/sounds/arabic/letter-05.mp3') as number,
  require('../../assets/sounds/arabic/letter-06.mp3') as number,
  require('../../assets/sounds/arabic/letter-07.mp3') as number,
  require('../../assets/sounds/arabic/letter-08.mp3') as number,
  require('../../assets/sounds/arabic/letter-09.mp3') as number,
  require('../../assets/sounds/arabic/letter-10.mp3') as number,
  require('../../assets/sounds/arabic/letter-11.mp3') as number,
  require('../../assets/sounds/arabic/letter-12.mp3') as number,
  require('../../assets/sounds/arabic/letter-13.mp3') as number,
  require('../../assets/sounds/arabic/letter-14.mp3') as number,
  require('../../assets/sounds/arabic/letter-15.mp3') as number,
  require('../../assets/sounds/arabic/letter-16.mp3') as number,
  require('../../assets/sounds/arabic/letter-17.mp3') as number,
  require('../../assets/sounds/arabic/letter-18.mp3') as number,
  require('../../assets/sounds/arabic/letter-19.mp3') as number,
  require('../../assets/sounds/arabic/letter-20.mp3') as number,
  require('../../assets/sounds/arabic/letter-21.mp3') as number,
  require('../../assets/sounds/arabic/letter-22.mp3') as number,
  require('../../assets/sounds/arabic/letter-23.mp3') as number,
  require('../../assets/sounds/arabic/letter-24.mp3') as number,
  require('../../assets/sounds/arabic/letter-25.mp3') as number,
  require('../../assets/sounds/arabic/letter-26.mp3') as number,
  require('../../assets/sounds/arabic/letter-27.mp3') as number,
  require('../../assets/sounds/arabic/letter-28.mp3') as number,
];

/** HARAKAT[i] hecesinin kaydı */
export const HARAKA_AUDIO: number[] = [
  require('../../assets/sounds/arabic/haraka-01.mp3') as number,
  require('../../assets/sounds/arabic/haraka-02.mp3') as number,
  require('../../assets/sounds/arabic/haraka-03.mp3') as number,
  require('../../assets/sounds/arabic/haraka-04.mp3') as number,
  require('../../assets/sounds/arabic/haraka-05.mp3') as number,
  require('../../assets/sounds/arabic/haraka-06.mp3') as number,
];

export const BESMELE_AUDIO = require('../../assets/sounds/arabic/besmele.mp3') as number;

/** KIDS_DUA_IDS -> dua kaydı */
export const KIDS_DUA_AUDIO: Record<string, number> = {
  'yemek-baslarken': require('../../assets/sounds/arabic/dua-yemek-baslarken.mp3') as number,
  'yemek-sonrasi': require('../../assets/sounds/arabic/dua-yemek-sonrasi.mp3') as number,
  'uyku-yatarken': require('../../assets/sounds/arabic/dua-uyku-yatarken.mp3') as number,
  'uyku-uyaninca': require('../../assets/sounds/arabic/dua-uyku-uyaninca.mp3') as number,
};
