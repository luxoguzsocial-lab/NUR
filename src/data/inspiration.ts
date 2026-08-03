/**
 * Günlük ilham havuzları — ayet mealleri, sahih hadisler, kısa bilgiler,
 * tefekkür soruları ve güvenilir sözler. Günlük seçim deterministiktir:
 * yılın günü (day of year) mod havuz uzunluğu.
 */

import { DUAS, type Dua } from '@/data/duas';
import { ESMA_NAMES, type EsmaName } from '@/data/esma';

export interface InspirationText {
  text: string;
  source: string;
  /** Ayetler için Arapça metin (kartlarda gösterilir) */
  arabic?: string;
}

export interface InspirationQuote {
  text: string;
  author: string;
  source: string;
}

/** Tefekkür sorusu — soru, kaynağı belirtilen ayet/hadisten ilham alır. */
export interface ReflectionQuestion {
  text: string;
  source: string;
}

export const DAILY_AYAHS: InspirationText[] = [
  {
    text: 'Öyleyse beni anın ki ben de sizi anayım. Bana şükredin, nankörlük etmeyin.',
    source: 'Bakara 2:152',
    arabic: 'فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ',
  },
  {
    text: 'Bilesiniz ki kalpler ancak Allah’ı anmakla huzur bulur.',
    source: 'Ra’d 13:28',
    arabic: 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ',
  },
  {
    text: 'Şüphesiz güçlükle beraber bir kolaylık vardır. Gerçekten güçlükle beraber bir kolaylık vardır.',
    source: 'İnşirâh 94:5-6',
    arabic: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا ۝ إِنَّ مَعَ الْعُسْرِ يُسْرًا',
  },
  {
    text:
      'Kullarım sana beni sorduklarında (söyle onlara): Ben çok yakınım. Bana dua ettiğinde dua edenin duasına karşılık veririm.',
    source: 'Bakara 2:186',
    arabic: 'وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ ۖ أُجِيبُ دَعْوَةَ الدَّاعِ إِذَا دَعَانِ',
  },
  {
    text:
      'De ki: Ey kendilerinin aleyhine aşırı giden kullarım! Allah’ın rahmetinden ümidinizi kesmeyin. Şüphesiz Allah bütün günahları affeder.',
    source: 'Zümer 39:53',
    arabic: 'قُلْ يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَىٰ أَنْفُسِهِمْ لَا تَقْنَطُوا مِنْ رَحْمَةِ اللَّهِ ۚ إِنَّ اللَّهَ يَغْفِرُ الذُّنُوبَ جَمِيعًا',
  },
  {
    text: 'Kim Allah’a tevekkül ederse O, ona yeter. Şüphesiz Allah, emrini yerine getirendir.',
    source: 'Talâk 65:3',
    arabic: 'وَمَنْ يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ ۚ إِنَّ اللَّهَ بَالِغُ أَمْرِهِ',
  },
  {
    text: 'Andolsun, eğer şükrederseniz elbette size nimetimi artırırım.',
    source: 'İbrâhîm 14:7',
    arabic: 'لَئِنْ شَكَرْتُمْ لَأَزِيدَنَّكُمْ',
  },
  {
    text:
      'Bizim uğrumuzda çaba gösterenleri elbette kendi yollarımıza eriştireceğiz. Şüphesiz Allah, iyilik yapanlarla beraberdir.',
    source: 'Ankebût 29:69',
    arabic: 'وَالَّذِينَ جَاهَدُوا فِينَا لَنَهْدِيَنَّهُمْ سُبُلَنَا ۚ وَإِنَّ اللَّهَ لَمَعَ الْمُحْسِنِينَ',
  },
  {
    text:
      'Erkek veya kadın, kim mümin olarak salih amel işlerse elbette ona hoş bir hayat yaşatacağız.',
    source: 'Nahl 16:97',
    arabic: 'مَنْ عَمِلَ صَالِحًا مِنْ ذَكَرٍ أَوْ أُنْثَىٰ وَهُوَ مُؤْمِنٌ فَلَنُحْيِيَنَّهُ حَيَاةً طَيِّبَةً',
  },
  {
    text:
      'Andolsun zamana ki insan gerçekten ziyan içindedir. Ancak iman edip salih amel işleyenler, birbirlerine hakkı ve sabrı tavsiye edenler başka.',
    source: 'Asr 103:1-3',
    arabic: 'وَالْعَصْرِ ۝ إِنَّ الْإِنْسَانَ لَفِي خُسْرٍ ۝ إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ',
  },
];

export const DAILY_HADITHS: InspirationText[] = [
  {
    text: 'Ameller ancak niyetlere göredir; herkese niyet ettiği şey vardır.',
    source: 'Buhârî, Bed’ü’l-vahy 1',
  },
  {
    text: 'Sizin en hayırlınız, Kur’an’ı öğrenen ve öğretendir.',
    source: 'Buhârî, Fedâilü’l-Kur’ân 21',
  },
  {
    text: 'Kolaylaştırınız, zorlaştırmayınız; müjdeleyiniz, nefret ettirmeyiniz.',
    source: 'Buhârî, İlim 11',
  },
  {
    text: 'Müslüman, elinden ve dilinden diğer Müslümanların güvende olduğu kimsedir.',
    source: 'Buhârî, Îmân 4',
  },
  {
    text: 'Sizden biriniz, kendisi için istediğini kardeşi için de istemedikçe iman etmiş olmaz.',
    source: 'Buhârî, Îmân 7',
  },
  {
    text: 'Allah sizin suretlerinize ve mallarınıza bakmaz; kalplerinize ve amellerinize bakar.',
    source: 'Müslim, Birr 34',
  },
  {
    text: 'Temizlik imanın yarısıdır.',
    source: 'Müslim, Tahâret 1',
  },
  {
    text: 'Din samimiyettir (nasihattir).',
    source: 'Müslim, Îmân 95',
  },
  {
    text: 'Küçüğümüze merhamet etmeyen, büyüğümüze saygı göstermeyen bizden değildir.',
    source: 'Tirmizî, Birr 15',
  },
  {
    text: 'Kim Allah’a ve ahiret gününe iman ediyorsa ya hayır söylesin ya da sussun.',
    source: 'Buhârî, Edeb 31',
  },
];

export const DAILY_FACTS: InspirationText[] = [
  {
    text:
      'Kur’an-ı Kerim 114 sureden oluşur; en uzun sure Bakara, en kısa sure Kevser’dir.',
    source: 'Kur’an-ı Kerim',
  },
  {
    text:
      'Kur’an’da adıyla anılan tek kadın Hz. Meryem’dir ve 19. sure onun adını taşır.',
    source: 'Meryem sûresi (19)',
  },
  {
    text:
      'İslam beş temel üzerine kurulmuştur: kelime-i şehadet, namaz, zekât, Ramazan orucu ve gücü yetene hac.',
    source: 'Buhârî, Îmân 2; Müslim, Îmân 21',
  },
  {
    text:
      'Hicri takvim, Hz. Peygamber’in (s.a.v.) Mekke’den Medine’ye hicretini başlangıç kabul eden ay takvimidir; bir hicri yıl yaklaşık 354 gündür.',
    source: 'TDV İslâm Ansiklopedisi, “Hicret” maddesi',
  },
  {
    text: 'Ramazan orucu, hicretin ikinci yılında Bakara sûresinin ayetleriyle farz kılınmıştır.',
    source: 'Bakara 2:183-185',
  },
  {
    text:
      'Cuma namazı Kur’an’da açıkça emredilir: “Cuma günü namaz için çağrı yapıldığında Allah’ı anmaya koşun.”',
    source: 'Cum’a 62:9',
  },
  {
    text: 'Kâbe, Kur’an’da “insanlar için kurulan ilk ev” olarak anılır.',
    source: 'Âl-i İmrân 3:96',
  },
  {
    text:
      'Besmele, Tevbe sûresi dışında bütün surelerin başında yer alır; Neml sûresinin 30. ayetinde ise bir ayetin içinde geçer.',
    source: 'Neml 27:30',
  },
  {
    text:
      'Peygamber Efendimize (s.a.v.) ilk vahiy, Ramazan ayında Hira mağarasında “Oku!” emriyle gelmiştir.',
    source: 'Alak 96:1-5; Buhârî, Bed’ü’l-vahy 3',
  },
  {
    text:
      'Zekât, Kur’an’da çoğu yerde namazla birlikte anılır; nisap miktarına ulaşan malın kırkta biri (%2,5) verilir.',
    source: 'Bakara 2:43; TDV İlmihali, Zekât bölümü',
  },
];

export const REFLECTION_QUESTIONS: ReflectionQuestion[] = [
  {
    text: 'Bugün Allah’ın hangi nimetine en çok şükrettin?',
    source: 'İbrâhîm 14:7',
  },
  {
    text: 'Bugün kiminle arandaki kırgınlığı onarabilir, kimden helallik isteyebilirsin?',
    source: 'Hucurât 49:10',
  },
  {
    text: 'Bugün geride bırakacağın en güzel iz ne olabilir?',
    source: 'Zilzâl 99:7',
  },
  {
    text: 'Namazlarında acele mi ediyorsun, yoksa huzuru mu arıyorsun?',
    source: 'Mü’minûn 23:1-2',
  },
  {
    text: 'Bugün diline sahip çıkabildin mi? Söylediklerin kalp mi kırdı, gönül mü aldı?',
    source: 'Buhârî, Edeb 31',
  },
  {
    text: 'Sağlığının ve boş vaktinin kıymetini bugün nasıl değerlendirdin?',
    source: 'Buhârî, Rikāk 1',
  },
  {
    text: 'Bugün kimseye fark ettirmeden bir iyilik yaptın mı?',
    source: 'Bakara 2:271',
  },
  {
    text: 'Dünya işlerinin telaşı bugün Allah’ı anmana engel oldu mu?',
    source: 'Münâfikûn 63:9',
  },
  {
    text: 'Anne babana veya yakınlarına bugün güzel bir söz söyledin mi?',
    source: 'İsrâ 17:23-24',
  },
  {
    text: 'Öfkelendiğinde nasıl davranıyorsun? Bugün öfkeni yutabildin mi?',
    source: 'Âl-i İmrân 3:134',
  },
];

export const TRUSTED_QUOTES: InspirationQuote[] = [
  {
    text: 'İnsanlar bilmedikleri şeyin düşmanıdır.',
    author: 'Hz. Ali (r.a.)',
    source: 'Nehcü’l-Belâga, Hikmetler 172',
  },
  {
    text: 'Hesaba çekilmeden önce kendinizi hesaba çekin.',
    author: 'Hz. Ömer (r.a.)',
    source: 'Tirmizî, Kıyâmet 25 (Hz. Ömer’den nakil)',
  },
  {
    text: 'Amelsiz ilim deliliktir; ilimsiz amel ise boşa gider.',
    author: 'İmam Gazâlî',
    source: 'Eyyühe’l-Veled',
  },
  {
    text: 'Aynı dili konuşanlar değil, aynı gönlü paylaşanlar anlaşır.',
    author: 'Mevlânâ Celâleddîn-i Rûmî',
    source: 'Mesnevî, I. defter',
  },
  {
    text: 'İlim ilim bilmektir, ilim kendin bilmektir.',
    author: 'Yunus Emre',
    source: 'Dîvân',
  },
];

/** Yılın günü (1 Ocak = 1). Cihazın yerel saatine göre hesaplanır. */
export function dayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  return Math.floor((date.getTime() - start.getTime()) / 86_400_000);
}

export interface DailyInspiration {
  dayOfYear: number;
  ayah: InspirationText;
  hadith: InspirationText;
  dua: Dua;
  esma: EsmaName;
  fact: InspirationText;
  reflection: ReflectionQuestion;
  quote: InspirationQuote;
}

/** Deterministik günlük seçim: gün-of-year mod havuz uzunluğu. */
export function getDailyInspiration(date: Date = new Date()): DailyInspiration {
  const doy = dayOfYear(date);
  return {
    dayOfYear: doy,
    ayah: DAILY_AYAHS[doy % DAILY_AYAHS.length]!,
    hadith: DAILY_HADITHS[doy % DAILY_HADITHS.length]!,
    dua: DUAS[doy % DUAS.length]!,
    esma: ESMA_NAMES[doy % ESMA_NAMES.length]!,
    fact: DAILY_FACTS[doy % DAILY_FACTS.length]!,
    reflection: REFLECTION_QUESTIONS[doy % REFLECTION_QUESTIONS.length]!,
    quote: TRUSTED_QUOTES[doy % TRUSTED_QUOTES.length]!,
  };
}
