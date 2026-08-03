import { hijriMonthLength, hijriToGregorian, toHijri } from '@/lib/hijri';

export type ReligiousDayType = 'eid' | 'kandil' | 'holy' | 'start';

export interface ReligiousDayDef {
  id: string;
  /** 1-12 */
  hijriMonth: number;
  /** Ayın günü; Regaib gibi kurala bağlı günler için fonksiyonla hesaplanır */
  hijriDay?: number;
  type: ReligiousDayType;
}

export interface ReligiousDayOccurrence {
  id: string;
  type: ReligiousDayType;
  date: Date;
  hijriYear: number;
}

/** Sabit hicri tarihli günler. Adlar ve açıklamalar i18n'de `religiousDays.<id>` altındadır. */
export const RELIGIOUS_DAYS: ReligiousDayDef[] = [
  { id: 'hijriNewYear', hijriMonth: 1, hijriDay: 1, type: 'start' },
  { id: 'ashura', hijriMonth: 1, hijriDay: 10, type: 'holy' },
  { id: 'mawlid', hijriMonth: 3, hijriDay: 12, type: 'kandil' },
  { id: 'threeMonthsStart', hijriMonth: 7, hijriDay: 1, type: 'start' },
  { id: 'miraj', hijriMonth: 7, hijriDay: 27, type: 'kandil' },
  { id: 'baraat', hijriMonth: 8, hijriDay: 15, type: 'kandil' },
  { id: 'ramadanStart', hijriMonth: 9, hijriDay: 1, type: 'start' },
  { id: 'qadr', hijriMonth: 9, hijriDay: 27, type: 'kandil' },
  { id: 'eidFitrEve', hijriMonth: 9, type: 'holy' }, // Ramazan'ın son günü (arefe)
  { id: 'eidFitr', hijriMonth: 10, hijriDay: 1, type: 'eid' },
  { id: 'eidAdhaEve', hijriMonth: 12, hijriDay: 9, type: 'holy' },
  { id: 'eidAdha', hijriMonth: 12, hijriDay: 10, type: 'eid' },
];

/** Regaib Kandili: Recep ayının ilk cuma gecesi (perşembe akşamı). */
function regaibDate(hijriYear: number): Date {
  const rajabFirst = hijriToGregorian({ year: hijriYear, month: 7, day: 1 });
  const d = new Date(rajabFirst);
  // İlk cumayı bul, gecesi bir önceki gün (perşembe) başlar
  while (d.getDay() !== 5) d.setDate(d.getDate() + 1);
  d.setDate(d.getDate() - 1);
  return d;
}

function occurrencesForHijriYear(hijriYear: number): ReligiousDayOccurrence[] {
  const list: ReligiousDayOccurrence[] = RELIGIOUS_DAYS.map((def) => {
    const day =
      def.id === 'eidFitrEve'
        ? hijriMonthLength(hijriYear, 9)
        : (def.hijriDay ?? 1);
    return {
      id: def.id,
      type: def.type,
      hijriYear,
      date: hijriToGregorian({ year: hijriYear, month: def.hijriMonth, day }),
    };
  });
  list.push({ id: 'ragaib', type: 'kandil', hijriYear, date: regaibDate(hijriYear) });
  return list;
}

export function upcomingReligiousDays(from: Date, count: number): ReligiousDayOccurrence[] {
  const hijriYear = toHijri(from).year;
  const all = [
    ...occurrencesForHijriYear(hijriYear),
    ...occurrencesForHijriYear(hijriYear + 1),
  ];
  const startOfDay = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  return all
    .filter((o) => o.date.getTime() >= startOfDay.getTime())
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, count);
}

export function religiousDaysBetween(start: Date, end: Date): ReligiousDayOccurrence[] {
  const y1 = toHijri(start).year;
  const y2 = toHijri(end).year;
  const all: ReligiousDayOccurrence[] = [];
  for (let y = y1; y <= y2; y++) all.push(...occurrencesForHijriYear(y));
  return all
    .filter((o) => o.date.getTime() >= start.getTime() && o.date.getTime() <= end.getTime())
    .sort((a, b) => a.date.getTime() - b.date.getTime());
}
