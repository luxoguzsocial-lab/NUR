/**
 * Çocuk Yolu için Arapça ses kayıtları üretir (Edge TTS, ar-SA sesi).
 * Harf adları alfabenin orijinal Arapça okunuşuyla seslendirilir
 * (ا → "elif", ب → "bâ" ...); heceler ve dualar Arapça asıllarından okunur.
 *
 * Çıktılar: assets/sounds/arabic/letter-XX.mp3, haraka-XX.mp3,
 * besmele.mp3, dua-<id>.mp3 + src/data/arabic-audio.ts (require haritası)
 *
 * Kullanım: node tools/build-arabic-audio.mjs
 */
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = join(ROOT, 'assets', 'sounds', 'arabic');
mkdirSync(OUT_DIR, { recursive: true });

const VOICE = 'ar-SA-HamedNeural';
const PROSODY = { rate: '-20%' };

// ELIFBA sırası (src/data/elifba.ts ile birebir aynı sırada!)
const LETTERS = [
  ['ا', 'أَحَد'], ['ب', 'بَاب'], ['ت', 'تِين'], ['ث', 'ثَمَر'], ['ج', 'جَنَّة'],
  ['ح', 'حَمْد'], ['خ', 'خَيْر'], ['د', 'دِين'], ['ذ', 'ذِكْر'], ['ر', 'رَحْمَة'],
  ['ز', 'زَيْتُون'], ['س', 'سَلَام'], ['ش', 'شَمْس'], ['ص', 'صَبْر'], ['ض', 'ضِيَاء'],
  ['ط', 'طَيْر'], ['ظ', 'ظِلّ'], ['ع', 'عِلْم'], ['غ', 'غَار'], ['ف', 'فَجْر'],
  ['ق', 'قَمَر'], ['ك', 'كِتَاب'], ['ل', 'لَيْل'], ['م', 'مَاء'], ['ن', 'نُور'],
  ['ه', 'هُدَى'], ['و', 'وَرْد'], ['ي', 'يَد'],
];

// HARAKAT sırası (src/data/elifba.ts ile aynı): üstün, esre, ötre, cezm, şedde, tenvin
const HARAKAT_SAMPLES = ['بَ', 'بِ', 'بُ', 'اِبْ', 'بَّ', 'بًا'];

const BESMELE = 'بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيمِ';

// KIDS_DUA_IDS ile aynı id'ler; metinler Arapça asıl (Türkçe not içermez)
const DUAS = [
  ['yemek-baslarken', 'بِسْمِ اللّٰهِ'],
  ['yemek-sonrasi', 'اَلْحَمْدُ لِلّٰهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ'],
  ['uyku-yatarken', 'بِاسْمِكَ اللّٰهُمَّ أَمُوتُ وَأَحْيَا'],
  ['uyku-uyaninca', 'اَلْحَمْدُ لِلّٰهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ'],
];

const { MsEdgeTTS, OUTPUT_FORMAT } = await import('msedge-tts');

async function synth(text, outFile) {
  const outPath = join(OUT_DIR, outFile);
  if (existsSync(outPath)) {
    console.log(`⏭  ${outFile} (mevcut)`);
    return;
  }
  const tts = new MsEdgeTTS();
  await tts.setMetadata(VOICE, OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3, { voiceLocale: 'ar-SA' });
  const { audioStream } = await tts.toStream(text, PROSODY);
  const chunks = [];
  await new Promise((resolve, reject) => {
    audioStream.on('data', (c) => chunks.push(c));
    audioStream.on('end', resolve);
    audioStream.on('error', reject);
  });
  tts.close();
  writeFileSync(outPath, Buffer.concat(chunks));
  console.log(`✅  ${outFile}`);
}

const pad2 = (n) => String(n).padStart(2, '0');

for (let i = 0; i < LETTERS.length; i++) {
  const [char, example] = LETTERS[i];
  // Harf tek başına okununca TTS Arapça harf adını söyler (ب → "bâ")
  await synth(`${char}. ${example}`, `letter-${pad2(i + 1)}.mp3`);
}
for (let i = 0; i < HARAKAT_SAMPLES.length; i++) {
  await synth(HARAKAT_SAMPLES[i], `haraka-${pad2(i + 1)}.mp3`);
}
await synth(BESMELE, 'besmele.mp3');
for (const [id, arabic] of DUAS) {
  await synth(arabic, `dua-${id}.mp3`);
}

// require haritasını üret
const letterLines = LETTERS.map((_, i) => `  require('../../assets/sounds/arabic/letter-${pad2(i + 1)}.mp3') as number,`).join('\n');
const harakaLines = HARAKAT_SAMPLES.map((_, i) => `  require('../../assets/sounds/arabic/haraka-${pad2(i + 1)}.mp3') as number,`).join('\n');
const duaLines = DUAS.map(([id]) => `  '${id}': require('../../assets/sounds/arabic/dua-${id}.mp3') as number,`).join('\n');

writeFileSync(
  join(ROOT, 'src', 'data', 'arabic-audio.ts'),
  `/**
 * Çocuk Yolu Arapça ses kayıtları (tools/build-arabic-audio.mjs üretir).
 * Kayıtlar Arap alfabesinin orijinal okunuşuyla, ar-SA sesiyle üretilmiştir;
 * diziler src/data/elifba.ts içindeki ELIFBA/HARAKAT sırasıyla birebir aynıdır.
 * ELLE DÜZENLEMEYİN — betiği çalıştırıp yeniden üretin.
 */

/** ELIFBA[i] harfinin kaydı (harf adı + örnek kelime, Arapça) */
export const LETTER_AUDIO: number[] = [
${letterLines}
];

/** HARAKAT[i] hecesinin kaydı */
export const HARAKA_AUDIO: number[] = [
${harakaLines}
];

export const BESMELE_AUDIO = require('../../assets/sounds/arabic/besmele.mp3') as number;

/** KIDS_DUA_IDS -> dua kaydı */
export const KIDS_DUA_AUDIO: Record<string, number> = {
${duaLines}
};
`,
  'utf8',
);
console.log('✅  src/data/arabic-audio.ts yazıldı');
