/**
 * Tecvit rehberi — kural renkleri, adları ve kısa açıklamaları.
 *
 * Renkler içerik verisidir (tema rengi değildir): her kural mushaf
 * geleneğindeki renkli tecvit baskılarına benzer şekilde kendine özgü
 * bir renkle gösterilir. Açık/koyu tema için ayrı tonlar tanımlıdır.
 *
 * Renk körlüğü modunda (settings.quran.tajweedAccessibleMarks) renk yerine
 * alt çizgi + kural kısaltması rozeti kullanılır.
 *
 * İçerik durumu: demo anotasyonlar uzman (ilahiyat danışma kurulu)
 * kontrolünden geçmemiştir; arayüzde "Uzman kontrolü bekliyor" etiketi ile
 * gösterilir.
 */

import type { TajweedRule } from '@/data/quran';

/** Tecvit içeriği kaynak gösterimi (SourceBadge ile kullanılır). */
export const TAJWEED_SOURCE = 'Klasik tecvit kaynakları (Karabaş Tecvidi vb.) — demo anotasyon';
/** Demo tecvit anotasyonları henüz kurul onayından geçmedi. */
export const TAJWEED_VERIFIED = false;

export interface TajweedRuleInfo {
  rule: TajweedRule;
  /** Kuralın Türkçe adı */
  name: string;
  /** Renk körlüğü modunda gösterilen kısa rozet metni */
  shortCode: string;
  /** Bir cümlelik açıklama */
  description: string;
  /** Açık/koyu temaya göre vurgu rengi */
  color: { light: string; dark: string };
}

export const TAJWEED_RULES: TajweedRuleInfo[] = [
  {
    rule: 'ihfa',
    name: 'İhfâ',
    shortCode: 'ihf',
    description:
      'Sâkin nun (نْ) veya tenvinden sonra ihfâ harflerinden biri gelirse nun sesi gizlenerek genizden (gunneli) okunur.',
    color: { light: '#7B3FA0', dark: '#B98BD9' },
  },
  {
    rule: 'idgam',
    name: 'İdğam',
    shortCode: 'idğ',
    description:
      'Sâkin nun veya tenvin; ي، ن، م، و، ل، ر harflerinden birine katılarak (bazılarında gunneli) okunur.',
    color: { light: '#2A6FB0', dark: '#7FB2E5' },
  },
  {
    rule: 'izhar',
    name: 'İzhâr',
    shortCode: 'izh',
    description:
      'Sâkin nun veya tenvinden sonra boğaz harfleri (ء، ه، ع، ح، غ، خ) gelirse nun açık ve net okunur.',
    color: { light: '#2E7D4F', dark: '#6FC48F' },
  },
  {
    rule: 'iklab',
    name: 'İklâb',
    shortCode: 'ikl',
    description:
      'Sâkin nun veya tenvinden sonra ب gelirse nun sesi mim sesine çevrilerek gunneli okunur.',
    color: { light: '#C06514', dark: '#E8A560' },
  },
  {
    rule: 'med',
    name: 'Med',
    shortCode: 'med',
    description:
      'Med harfleri (ا، و، ي) ile uzatma yapılır; med çeşidine göre bir ile dört elif miktarı arasında uzatılır.',
    color: { light: '#B3402E', dark: '#E58575' },
  },
  {
    rule: 'kalkale',
    name: 'Kalkale',
    shortCode: 'kal',
    description:
      'Kalkale harfleri (ق، ط، ب، ج، د) sâkin olduğunda veya üzerinde durulduğunda kuvvetli bir vurguyla okunur.',
    color: { light: '#8A5A2B', dark: '#CDA36B' },
  },
  {
    rule: 'gunne',
    name: 'Gunne',
    shortCode: 'ğun',
    description: 'Şeddeli nun (نّ) ve şeddeli mim (مّ) genizden gelen sesle uzatılarak okunur.',
    color: { light: '#B0367A', dark: '#E27FB4' },
  },
];

const BY_RULE = new Map<TajweedRule, TajweedRuleInfo>(TAJWEED_RULES.map((r) => [r.rule, r]));

export function getTajweedRuleInfo(rule: TajweedRule): TajweedRuleInfo {
  // BY_RULE bütün TajweedRule değerlerini kapsar.
  return BY_RULE.get(rule) as TajweedRuleInfo;
}
