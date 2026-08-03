/**
 * Okuma Koçu tecvit ipuçları — ayetin Arapça metnindeki harf desenlerinden
 * hangi tecvit kurallarının geçtiğini kabaca tespit eder.
 *
 * Bu bir "kural geçiyor olabilir" işaretidir, harf harf anotasyon değildir;
 * arayüzde tecvit rehberiyle aynı "uzman kontrolü bekliyor" etiketi kullanılır.
 */

import { TAJWEED_RULES, type TajweedRuleInfo } from '@/data/tajweed-guide';

const TENVIN = '[\\u064B\\u064C\\u064D]'; // ً ٌ ٍ
const SUKUN_NUN = 'ن\\u0652'; // نْ
const GAP = '[\\s\\u0640]*'; // boşluk / uzatma çizgisi

/** Sâkin nun veya tenvinden sonra verilen harf grubu geliyor mu? */
function nunThen(letters: string): RegExp {
  return new RegExp(`(?:${SUKUN_NUN}|${TENVIN})${GAP}[${letters}]`);
}

const DETECTORS: { rule: TajweedRuleInfo['rule']; pattern: RegExp }[] = [
  { rule: 'gunne', pattern: /[نم]ّ/ }, // şeddeli nun/mim
  { rule: 'iklab', pattern: nunThen('ب') },
  { rule: 'idgam', pattern: nunThen('ينمولر') },
  { rule: 'izhar', pattern: nunThen('ءهعحغخ') },
  { rule: 'ihfa', pattern: nunThen('تثجدذزسشصضطظفقك') },
  { rule: 'kalkale', pattern: /[قطبجد]ْ/ }, // kalkale harfi + sükun
  { rule: 'med', pattern: /[ٓآٰ]|َا|ِي(?![ًٌٍَُِّْ])|ُو(?![ًٌٍَُِّْ])/ }, // medde, hançer elifi, med harfleri
];

/** Ayette tespit edilen tecvit kuralları (en çok `max` adet). */
export function pickTajweedHints(arabic: string, max = 2): TajweedRuleInfo[] {
  const found: TajweedRuleInfo[] = [];
  for (const { rule, pattern } of DETECTORS) {
    if (found.length >= max) break;
    if (pattern.test(arabic)) {
      const info = TAJWEED_RULES.find((r) => r.rule === rule);
      if (info) found.push(info);
    }
  }
  return found;
}
