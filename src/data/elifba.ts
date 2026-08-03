/**
 * Elifba (Arap alfabesi) — Çocuk Yolu öğrenme verisi.
 *
 * Kaynak: Klasik elifba cüzü sıralaması (Diyanet İşleri Başkanlığı
 * "Kur'an-ı Kerim'i Güzel Okuma" müfredatına uygun harf adları).
 * Örnek kelimeler Kur'an'da geçen basit kelimelerden seçilmiştir.
 */

export const ELIFBA_SOURCE = 'Klasik elifba cüzü (Diyanet harf adları)';

export interface ElifbaLetter {
  /** Harfin tekil (bitişmemiş) biçimi */
  char: string;
  /** Türkçe harf adı (Elif, Be, Te...) */
  name: string;
  /** Çocuk diliyle ses ipucu */
  soundTip: string;
  example: {
    arabic: string;
    transliteration: string;
    meaning: string;
  };
}

export const ELIFBA: ElifbaLetter[] = [
  { char: 'ا', name: 'Elif', soundTip: '"a" ya da "e" sesini taşır', example: { arabic: 'أَحَد', transliteration: 'ehad', meaning: 'bir, tek' } },
  { char: 'ب', name: 'Be', soundTip: '"b" sesi', example: { arabic: 'بَاب', transliteration: 'bâb', meaning: 'kapı' } },
  { char: 'ت', name: 'Te', soundTip: '"t" sesi', example: { arabic: 'تِين', transliteration: 'tîn', meaning: 'incir' } },
  { char: 'ث', name: 'Se', soundTip: 'peltek "s" — dilin ucu dişlerin arasına değer', example: { arabic: 'ثَمَر', transliteration: 'semer', meaning: 'meyve' } },
  { char: 'ج', name: 'Cim', soundTip: '"c" sesi', example: { arabic: 'جَنَّة', transliteration: 'cennet', meaning: 'cennet' } },
  { char: 'ح', name: 'Ha', soundTip: 'boğazdan yumuşak "h"', example: { arabic: 'حَمْد', transliteration: 'hamd', meaning: 'övgü, şükür' } },
  { char: 'خ', name: 'Hı', soundTip: 'hırıltılı "h"', example: { arabic: 'خَيْر', transliteration: 'hayr', meaning: 'iyilik' } },
  { char: 'د', name: 'Dal', soundTip: '"d" sesi', example: { arabic: 'دِين', transliteration: 'dîn', meaning: 'din' } },
  { char: 'ذ', name: 'Zel', soundTip: 'peltek "z" — dilin ucu dişlere değer', example: { arabic: 'ذِكْر', transliteration: 'zikr', meaning: 'anma' } },
  { char: 'ر', name: 'Ra', soundTip: '"r" sesi', example: { arabic: 'رَحْمَة', transliteration: 'rahmet', meaning: 'merhamet' } },
  { char: 'ز', name: 'Ze', soundTip: '"z" sesi', example: { arabic: 'زَيْتُون', transliteration: 'zeytûn', meaning: 'zeytin' } },
  { char: 'س', name: 'Sin', soundTip: '"s" sesi', example: { arabic: 'سَلَام', transliteration: 'selâm', meaning: 'esenlik' } },
  { char: 'ش', name: 'Şın', soundTip: '"ş" sesi', example: { arabic: 'شَمْس', transliteration: 'şems', meaning: 'güneş' } },
  { char: 'ص', name: 'Sad', soundTip: 'kalın "s" — dudaklar yuvarlak', example: { arabic: 'صَبْر', transliteration: 'sabr', meaning: 'sabır' } },
  { char: 'ض', name: 'Dad', soundTip: 'kalın "d"', example: { arabic: 'ضِيَاء', transliteration: 'dıyâ', meaning: 'ışık' } },
  { char: 'ط', name: 'Tı', soundTip: 'kalın "t"', example: { arabic: 'طَيْر', transliteration: 'tayr', meaning: 'kuş' } },
  { char: 'ظ', name: 'Zı', soundTip: 'kalın peltek "z"', example: { arabic: 'ظِلّ', transliteration: 'zıll', meaning: 'gölge' } },
  { char: 'ع', name: 'Ayn', soundTip: 'boğazın ortasından gelir', example: { arabic: 'عِلْم', transliteration: 'ilm', meaning: 'bilgi' } },
  { char: 'غ', name: 'Ğayn', soundTip: 'yumuşak "ğ" — gargara gibi', example: { arabic: 'غَار', transliteration: 'ğâr', meaning: 'mağara' } },
  { char: 'ف', name: 'Fe', soundTip: '"f" sesi', example: { arabic: 'فَجْر', transliteration: 'fecr', meaning: 'tan vakti' } },
  { char: 'ق', name: 'Kaf', soundTip: 'kalın "k" — boğaza yakın', example: { arabic: 'قَمَر', transliteration: 'kamer', meaning: 'ay' } },
  { char: 'ك', name: 'Kef', soundTip: 'ince "k"', example: { arabic: 'كِتَاب', transliteration: 'kitâb', meaning: 'kitap' } },
  { char: 'ل', name: 'Lam', soundTip: '"l" sesi', example: { arabic: 'لَيْل', transliteration: 'leyl', meaning: 'gece' } },
  { char: 'م', name: 'Mim', soundTip: '"m" sesi', example: { arabic: 'مَاء', transliteration: 'mâ', meaning: 'su' } },
  { char: 'ن', name: 'Nun', soundTip: '"n" sesi', example: { arabic: 'نُور', transliteration: 'nûr', meaning: 'ışık, nur' } },
  { char: 'ه', name: 'He', soundTip: 'yumuşak "h"', example: { arabic: 'هُدَى', transliteration: 'hüdâ', meaning: 'doğru yol' } },
  { char: 'و', name: 'Vav', soundTip: '"v" sesi — "u/ü"yü de uzatır', example: { arabic: 'وَرْد', transliteration: 'verd', meaning: 'gül' } },
  { char: 'ي', name: 'Ye', soundTip: '"y" sesi — "i"yi de uzatır', example: { arabic: 'يَد', transliteration: 'yed', meaning: 'el' } },
];

export interface HarakaInfo {
  /** İşaretin be harfi üzerindeki örneği */
  sample: string;
  name: string;
  turkishName: string;
  description: string;
  /** be harfiyle okunuşu */
  reading: string;
}

export const HARAKAT: HarakaInfo[] = [
  { sample: 'بَ', name: 'Fetha', turkishName: 'Üstün', description: 'Harfin üstüne konur, "e" ya da "a" okutur.', reading: 'be' },
  { sample: 'بِ', name: 'Kesra', turkishName: 'Esre', description: 'Harfin altına konur, "i" okutur.', reading: 'bi' },
  { sample: 'بُ', name: 'Damme', turkishName: 'Ötre', description: 'Harfin üstüne konur, "u" ya da "ü" okutur.', reading: 'bü' },
  { sample: 'بْ', name: 'Sükûn', turkishName: 'Cezm', description: 'Harfi sessiz bırakır; harf kendinden önceki sese katılır.', reading: 'b' },
  { sample: 'بّ', name: 'Şedde', turkishName: 'Şedde', description: 'Harfi iki kez okutur: bir sessiz, bir sesli.', reading: 'bbe' },
  { sample: 'بً', name: 'Tenvin', turkishName: 'Tenvin', description: 'Kelime sonunda "en/an, in, ün/un" sesi katar.', reading: 'ben' },
];

/** Çocuk Yolu kısa sure listesi (kolaydan zora) */
export const KIDS_SURAHS: number[] = [1, 112, 113, 114, 108, 103];

/** Çocuk Yolu duaları: duas.ts içindeki bu id'ler + besmele kartı */
export const KIDS_DUA_IDS: string[] = [
  'yemek-baslarken',
  'yemek-sonrasi',
  'uyku-yatarken',
  'uyku-uyaninca',
];
