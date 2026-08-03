/**
 * Kur'an-ı Kerim üst verisi — 114 surenin tamamı.
 *
 * Kaynaklar:
 * - Sure adları, ayet sayıları, nüzul yeri ve cüz bilgisi: Tanzil projesi (quran-data),
 *   Kufe sayımı (toplam 6236 ayet), Hafs/Uthmani tertibi.
 * - Nüzul yeri sınıflandırması Tanzil üst verisini takip eder (28 Medenî sure).
 */

export type TajweedRule = 'ihfa' | 'idgam' | 'izhar' | 'iklab' | 'med' | 'kalkale' | 'gunne';

export interface TajweedSegment {
  text: string;
  rule?: TajweedRule;
}

export interface Ayah {
  number: number;
  arabic: string;
  transliteration: string;
  translation: string;
  tajweed?: TajweedSegment[];
}

export type RevelationPlace = 'mecca' | 'medina';

export interface SurahMeta {
  number: number;
  arabicName: string;
  turkishName: string;
  ayahCount: number;
  revelationPlace: RevelationPlace;
  /** Surenin başladığı cüz numarası (1-30) */
  juz: number;
}

/** Standart mushaf (Hafs) toplam sayfa sayısı — hatim planı hesabında kullanılır. */
export const TOTAL_QURAN_PAGES = 604;
/** Kufe sayımına göre toplam ayet sayısı. */
export const TOTAL_AYAH_COUNT = 6236;

type Raw = [number, string, string, number, RevelationPlace, number];

const RAW: Raw[] = [
  [1, 'الفاتحة', 'Fâtiha', 7, 'mecca', 1],
  [2, 'البقرة', 'Bakara', 286, 'medina', 1],
  [3, 'آل عمران', 'Âl-i İmrân', 200, 'medina', 3],
  [4, 'النساء', 'Nisâ', 176, 'medina', 4],
  [5, 'المائدة', 'Mâide', 120, 'medina', 6],
  [6, 'الأنعام', "En'âm", 165, 'mecca', 7],
  [7, 'الأعراف', "A'râf", 206, 'mecca', 8],
  [8, 'الأنفال', 'Enfâl', 75, 'medina', 9],
  [9, 'التوبة', 'Tevbe', 129, 'medina', 10],
  [10, 'يونس', 'Yûnus', 109, 'mecca', 11],
  [11, 'هود', 'Hûd', 123, 'mecca', 11],
  [12, 'يوسف', 'Yûsuf', 111, 'mecca', 12],
  [13, 'الرعد', "Ra'd", 43, 'medina', 13],
  [14, 'إبراهيم', 'İbrâhîm', 52, 'mecca', 13],
  [15, 'الحجر', 'Hicr', 99, 'mecca', 14],
  [16, 'النحل', 'Nahl', 128, 'mecca', 14],
  [17, 'الإسراء', 'İsrâ', 111, 'mecca', 15],
  [18, 'الكهف', 'Kehf', 110, 'mecca', 15],
  [19, 'مريم', 'Meryem', 98, 'mecca', 16],
  [20, 'طه', 'Tâhâ', 135, 'mecca', 16],
  [21, 'الأنبياء', 'Enbiyâ', 112, 'mecca', 17],
  [22, 'الحج', 'Hac', 78, 'medina', 17],
  [23, 'المؤمنون', "Mü'minûn", 118, 'mecca', 18],
  [24, 'النور', 'Nûr', 64, 'medina', 18],
  [25, 'الفرقان', 'Furkân', 77, 'mecca', 18],
  [26, 'الشعراء', 'Şuarâ', 227, 'mecca', 19],
  [27, 'النمل', 'Neml', 93, 'mecca', 19],
  [28, 'القصص', 'Kasas', 88, 'mecca', 20],
  [29, 'العنكبوت', 'Ankebût', 69, 'mecca', 20],
  [30, 'الروم', 'Rûm', 60, 'mecca', 21],
  [31, 'لقمان', 'Lokmân', 34, 'mecca', 21],
  [32, 'السجدة', 'Secde', 30, 'mecca', 21],
  [33, 'الأحزاب', 'Ahzâb', 73, 'medina', 21],
  [34, 'سبأ', "Sebe'", 54, 'mecca', 22],
  [35, 'فاطر', 'Fâtır', 45, 'mecca', 22],
  [36, 'يس', 'Yâsîn', 83, 'mecca', 22],
  [37, 'الصافات', 'Sâffât', 182, 'mecca', 23],
  [38, 'ص', 'Sâd', 88, 'mecca', 23],
  [39, 'الزمر', 'Zümer', 75, 'mecca', 23],
  [40, 'غافر', "Mü'min (Gâfir)", 85, 'mecca', 24],
  [41, 'فصلت', 'Fussilet', 54, 'mecca', 24],
  [42, 'الشورى', 'Şûrâ', 53, 'mecca', 25],
  [43, 'الزخرف', 'Zuhruf', 89, 'mecca', 25],
  [44, 'الدخان', 'Duhân', 59, 'mecca', 25],
  [45, 'الجاثية', 'Câsiye', 37, 'mecca', 25],
  [46, 'الأحقاف', 'Ahkâf', 35, 'mecca', 26],
  [47, 'محمد', 'Muhammed', 38, 'medina', 26],
  [48, 'الفتح', 'Fetih', 29, 'medina', 26],
  [49, 'الحجرات', 'Hucurât', 18, 'medina', 26],
  [50, 'ق', 'Kâf', 45, 'mecca', 26],
  [51, 'الذاريات', 'Zâriyât', 60, 'mecca', 26],
  [52, 'الطور', 'Tûr', 49, 'mecca', 27],
  [53, 'النجم', 'Necm', 62, 'mecca', 27],
  [54, 'القمر', 'Kamer', 55, 'mecca', 27],
  [55, 'الرحمن', 'Rahmân', 78, 'medina', 27],
  [56, 'الواقعة', 'Vâkıa', 96, 'mecca', 27],
  [57, 'الحديد', 'Hadîd', 29, 'medina', 27],
  [58, 'المجادلة', 'Mücâdele', 22, 'medina', 28],
  [59, 'الحشر', 'Haşr', 24, 'medina', 28],
  [60, 'الممتحنة', 'Mümtehine', 13, 'medina', 28],
  [61, 'الصف', 'Saff', 14, 'medina', 28],
  [62, 'الجمعة', "Cum'a", 11, 'medina', 28],
  [63, 'المنافقون', 'Münâfikûn', 11, 'medina', 28],
  [64, 'التغابن', 'Teğâbün', 18, 'medina', 28],
  [65, 'الطلاق', 'Talâk', 12, 'medina', 28],
  [66, 'التحريم', 'Tahrîm', 12, 'medina', 28],
  [67, 'الملك', 'Mülk', 30, 'mecca', 29],
  [68, 'القلم', 'Kalem', 52, 'mecca', 29],
  [69, 'الحاقة', 'Hâkka', 52, 'mecca', 29],
  [70, 'المعارج', 'Meâric', 44, 'mecca', 29],
  [71, 'نوح', 'Nûh', 28, 'mecca', 29],
  [72, 'الجن', 'Cin', 28, 'mecca', 29],
  [73, 'المزمل', 'Müzzemmil', 20, 'mecca', 29],
  [74, 'المدثر', 'Müddessir', 56, 'mecca', 29],
  [75, 'القيامة', 'Kıyâme', 40, 'mecca', 29],
  [76, 'الإنسان', 'İnsân', 31, 'medina', 29],
  [77, 'المرسلات', 'Mürselât', 50, 'mecca', 29],
  [78, 'النبأ', "Nebe'", 40, 'mecca', 30],
  [79, 'النازعات', 'Nâziât', 46, 'mecca', 30],
  [80, 'عبس', 'Abese', 42, 'mecca', 30],
  [81, 'التكوير', 'Tekvîr', 29, 'mecca', 30],
  [82, 'الانفطار', 'İnfitâr', 19, 'mecca', 30],
  [83, 'المطففين', 'Mutaffifîn', 36, 'mecca', 30],
  [84, 'الانشقاق', 'İnşikâk', 25, 'mecca', 30],
  [85, 'البروج', 'Bürûc', 22, 'mecca', 30],
  [86, 'الطارق', 'Târık', 17, 'mecca', 30],
  [87, 'الأعلى', "A'lâ", 19, 'mecca', 30],
  [88, 'الغاشية', 'Gâşiye', 26, 'mecca', 30],
  [89, 'الفجر', 'Fecr', 30, 'mecca', 30],
  [90, 'البلد', 'Beled', 20, 'mecca', 30],
  [91, 'الشمس', 'Şems', 15, 'mecca', 30],
  [92, 'الليل', 'Leyl', 21, 'mecca', 30],
  [93, 'الضحى', 'Duhâ', 11, 'mecca', 30],
  [94, 'الشرح', 'İnşirâh', 8, 'mecca', 30],
  [95, 'التين', 'Tîn', 8, 'mecca', 30],
  [96, 'العلق', 'Alak', 19, 'mecca', 30],
  [97, 'القدر', 'Kadir', 5, 'mecca', 30],
  [98, 'البينة', 'Beyyine', 8, 'medina', 30],
  [99, 'الزلزلة', 'Zilzâl', 8, 'medina', 30],
  [100, 'العاديات', 'Âdiyât', 11, 'mecca', 30],
  [101, 'القارعة', 'Kâria', 11, 'mecca', 30],
  [102, 'التكاثر', 'Tekâsür', 8, 'mecca', 30],
  [103, 'العصر', 'Asr', 3, 'mecca', 30],
  [104, 'الهمزة', 'Hümeze', 9, 'mecca', 30],
  [105, 'الفيل', 'Fîl', 5, 'mecca', 30],
  [106, 'قريش', 'Kureyş', 4, 'mecca', 30],
  [107, 'الماعون', 'Mâûn', 7, 'mecca', 30],
  [108, 'الكوثر', 'Kevser', 3, 'mecca', 30],
  [109, 'الكافرون', 'Kâfirûn', 6, 'mecca', 30],
  [110, 'النصر', 'Nasr', 3, 'medina', 30],
  [111, 'المسد', 'Tebbet', 5, 'mecca', 30],
  [112, 'الإخلاص', 'İhlâs', 4, 'mecca', 30],
  [113, 'الفلق', 'Felak', 5, 'mecca', 30],
  [114, 'الناس', 'Nâs', 6, 'mecca', 30],
];

export const SURAHS: SurahMeta[] = RAW.map(
  ([number, arabicName, turkishName, ayahCount, revelationPlace, juz]) => ({
    number,
    arabicName,
    turkishName,
    ayahCount,
    revelationPlace,
    juz,
  }),
);

export function getSurahMeta(surah: number): SurahMeta | undefined {
  return SURAHS[surah - 1];
}

export interface JuzInfo {
  /** Cüz numarası (1-30) */
  juz: number;
  /** Cüzün başladığı sure */
  surah: number;
  /** Cüzün başladığı ayet */
  ayah: number;
}

/** Her cüzün başlangıç yeri (Hafs tertibi, Tanzil quran-data). */
export const JUZ_LIST: JuzInfo[] = [
  { juz: 1, surah: 1, ayah: 1 },
  { juz: 2, surah: 2, ayah: 142 },
  { juz: 3, surah: 2, ayah: 253 },
  { juz: 4, surah: 3, ayah: 93 },
  { juz: 5, surah: 4, ayah: 24 },
  { juz: 6, surah: 4, ayah: 148 },
  { juz: 7, surah: 5, ayah: 82 },
  { juz: 8, surah: 6, ayah: 111 },
  { juz: 9, surah: 7, ayah: 88 },
  { juz: 10, surah: 8, ayah: 41 },
  { juz: 11, surah: 9, ayah: 93 },
  { juz: 12, surah: 11, ayah: 6 },
  { juz: 13, surah: 12, ayah: 53 },
  { juz: 14, surah: 15, ayah: 1 },
  { juz: 15, surah: 17, ayah: 1 },
  { juz: 16, surah: 18, ayah: 75 },
  { juz: 17, surah: 21, ayah: 1 },
  { juz: 18, surah: 23, ayah: 1 },
  { juz: 19, surah: 25, ayah: 21 },
  { juz: 20, surah: 27, ayah: 56 },
  { juz: 21, surah: 29, ayah: 46 },
  { juz: 22, surah: 33, ayah: 31 },
  { juz: 23, surah: 36, ayah: 28 },
  { juz: 24, surah: 39, ayah: 32 },
  { juz: 25, surah: 41, ayah: 47 },
  { juz: 26, surah: 46, ayah: 1 },
  { juz: 27, surah: 51, ayah: 31 },
  { juz: 28, surah: 58, ayah: 1 },
  { juz: 29, surah: 67, ayah: 1 },
  { juz: 30, surah: 78, ayah: 1 },
];
