/**
 * Arapça (harekeli) → Türkçe okunuş (yaklaşık) çevirici.
 *
 * Okuma Koçu için: elle yazılmış okunuşu olmayan ayetlerde kural tabanlı,
 * yaklaşık bir Türkçe okunuş üretir. Türk ilmihal geleneğindeki yazıma
 * (â/î/û uzatmaları, ince/kalın ünlü seçimi, şemsî harf idgamı) yaklaşır;
 * elle yazılmış okunuş her zaman önceliklidir ve arayüzde otomatik üretim
 * "yaklaşık" olarak etiketlenir.
 */

// Hareke ve işaretler
const FATHA = 'َ';
const DAMMA = 'ُ';
const KASRA = 'ِ';
const SUKUN = 'ْ';
const SHADDA = 'ّ';
const FATHATAN = 'ً';
const DAMMATAN = 'ٌ';
const KASRATAN = 'ٍ';
const DAGGER_ALEF = 'ٰ';
const MARKS = new Set([
  FATHA, DAMMA, KASRA, SUKUN, SHADDA, FATHATAN, DAMMATAN, KASRATAN, DAGGER_ALEF,
]);

/** Fetha "a", damme "u" okutan kalın/boğaz harfleri */
const KALIN = new Set(['خ', 'ص', 'ض', 'ط', 'ظ', 'ق', 'غ', 'ر', 'ح', 'ع', 'ا']);

const CONSONANTS: Record<string, string> = {
  ء: "'", أ: '', إ: '', ؤ: "'", ئ: "'",
  ب: 'b', ت: 't', ث: 's', ج: 'c', ح: 'h', خ: 'h',
  د: 'd', ذ: 'z', ر: 'r', ز: 'z', س: 's', ش: 'ş',
  ص: 's', ض: 'd', ط: 't', ظ: 'z', ع: "'", غ: 'ğ',
  ف: 'f', ق: 'k', ك: 'k', ل: 'l', م: 'm', ن: 'n',
  ه: 'h', و: 'v', ي: 'y', ة: 't', ى: '',
};

interface Unit {
  base: string;
  marks: string[];
}

/** Kelimeyi taban harf + ardındaki işaretler birimlerine ayırır. */
function toUnits(word: string): Unit[] {
  const units: Unit[] = [];
  for (const ch of word) {
    if (MARKS.has(ch)) {
      if (units.length > 0) units[units.length - 1].marks.push(ch);
    } else {
      units.push({ base: ch, marks: [] });
    }
  }
  return units;
}

/** Kasrayı "ı" okutan koyu harfler (sırât, mustakîm...) */
const KALIN_I = new Set(['ص', 'ض', 'ط', 'ظ', 'ق', 'غ', 'خ']);

function vowelFor(base: string, mark: string): string {
  const kalin = KALIN.has(base);
  if (mark === FATHA) return kalin ? 'a' : 'e';
  if (mark === DAMMA) return kalin ? 'u' : 'ü';
  if (mark === KASRA) return KALIN_I.has(base) ? 'ı' : 'i';
  return '';
}

function longVowelFor(base: string, mark: string): string {
  if (mark === FATHA) return 'â';
  if (mark === DAMMA) return kalinLong(base, 'û', 'û');
  if (mark === KASRA) return 'î';
  return '';
}

function kalinLong(_base: string, kalin: string, _ince: string): string {
  return kalin;
}

function tanwinFor(base: string, mark: string): string {
  const kalin = KALIN.has(base);
  if (mark === FATHATAN) return kalin ? 'an' : 'en';
  if (mark === DAMMATAN) return kalin ? 'un' : 'ün';
  if (mark === KASRATAN) return 'in';
  return '';
}

/** Hurûf-ı mukattaa: sure başlarındaki tek harfler ad ad okunur. */
const MUKATTAA: Record<string, string> = {
  الم: 'Elif Lâm Mîm',
  الر: 'Elif Lâm Râ',
  المر: 'Elif Lâm Mîm Râ',
  المص: 'Elif Lâm Mîm Sâd',
  كهيعص: 'Kâf Hâ Yâ Ayn Sâd',
  طه: 'Tâ Hâ',
  طسم: 'Tâ Sîn Mîm',
  طس: 'Tâ Sîn',
  يس: 'Yâ Sîn',
  ص: 'Sâd',
  حم: 'Hâ Mîm',
  عسق: 'Ayn Sîn Kâf',
  ق: 'Kâf',
  ن: 'Nûn',
};

function transliterateWord(word: string): string {
  const units = toUnits(word);

  // Mukattaa harfleri harekesiz yazılır; harekeli benzer kelimelerle karışmasın
  const markCount = units.reduce((sum, u) => sum + u.marks.length, 0);
  if (markCount === 0) {
    const mukattaa = MUKATTAA[units.map((u) => u.base).join('')];
    if (mukattaa) return mukattaa;
  }

  // Lafza-i celâl: sonu شeddeli lam + he olan kelimeler (الله، لله، والله...)
  // gizli uzatma ile "llâh" okunur.
  const n = units.length;
  if (
    n >= 3 &&
    units[n - 1].base === 'ه' &&
    units[n - 2].base === 'ل' &&
    units[n - 2].marks.includes(SHADDA) &&
    (units[n - 3].base === 'ل' || units[n - 3].base === 'ا')
  ) {
    const carrier = units[n - 3];
    const before = units.slice(0, n - 3);
    let prefixText = before.length ? transliterateUnits(before, true) : '';
    const carrierHaraka = carrier.marks.find((m) => m === FATHA || m === DAMMA || m === KASRA);
    if (carrier.base === 'ل') {
      // Harekesiz lam "el-" takısıdır, şeddeli lama katılır (Allâh);
      // harekeli lam "li" gibi bir ön ektir (lillâh).
      if (carrierHaraka) prefixText += `l${vowelFor('ل', carrierHaraka)}`;
    } else {
      prefixText += carrierHaraka ? vowelFor('ا', carrierHaraka) : before.length ? '' : 'a';
    }
    const ha = units[n - 1];
    const haHaraka = ha.marks.find((m) => m === FATHA || m === DAMMA || m === KASRA);
    const tail = haHaraka ? vowelFor('ه', haHaraka) : '';
    return `${prefixText}llâh${tail}`;
  }

  return transliterateUnits(units, false);
}

function transliterateUnits(units: Unit[], isPrefix: boolean): string {
  let out = '';
  for (let i = 0; i < units.length; i++) {
    const u = units[i];
    const next = units[i + 1];
    const nextHasShadda = !!next && next.marks.includes(SHADDA);

    // Şemsî idgam: kelime başındaki (elif-)lam, şeddeli harfe katılır
    if (u.base === 'ل' && u.marks.length === 0 && nextHasShadda) continue;

    // Elif: kelime başında hareke taşıyıcısı, ortada uzatma
    if (u.base === 'ا') {
      if (i === 0) {
        const haraka = u.marks.find((m) => m === FATHA || m === DAMMA || m === KASRA);
        if (haraka === FATHA) out += 'a';
        else if (haraka === DAMMA) out += 'u';
        else if (haraka === KASRA) out += 'i';
        else out += isPrefix ? 'a' : 'e'; // vasıl elifi (el-, er-; lafza önünde "A")
      }
      // ortadaki çıplak elif önceki fethayı uzatmıştır (aşağıda ele alınır)
      continue;
    }

    if (u.base === 'آ') {
      out += 'â';
      continue;
    }

    let cons = CONSONANTS[u.base] ?? '';
    // Kelime başındaki hemze/ayn sessizdir ("ehad", "âlemîn")
    if (i === 0 && cons === "'") cons = '';
    // Kelime başındaki şedde (önceki kelimeden idgam) tek okunur: لَّهُ -> "lehü"
    if (u.marks.includes(SHADDA) && cons && out.length > 0) cons += cons;
    out += cons;

    const haraka = u.marks.find((m) => m === FATHA || m === DAMMA || m === KASRA);
    const tanwin = u.marks.find((m) => m === FATHATAN || m === DAMMATAN || m === KASRATAN);

    if (tanwin) {
      out += tanwinFor(u.base, tanwin);
      continue;
    }
    if (!haraka) continue;

    // Uzatma kontrolü: dağar elifi veya ardından gelen çıplak med harfi
    const daggered = u.marks.includes(DAGGER_ALEF);
    const nextBare = next && next.marks.length === 0;
    // "vel'asr" gibi bitişik yazılan "el-" takısı: elif + harekesiz lam uzatma değildir
    const articleAhead =
      next?.base === 'ا' &&
      units[i + 2]?.base === 'ل' &&
      !units[i + 2].marks.some((m) => m === FATHA || m === DAMMA || m === KASRA);
    const longA =
      haraka === FATHA &&
      !articleAhead &&
      (daggered || (nextBare && (next.base === 'ا' || next.base === 'ى')));
    const longU = haraka === DAMMA && nextBare && next.base === 'و';
    const longI = haraka === KASRA && nextBare && next.base === 'ي';

    if (longA || longU || longI) {
      out += longVowelFor(u.base, haraka);
      if (!daggered) i++; // med harfini tüket
    } else {
      out += vowelFor(u.base, haraka);
    }
  }
  return out;
}

/**
 * Harekeli Arapça metinden yaklaşık Türkçe okunuş üretir.
 * Duraklama/secde işaretleri ve tatvil atılır.
 */
export function turkishTransliteration(arabic: string): string {
  const cleaned = arabic
    .replace(/[ۖ-ۭـ۞]/g, '') // vakıf işaretleri, tatvil
    .replace(/\s+/g, ' ')
    .trim();
  const words = cleaned.split(' ').map(transliterateWord).filter(Boolean);
  // Vakıf: ayet sonunda tenvin ve son kısa ünlü düşer (fethateyn "â" olur)
  if (words.length > 0) {
    let last = words[words.length - 1];
    if (/[uü]n$|in$/.test(last) && last.length > 3) last = last.slice(0, -2);
    else if (/[ae]n$/.test(last) && last.length > 3) last = `${last.slice(0, -2)}â`;
    else if (/[aeiuü]$/.test(last) && last.length > 2 && !/[âîû ]$/.test(last)) {
      last = last.slice(0, -1);
    }
    words[words.length - 1] = last;
  }
  const text = words.join(' ');
  return text.charAt(0).toLocaleUpperCase('tr') + text.slice(1);
}
