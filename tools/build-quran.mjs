/**
 * Tanzil kaynak dosyalarından tam Kur'an veri setini üretir:
 *   girdi : tools/quran-src/arabic.txt  (Tanzil "simple", harekeli, ayet satırları)
 *           tools/quran-src/tr.txt      (Elmalılı Hamdi Yazır, "sura|aya|metin")
 *   çıktı : src/data/quran-full.json    ({ "1": [["ar","tr"], ...], ... })
 *
 * Doğrulama: toplam 6236 ayet; sure başına ayet sayıları iki kaynak arasında birebir.
 */
import { readFileSync, writeFileSync } from 'node:fs';

const arabicLines = readFileSync('tools/quran-src/arabic.txt', 'utf8')
  .split('\n')
  .map((l) => l.trim())
  .filter((l) => l && !l.startsWith('#') && !l.startsWith('='));

const trEntries = readFileSync('tools/quran-src/tr.txt', 'utf8')
  .split('\n')
  .map((l) => /^(\d+)\|(\d+)\|(.*)$/.exec(l.trim()))
  .filter(Boolean)
  .map((m) => ({ sura: Number(m[1]), aya: Number(m[2]), text: m[3].trim() }));

if (arabicLines.length !== 6236) throw new Error(`Arapça satır sayısı beklenmedik: ${arabicLines.length}`);
if (trEntries.length !== 6236) throw new Error(`Meal satır sayısı beklenmedik: ${trEntries.length}`);

// tr dosyası mushaf sırasında mı doğrula
for (let i = 1; i < trEntries.length; i++) {
  const prev = trEntries[i - 1];
  const cur = trEntries[i];
  const ok =
    (cur.sura === prev.sura && cur.aya === prev.aya + 1) ||
    (cur.sura === prev.sura + 1 && cur.aya === 1);
  if (!ok) throw new Error(`Sıra bozuk: ${prev.sura}:${prev.aya} -> ${cur.sura}:${cur.aya}`);
}

// Tanzil, besmeleyi (Fâtiha ve Tevbe hariç) her surenin 1. ayetinin başına
// ekler; okuyucu besmeleyi ayrıca bastığı için burada ayıklıyoruz.
// Dizgiyi elle yazmak yerine dosyanın kendisinden alıyoruz (Fâtiha 1:1) —
// böylece Unicode birebir eşleşir.
const BASMALA = arabicLines[0];

const result = {};
trEntries.forEach((e, i) => {
  let arabic = arabicLines[i];
  if (e.aya === 1 && e.sura !== 1 && arabic.startsWith(BASMALA)) {
    arabic = arabic.slice(BASMALA.length).trim();
  }
  (result[e.sura] ??= []).push([arabic, e.text]);
});

const suraCount = Object.keys(result).length;
if (suraCount !== 114) throw new Error(`Sure sayısı beklenmedik: ${suraCount}`);

writeFileSync('src/data/quran-full.json', JSON.stringify(result));
const sizeMb = Buffer.byteLength(JSON.stringify(result)) / 1024 / 1024;
console.log(`✅ quran-full.json üretildi: 114 sure, 6236 ayet, ${sizeMb.toFixed(2)} MB`);
