/**
 * Demo içerik paketi — Kur'an metni alt kümesi.
 *
 * Kapsam: Fâtiha (1), seçme Bakara ayetleri (2:255 Âyetü'l-Kürsî, 2:285-286)
 * ve Duhâ'dan Nâs'a (93-114) kadar olan surelerin tamamı.
 *
 * Kaynaklar:
 * - Arapça metin: Tanzil projesi (Hafs/Uthmani) — CC BY-ND lisansı.
 * - Türkçe meal: Elmalılı Hamdi Yazır (sadeleştirilmiş, kamu malı).
 * - Transkripsiyon: Türkçe okunuş geleneğine göre yazılmıştır; telaffuz için
 *   mutlaka sesli okuma ve bir hocadan tashih esas alınmalıdır.
 *
 * Tam Kur'an metni yayın sürümünde aynı kaynaklardan yüklenecektir.
 */

import type { Ayah } from '@/data/quran';

/** Arapça metin kaynağı — okuma ekranında SourceBadge ile gösterilir. */
export const QURAN_TEXT_SOURCE = 'Tanzil (Hafs/Uthmani)';
/** Meal kaynağı — okuma ekranında SourceBadge ile gösterilir. */
export const QURAN_TRANSLATION_SOURCE = 'Elmalılı Hamdi Yazır (sadeleştirilmiş)';

/** Besmele — Tevbe suresi hariç sure başlarında gösterilir. */
export const BESMELE_ARABIC = 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ';
export const BESMELE_TRANSLITERATION = 'Bismillâhirrahmânirrahîm';

export interface SurahText {
  surah: number;
  /**
   * false ise demo pakette surenin yalnızca seçme ayetleri vardır
   * (okuma ekranı bunu açıklayan bir not gösterir).
   */
  complete: boolean;
  ayahs: Ayah[];
}

const FATIHA: SurahText = {
  surah: 1,
  complete: true,
  ayahs: [
    {
      number: 1,
      arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
      transliteration: 'Bismillâhirrahmânirrahîm.',
      translation: "Rahmân ve Rahîm olan Allah'ın adıyla.",
      tajweed: [
        { text: 'بِسْمِ اللَّهِ ' },
        { text: 'الرَّحْمَٰنِ', rule: 'med' },
        { text: ' ' },
        { text: 'الرَّحِيمِ', rule: 'med' },
      ],
    },
    {
      number: 2,
      arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
      transliteration: "Elhamdü lillâhi rabbil'âlemîn.",
      translation: "Hamd, âlemlerin Rabbi olan Allah'a mahsustur.",
      tajweed: [{ text: 'الْحَمْدُ لِلَّهِ رَبِّ ' }, { text: 'الْعَالَمِينَ', rule: 'med' }],
    },
    {
      number: 3,
      arabic: 'الرَّحْمَٰنِ الرَّحِيمِ',
      transliteration: 'Errahmânirrahîm.',
      translation: "O Rahmân'dır, Rahîm'dir.",
      tajweed: [{ text: 'الرَّحْمَٰنِ', rule: 'med' }, { text: ' ' }, { text: 'الرَّحِيمِ', rule: 'med' }],
    },
    {
      number: 4,
      arabic: 'مَالِكِ يَوْمِ الدِّينِ',
      transliteration: 'Mâliki yevmiddîn.',
      translation: 'Din (hesap) gününün sahibidir.',
      tajweed: [{ text: 'مَالِكِ', rule: 'med' }, { text: ' يَوْمِ ' }, { text: 'الدِّينِ', rule: 'med' }],
    },
    {
      number: 5,
      arabic: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
      transliteration: "İyyâke na'büdü ve iyyâke neste'în.",
      translation: 'Ancak sana ibadet ederiz ve yalnız senden yardım dileriz.',
      tajweed: [
        { text: 'إِيَّاكَ', rule: 'med' },
        { text: ' نَعْبُدُ وَ' },
        { text: 'إِيَّاكَ', rule: 'med' },
        { text: ' ' },
        { text: 'نَسْتَعِينُ', rule: 'med' },
      ],
    },
    {
      number: 6,
      arabic: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
      transliteration: 'İhdinas-sırâtal müstekîm.',
      translation: 'Bizi doğru yola ilet.',
      tajweed: [
        { text: 'اهْدِنَا ' },
        { text: 'الصِّرَاطَ', rule: 'med' },
        { text: ' ' },
        { text: 'الْمُسْتَقِيمَ', rule: 'med' },
      ],
    },
    {
      number: 7,
      arabic:
        'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
      transliteration: "Sırâtallezîne en'amte aleyhim gayril mağdûbi aleyhim veleddâllîn.",
      translation:
        'Kendilerine nimet verdiklerinin yoluna; gazaba uğrayanların ve sapmışların yoluna değil.',
      tajweed: [
        { text: 'صِرَاطَ الَّذِينَ ' },
        { text: 'أَنْعَمْتَ', rule: 'izhar' },
        { text: ' عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا ' },
        { text: 'الضَّالِّينَ', rule: 'med' },
      ],
    },
  ],
};

/** Bakara'dan seçme ayetler: Âyetü'l-Kürsî (255) ve sure sonu (285-286). */
const BAKARA_SELECTION: SurahText = {
  surah: 2,
  complete: false,
  ayahs: [
    {
      number: 255,
      arabic:
        'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ',
      transliteration:
        "Allâhü lâ ilâhe illâ hüvel hayyül kayyûm. Lâ te'huzühû sinetün velâ nevm. Lehû mâ fis-semâvâti ve mâ fil-ard. Men zellezî yeşfeu indehû illâ bi-iznih. Ya'lemü mâ beyne eydîhim ve mâ halfehüm. Velâ yühîtûne bi-şey'in min ilmihî illâ bimâ şâe. Vesia kürsiyyühüs-semâvâti vel-ard. Velâ yeûdühû hıfzuhümâ. Ve hüvel aliyyül azîm.",
      translation:
        "Allah'tan başka hiçbir ilâh yoktur. O daima diridir, bütün varlığı ayakta tutandır. O'nu ne uyuklama tutar ne de uyku. Göklerde ve yerde ne varsa hepsi O'nundur. İzni olmadan O'nun katında kim şefaat edebilir? O, kullarının önlerindekini ve arkalarındakini bilir. Onlar, O'nun ilminden ancak dilediği kadarını kavrayabilirler. O'nun kürsüsü gökleri ve yeri kuşatmıştır; onları koruyup gözetmek O'na ağır gelmez. O, yücedir, büyüktür.",
    },
    {
      number: 285,
      arabic:
        'آمَنَ الرَّسُولُ بِمَا أُنْزِلَ إِلَيْهِ مِنْ رَبِّهِ وَالْمُؤْمِنُونَ ۚ كُلٌّ آمَنَ بِاللَّهِ وَمَلَائِكَتِهِ وَكُتُبِهِ وَرُسُلِهِ لَا نُفَرِّقُ بَيْنَ أَحَدٍ مِنْ رُسُلِهِ ۚ وَقَالُوا سَمِعْنَا وَأَطَعْنَا ۖ غُفْرَانَكَ رَبَّنَا وَإِلَيْكَ الْمَصِيرُ',
      transliteration:
        "Âmener-rasûlü bimâ ünzile ileyhi mir-rabbihî vel-mü'minûn. Küllün âmene billâhi ve melâiketihî ve kütübihî ve rusülih. Lâ nüferriku beyne ehadin mir-rusülih. Ve kâlû semi'nâ ve ata'nâ. Gufrâneke rabbenâ ve ileykel masîr.",
      translation:
        "Peygamber, Rabbinden kendisine indirilene iman etti, müminler de iman ettiler. Hepsi Allah'a, meleklerine, kitaplarına ve peygamberlerine iman ettiler. 'Allah'ın peygamberlerinden hiçbiri arasında ayrım yapmayız. İşittik ve itaat ettik. Ey Rabbimiz, bağışlamanı dileriz; dönüş yalnız sanadır.' dediler.",
    },
    {
      number: 286,
      arabic:
        'لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا ۚ لَهَا مَا كَسَبَتْ وَعَلَيْهَا مَا اكْتَسَبَتْ ۗ رَبَّنَا لَا تُؤَاخِذْنَا إِنْ نَسِينَا أَوْ أَخْطَأْنَا ۚ رَبَّنَا وَلَا تَحْمِلْ عَلَيْنَا إِصْرًا كَمَا حَمَلْتَهُ عَلَى الَّذِينَ مِنْ قَبْلِنَا ۚ رَبَّنَا وَلَا تُحَمِّلْنَا مَا لَا طَاقَةَ لَنَا بِهِ ۖ وَاعْفُ عَنَّا وَاغْفِرْ لَنَا وَارْحَمْنَا ۚ أَنْتَ مَوْلَانَا فَانْصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ',
      transliteration:
        "Lâ yükellifullâhü nefsen illâ vüs'ahâ. Lehâ mâ kesebet ve aleyhâ mektesebet. Rabbenâ lâ tüâhıznâ in nesînâ ev ahta'nâ. Rabbenâ velâ tahmil aleynâ ısran kemâ hameltehû alellezîne min kablinâ. Rabbenâ velâ tühammilnâ mâ lâ tâkate lenâ bih. Va'fü annâ vağfir lenâ verhamnâ. Ente mevlânâ fensurnâ alel kavmil kâfirîn.",
      translation:
        'Allah hiç kimseye gücünün yeteceğinden fazlasını yüklemez. Herkesin kazandığı iyilik kendi yararına, işlediği kötülük de kendi zararınadır. Ey Rabbimiz! Unutur veya yanılırsak bizi sorumlu tutma. Ey Rabbimiz! Bizden öncekilere yüklediğin gibi bize de ağır yük yükleme. Ey Rabbimiz! Gücümüzün yetmediği şeyleri bize taşıtma. Bizi affet, bizi bağışla, bize merhamet et. Sen bizim Mevlâmızsın; kâfirler topluluğuna karşı bize yardım et.',
    },
  ],
};

const DUHA: SurahText = {
  surah: 93,
  complete: true,
  ayahs: [
    {
      number: 1,
      arabic: 'وَالضُّحَىٰ',
      transliteration: 'Vedduhâ.',
      translation: 'Kuşluk vaktine yemin olsun,',
    },
    {
      number: 2,
      arabic: 'وَاللَّيْلِ إِذَا سَجَىٰ',
      transliteration: 'Velleyli izâ secâ.',
      translation: 'sükûna erdiği zaman geceye ki,',
    },
    {
      number: 3,
      arabic: 'مَا وَدَّعَكَ رَبُّكَ وَمَا قَلَىٰ',
      transliteration: "Mâ vedde'ake rabbüke ve mâ kalâ.",
      translation: 'Rabbin seni bırakmadı ve sana darılmadı.',
    },
    {
      number: 4,
      arabic: 'وَلَلْآخِرَةُ خَيْرٌ لَكَ مِنَ الْأُولَىٰ',
      transliteration: 'Ve lel-âhıratü hayrun leke minel ûlâ.',
      translation: 'Elbette ahiret senin için dünyadan daha hayırlıdır.',
    },
    {
      number: 5,
      arabic: 'وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ',
      transliteration: "Ve lesevfe yu'tîke rabbüke feterdâ.",
      translation: 'Rabbin sana verecek ve sen hoşnut olacaksın.',
    },
    {
      number: 6,
      arabic: 'أَلَمْ يَجِدْكَ يَتِيمًا فَآوَىٰ',
      transliteration: 'Elem yecidke yetîmen feâvâ.',
      translation: 'O seni yetim bulup barındırmadı mı?',
    },
    {
      number: 7,
      arabic: 'وَوَجَدَكَ ضَالًّا فَهَدَىٰ',
      transliteration: 'Ve vecedeke dâllen fehedâ.',
      translation: 'Seni yol bilmez hâlde bulup doğru yola iletmedi mi?',
    },
    {
      number: 8,
      arabic: 'وَوَجَدَكَ عَائِلًا فَأَغْنَىٰ',
      transliteration: 'Ve vecedeke âilen feağnâ.',
      translation: 'Seni yoksul bulup zengin etmedi mi?',
    },
    {
      number: 9,
      arabic: 'فَأَمَّا الْيَتِيمَ فَلَا تَقْهَرْ',
      transliteration: 'Fe emmel yetîme felâ takher.',
      translation: 'Öyleyse sakın yetimi ezme.',
    },
    {
      number: 10,
      arabic: 'وَأَمَّا السَّائِلَ فَلَا تَنْهَرْ',
      transliteration: 'Ve emmes-sâile felâ tenher.',
      translation: 'İsteyeni de azarlama.',
    },
    {
      number: 11,
      arabic: 'وَأَمَّا بِنِعْمَةِ رَبِّكَ فَحَدِّثْ',
      transliteration: "Ve emmâ bi-ni'meti rabbike fehaddis.",
      translation: 'Ve Rabbinin nimetini anlat.',
    },
  ],
};

const INSIRAH: SurahText = {
  surah: 94,
  complete: true,
  ayahs: [
    {
      number: 1,
      arabic: 'أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ',
      transliteration: 'Elem neşrah leke sadrek.',
      translation: 'Biz senin göğsünü açıp genişletmedik mi?',
    },
    {
      number: 2,
      arabic: 'وَوَضَعْنَا عَنْكَ وِزْرَكَ',
      transliteration: "Ve vada'nâ anke vizrek.",
      translation: 'Yükünü senden alıp atmadık mı?',
    },
    {
      number: 3,
      arabic: 'الَّذِي أَنْقَضَ ظَهْرَكَ',
      transliteration: 'Ellezî enkada zahrek.',
      translation: 'O yük ki belini bükmüştü.',
    },
    {
      number: 4,
      arabic: 'وَرَفَعْنَا لَكَ ذِكْرَكَ',
      transliteration: "Ve refa'nâ leke zikrek.",
      translation: 'Senin şanını yüceltmedik mi?',
    },
    {
      number: 5,
      arabic: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا',
      transliteration: "Fe inne me'al usri yüsrâ.",
      translation: 'Şüphesiz her güçlükle beraber bir kolaylık vardır.',
    },
    {
      number: 6,
      arabic: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا',
      transliteration: "İnne me'al usri yüsrâ.",
      translation: 'Gerçekten her güçlükle beraber bir kolaylık vardır.',
    },
    {
      number: 7,
      arabic: 'فَإِذَا فَرَغْتَ فَانْصَبْ',
      transliteration: 'Fe izâ ferağte fensab.',
      translation: 'Öyleyse bir işi bitirince hemen başka bir işe koyul.',
    },
    {
      number: 8,
      arabic: 'وَإِلَىٰ رَبِّكَ فَارْغَبْ',
      transliteration: 'Ve ilâ rabbike ferğab.',
      translation: 'Ve yalnız Rabbine yönel.',
    },
  ],
};

const TIN: SurahText = {
  surah: 95,
  complete: true,
  ayahs: [
    {
      number: 1,
      arabic: 'وَالتِّينِ وَالزَّيْتُونِ',
      transliteration: 'Vettîni vezzeytûn.',
      translation: 'İncire ve zeytine yemin olsun,',
    },
    {
      number: 2,
      arabic: 'وَطُورِ سِينِينَ',
      transliteration: 'Ve tûri sînîn.',
      translation: 'Sina dağına,',
    },
    {
      number: 3,
      arabic: 'وَهَٰذَا الْبَلَدِ الْأَمِينِ',
      transliteration: 'Ve hâzel beledil emîn.',
      translation: "ve bu güvenli şehre (Mekke'ye) ki,",
    },
    {
      number: 4,
      arabic: 'لَقَدْ خَلَقْنَا الْإِنْسَانَ فِي أَحْسَنِ تَقْوِيمٍ',
      transliteration: 'Lekad halaknel insâne fî ahseni takvîm.',
      translation: 'biz insanı en güzel biçimde yarattık.',
    },
    {
      number: 5,
      arabic: 'ثُمَّ رَدَدْنَاهُ أَسْفَلَ سَافِلِينَ',
      transliteration: 'Sümme radednâhü esfele sâfilîn.',
      translation: 'Sonra onu aşağıların aşağısına indirdik.',
    },
    {
      number: 6,
      arabic:
        'إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ فَلَهُمْ أَجْرٌ غَيْرُ مَمْنُونٍ',
      transliteration:
        'İllellezîne âmenû ve amilûs-sâlihâti felehüm ecrun gayru memnûn.',
      translation:
        'Ancak iman edip salih amel işleyenler başka; onlar için kesintisiz bir mükâfat vardır.',
    },
    {
      number: 7,
      arabic: 'فَمَا يُكَذِّبُكَ بَعْدُ بِالدِّينِ',
      transliteration: "Femâ yükezzibüke ba'dü bid-dîn.",
      translation: 'Öyleyse bundan sonra sana dini (hesabı) yalanlatan nedir?',
    },
    {
      number: 8,
      arabic: 'أَلَيْسَ اللَّهُ بِأَحْكَمِ الْحَاكِمِينَ',
      transliteration: 'Eleysallâhü bi-ahkemil hâkimîn.',
      translation: 'Allah, hüküm verenlerin en üstünü değil midir?',
    },
  ],
};

const ALAK: SurahText = {
  surah: 96,
  complete: true,
  ayahs: [
    {
      number: 1,
      arabic: 'اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ',
      transliteration: "İkra' bismi rabbikellezî halak.",
      translation: 'Yaratan Rabbinin adıyla oku!',
    },
    {
      number: 2,
      arabic: 'خَلَقَ الْإِنْسَانَ مِنْ عَلَقٍ',
      transliteration: 'Halakal insâne min alak.',
      translation: 'O, insanı bir alaktan (embriyodan) yarattı.',
    },
    {
      number: 3,
      arabic: 'اقْرَأْ وَرَبُّكَ الْأَكْرَمُ',
      transliteration: "İkra' ve rabbükel ekrem.",
      translation: 'Oku! Rabbin sonsuz kerem sahibidir.',
    },
    {
      number: 4,
      arabic: 'الَّذِي عَلَّمَ بِالْقَلَمِ',
      transliteration: 'Ellezî alleme bil-kalem.',
      translation: 'O, kalemle (yazmayı) öğretendir.',
    },
    {
      number: 5,
      arabic: 'عَلَّمَ الْإِنْسَانَ مَا لَمْ يَعْلَمْ',
      transliteration: "Allemel insâne mâ lem ya'lem.",
      translation: 'İnsana bilmediğini öğretti.',
    },
    {
      number: 6,
      arabic: 'كَلَّا إِنَّ الْإِنْسَانَ لَيَطْغَىٰ',
      transliteration: 'Kellâ innel insâne leyatğâ.',
      translation: 'Hayır! Gerçekten insan azgınlaşır,',
    },
    {
      number: 7,
      arabic: 'أَنْ رَآهُ اسْتَغْنَىٰ',
      transliteration: 'En raâhüstağnâ.',
      translation: 'kendini yeterli (zengin) gördüğü için.',
    },
    {
      number: 8,
      arabic: 'إِنَّ إِلَىٰ رَبِّكَ الرُّجْعَىٰ',
      transliteration: "İnne ilâ rabbiker-ruc'â.",
      translation: 'Şüphesiz dönüş yalnız Rabbinedir.',
    },
    {
      number: 9,
      arabic: 'أَرَأَيْتَ الَّذِي يَنْهَىٰ',
      transliteration: "Era'eytellezî yenhâ.",
      translation: 'Gördün mü şu engelleyeni;',
    },
    {
      number: 10,
      arabic: 'عَبْدًا إِذَا صَلَّىٰ',
      transliteration: 'Abden izâ sallâ.',
      translation: 'namaz kılan bir kulu?',
    },
    {
      number: 11,
      arabic: 'أَرَأَيْتَ إِنْ كَانَ عَلَى الْهُدَىٰ',
      transliteration: "Era'eyte in kâne alel hüdâ.",
      translation: 'Gördün mü, ya o kul doğru yolda ise,',
    },
    {
      number: 12,
      arabic: 'أَوْ أَمَرَ بِالتَّقْوَىٰ',
      transliteration: 'Ev emera bit-takvâ.',
      translation: 'yahut takvayı emrediyorsa?',
    },
    {
      number: 13,
      arabic: 'أَرَأَيْتَ إِنْ كَذَّبَ وَتَوَلَّىٰ',
      transliteration: "Era'eyte in kezzebe ve tevellâ.",
      translation: 'Gördün mü, ya bu adam yalanlıyor ve yüz çeviriyorsa?',
    },
    {
      number: 14,
      arabic: 'أَلَمْ يَعْلَمْ بِأَنَّ اللَّهَ يَرَىٰ',
      transliteration: "Elem ya'lem bi-ennallâhe yerâ.",
      translation: "O, Allah'ın kendisini gördüğünü bilmiyor mu?",
    },
    {
      number: 15,
      arabic: 'كَلَّا لَئِنْ لَمْ يَنْتَهِ لَنَسْفَعًا بِالنَّاصِيَةِ',
      transliteration: "Kellâ lein lem yentehi lenesfe'an bin-nâsıyeh.",
      translation: 'Hayır! Eğer vazgeçmezse, andolsun onu perçeminden yakalarız;',
    },
    {
      number: 16,
      arabic: 'نَاصِيَةٍ كَاذِبَةٍ خَاطِئَةٍ',
      transliteration: 'Nâsıyetin kâzibetin hâtıeh.',
      translation: 'o yalancı, günahkâr perçeminden.',
    },
    {
      number: 17,
      arabic: 'فَلْيَدْعُ نَادِيَهُ',
      transliteration: "Felyed'u nâdiyeh.",
      translation: 'O zaman gitsin de meclisini (taraftarlarını) çağırsın.',
    },
    {
      number: 18,
      arabic: 'سَنَدْعُ الزَّبَانِيَةَ',
      transliteration: "Sened'uz-zebâniyeh.",
      translation: 'Biz de zebanileri çağıracağız.',
    },
    {
      number: 19,
      arabic: 'كَلَّا لَا تُطِعْهُ وَاسْجُدْ وَاقْتَرِبْ',
      transliteration: "Kellâ lâ tütı'hü vescüd vakterib.",
      translation: 'Hayır! Sakın ona uyma; secde et ve Rabbine yaklaş.',
    },
  ],
};

const KADIR: SurahText = {
  surah: 97,
  complete: true,
  ayahs: [
    {
      number: 1,
      arabic: 'إِنَّا أَنْزَلْنَاهُ فِي لَيْلَةِ الْقَدْرِ',
      transliteration: 'İnnâ enzelnâhü fî leyletil kadr.',
      translation: "Biz onu (Kur'an'ı) Kadir gecesinde indirdik.",
    },
    {
      number: 2,
      arabic: 'وَمَا أَدْرَاكَ مَا لَيْلَةُ الْقَدْرِ',
      transliteration: 'Ve mâ edrâke mâ leyletül kadr.',
      translation: 'Kadir gecesinin ne olduğunu sen nereden bileceksin?',
    },
    {
      number: 3,
      arabic: 'لَيْلَةُ الْقَدْرِ خَيْرٌ مِنْ أَلْفِ شَهْرٍ',
      transliteration: 'Leyletül kadri hayrun min elfi şehr.',
      translation: 'Kadir gecesi bin aydan daha hayırlıdır.',
    },
    {
      number: 4,
      arabic:
        'تَنَزَّلُ الْمَلَائِكَةُ وَالرُّوحُ فِيهَا بِإِذْنِ رَبِّهِمْ مِنْ كُلِّ أَمْرٍ',
      transliteration:
        'Tenezzelül melâiketü ver-rûhu fîhâ bi-izni rabbihim min külli emr.',
      translation:
        "O gecede melekler ve Ruh (Cebrail), Rablerinin izniyle her iş için iner de iner.",
    },
    {
      number: 5,
      arabic: 'سَلَامٌ هِيَ حَتَّىٰ مَطْلَعِ الْفَجْرِ',
      transliteration: "Selâmün hiye hattâ matla'il fecr.",
      translation: 'O gece, tan yeri ağarıncaya kadar esenliktir.',
    },
  ],
};

const BEYYINE: SurahText = {
  surah: 98,
  complete: true,
  ayahs: [
    {
      number: 1,
      arabic:
        'لَمْ يَكُنِ الَّذِينَ كَفَرُوا مِنْ أَهْلِ الْكِتَابِ وَالْمُشْرِكِينَ مُنْفَكِّينَ حَتَّىٰ تَأْتِيَهُمُ الْبَيِّنَةُ',
      transliteration:
        "Lem yekünillezîne keferû min ehlil kitâbi vel müşrikîne münfekkîne hattâ te'tiyehümül beyyineh.",
      translation:
        'Kitap ehlinden ve müşriklerden inkâr edenler, kendilerine apaçık delil gelinceye kadar ayrılacak değillerdi.',
    },
    {
      number: 2,
      arabic: 'رَسُولٌ مِنَ اللَّهِ يَتْلُو صُحُفًا مُطَهَّرَةً',
      transliteration: 'Rasûlün minallâhi yetlû suhufen mutahherah.',
      translation:
        '(O delil,) tertemiz sahifeleri okuyan, Allah tarafından gönderilmiş bir peygamberdir.',
    },
    {
      number: 3,
      arabic: 'فِيهَا كُتُبٌ قَيِّمَةٌ',
      transliteration: 'Fîhâ kütübün kayyimeh.',
      translation: 'O sahifelerde dosdoğru hükümler vardır.',
    },
    {
      number: 4,
      arabic:
        'وَمَا تَفَرَّقَ الَّذِينَ أُوتُوا الْكِتَابَ إِلَّا مِنْ بَعْدِ مَا جَاءَتْهُمُ الْبَيِّنَةُ',
      transliteration:
        "Ve mâ teferrakallezîne ûtül kitâbe illâ min ba'di mâ câethümül beyyineh.",
      translation:
        'Kitap verilenler, ancak kendilerine apaçık delil geldikten sonra ayrılığa düştüler.',
    },
    {
      number: 5,
      arabic:
        'وَمَا أُمِرُوا إِلَّا لِيَعْبُدُوا اللَّهَ مُخْلِصِينَ لَهُ الدِّينَ حُنَفَاءَ وَيُقِيمُوا الصَّلَاةَ وَيُؤْتُوا الزَّكَاةَ ۚ وَذَٰلِكَ دِينُ الْقَيِّمَةِ',
      transliteration:
        "Ve mâ ümirû illâ liya'büdüllâhe muhlisîne lehüd-dîne hunefâe ve yükîmüs-salâte ve yü'tüz-zekâh. Ve zâlike dînül kayyimeh.",
      translation:
        "Oysa onlar ancak dini yalnız O'na has kılarak, hakka yönelmiş kimseler olarak Allah'a kulluk etmek, namazı kılmak ve zekâtı vermekle emrolunmuşlardı. İşte dosdoğru din budur.",
    },
    {
      number: 6,
      arabic:
        'إِنَّ الَّذِينَ كَفَرُوا مِنْ أَهْلِ الْكِتَابِ وَالْمُشْرِكِينَ فِي نَارِ جَهَنَّمَ خَالِدِينَ فِيهَا ۚ أُولَٰئِكَ هُمْ شَرُّ الْبَرِيَّةِ',
      transliteration:
        'İnnellezîne keferû min ehlil kitâbi vel müşrikîne fî nâri cehenneme hâlidîne fîhâ. Ülâike hüm şerrül beriyyeh.',
      translation:
        'Kitap ehlinden ve müşriklerden inkâr edenler, içinde ebedî kalmak üzere cehennem ateşindedirler. İşte onlar yaratılmışların en kötüsüdür.',
    },
    {
      number: 7,
      arabic:
        'إِنَّ الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ أُولَٰئِكَ هُمْ خَيْرُ الْبَرِيَّةِ',
      transliteration:
        'İnnellezîne âmenû ve amilûs-sâlihâti ülâike hüm hayrul beriyyeh.',
      translation:
        'İman edip salih ameller işleyenler ise yaratılmışların en hayırlısıdır.',
    },
    {
      number: 8,
      arabic:
        'جَزَاؤُهُمْ عِنْدَ رَبِّهِمْ جَنَّاتُ عَدْنٍ تَجْرِي مِنْ تَحْتِهَا الْأَنْهَارُ خَالِدِينَ فِيهَا أَبَدًا ۖ رَضِيَ اللَّهُ عَنْهُمْ وَرَضُوا عَنْهُ ۚ ذَٰلِكَ لِمَنْ خَشِيَ رَبَّهُ',
      transliteration:
        'Cezâühüm inde rabbihim cennâtü adnin tecrî min tahtihel enhâru hâlidîne fîhâ ebedâ. Radıyallâhü anhüm ve radû anh. Zâlike limen haşiye rabbeh.',
      translation:
        "Onların Rableri katındaki mükâfatı, içinden ırmaklar akan ve içinde ebedî kalacakları Adn cennetleridir. Allah onlardan razı olmuştur, onlar da Allah'tan razı olmuşlardır. İşte bu mükâfat, Rabbinden korkanlara mahsustur.",
    },
  ],
};

const ZILZAL: SurahText = {
  surah: 99,
  complete: true,
  ayahs: [
    {
      number: 1,
      arabic: 'إِذَا زُلْزِلَتِ الْأَرْضُ زِلْزَالَهَا',
      transliteration: 'İzâ zülziletil ardu zilzâlehâ.',
      translation: 'Yer o şiddetli sarsıntısıyla sarsıldığında,',
    },
    {
      number: 2,
      arabic: 'وَأَخْرَجَتِ الْأَرْضُ أَثْقَالَهَا',
      transliteration: 'Ve ahracetil ardu eskâlehâ.',
      translation: 'yer içindeki ağırlıkları dışarı çıkardığında,',
    },
    {
      number: 3,
      arabic: 'وَقَالَ الْإِنْسَانُ مَا لَهَا',
      transliteration: 'Ve kâlel insânü mâ lehâ.',
      translation: "ve insan 'Buna ne oluyor?' dediğinde,",
    },
    {
      number: 4,
      arabic: 'يَوْمَئِذٍ تُحَدِّثُ أَخْبَارَهَا',
      transliteration: 'Yevmeizin tühaddisü ahbârahâ.',
      translation: 'işte o gün yer, haberlerini anlatır;',
    },
    {
      number: 5,
      arabic: 'بِأَنَّ رَبَّكَ أَوْحَىٰ لَهَا',
      transliteration: 'Bi-enne rabbeke evhâ lehâ.',
      translation: 'çünkü Rabbin ona vahyetmiştir.',
    },
    {
      number: 6,
      arabic: 'يَوْمَئِذٍ يَصْدُرُ النَّاسُ أَشْتَاتًا لِيُرَوْا أَعْمَالَهُمْ',
      transliteration: "Yevmeizin yasdürun-nâsü eştâten liyürav a'mâlehüm.",
      translation:
        'O gün insanlar, amellerinin kendilerine gösterilmesi için bölük bölük dönerler.',
    },
    {
      number: 7,
      arabic: 'فَمَنْ يَعْمَلْ مِثْقَالَ ذَرَّةٍ خَيْرًا يَرَهُ',
      transliteration: "Femen ya'mel miskâle zerratin hayran yerah.",
      translation: 'Artık kim zerre kadar iyilik yapmışsa onu görür.',
    },
    {
      number: 8,
      arabic: 'وَمَنْ يَعْمَلْ مِثْقَالَ ذَرَّةٍ شَرًّا يَرَهُ',
      transliteration: "Ve men ya'mel miskâle zerratin şerran yerah.",
      translation: 'Kim de zerre kadar kötülük yapmışsa onu görür.',
    },
  ],
};

const ADIYAT: SurahText = {
  surah: 100,
  complete: true,
  ayahs: [
    {
      number: 1,
      arabic: 'وَالْعَادِيَاتِ ضَبْحًا',
      transliteration: 'Vel âdiyâti dabhâ.',
      translation: 'Soluk soluğa koşan atlara yemin olsun,',
    },
    {
      number: 2,
      arabic: 'فَالْمُورِيَاتِ قَدْحًا',
      transliteration: 'Fel mûriyâti kadhâ.',
      translation: '(nallarıyla) kıvılcım saçanlara,',
    },
    {
      number: 3,
      arabic: 'فَالْمُغِيرَاتِ صُبْحًا',
      transliteration: 'Fel muğîrâti subhâ.',
      translation: 'sabah vakti baskın yapanlara,',
    },
    {
      number: 4,
      arabic: 'فَأَثَرْنَ بِهِ نَقْعًا',
      transliteration: "Fe eserne bihî nak'â.",
      translation: 'orada tozu dumana katanlara,',
    },
    {
      number: 5,
      arabic: 'فَوَسَطْنَ بِهِ جَمْعًا',
      transliteration: "Fe vesatne bihî cem'â.",
      translation: 'derken bir topluluğun ortasına dalanlara ki,',
    },
    {
      number: 6,
      arabic: 'إِنَّ الْإِنْسَانَ لِرَبِّهِ لَكَنُودٌ',
      transliteration: 'İnnel insâne li-rabbihî lekenûd.',
      translation: 'gerçekten insan, Rabbine karşı çok nankördür.',
    },
    {
      number: 7,
      arabic: 'وَإِنَّهُ عَلَىٰ ذَٰلِكَ لَشَهِيدٌ',
      transliteration: 'Ve innehû alâ zâlike leşehîd.',
      translation: 'Şüphesiz kendisi de buna şahittir.',
    },
    {
      number: 8,
      arabic: 'وَإِنَّهُ لِحُبِّ الْخَيْرِ لَشَدِيدٌ',
      transliteration: 'Ve innehû li-hubbil hayri leşedîd.',
      translation: 'O, mal sevgisine de aşırı derecede düşkündür.',
    },
    {
      number: 9,
      arabic: 'أَفَلَا يَعْلَمُ إِذَا بُعْثِرَ مَا فِي الْقُبُورِ',
      transliteration: "Efelâ ya'lemü izâ bu'sira mâ fil kubûr.",
      translation: 'Bilmez mi ki, kabirlerdekiler dışarı çıkarıldığında,',
    },
    {
      number: 10,
      arabic: 'وَحُصِّلَ مَا فِي الصُّدُورِ',
      transliteration: 'Ve hussıle mâ fis-sudûr.',
      translation: 'göğüslerde gizlenenler ortaya konduğunda,',
    },
    {
      number: 11,
      arabic: 'إِنَّ رَبَّهُمْ بِهِمْ يَوْمَئِذٍ لَخَبِيرٌ',
      transliteration: 'İnne rabbehüm bihim yevmeizin lehabîr.',
      translation: 'işte o gün Rableri onların her hâlinden haberdardır.',
    },
  ],
};

const KARIA: SurahText = {
  surah: 101,
  complete: true,
  ayahs: [
    {
      number: 1,
      arabic: 'الْقَارِعَةُ',
      transliteration: 'El kâriah.',
      translation: 'Kâria! (Kapıları çalacak o büyük felaket!)',
    },
    {
      number: 2,
      arabic: 'مَا الْقَارِعَةُ',
      transliteration: 'Mel kâriah.',
      translation: 'Nedir o Kâria?',
    },
    {
      number: 3,
      arabic: 'وَمَا أَدْرَاكَ مَا الْقَارِعَةُ',
      transliteration: 'Ve mâ edrâke mel kâriah.',
      translation: "Kâria'nın ne olduğunu sen nereden bileceksin?",
    },
    {
      number: 4,
      arabic: 'يَوْمَ يَكُونُ النَّاسُ كَالْفَرَاشِ الْمَبْثُوثِ',
      transliteration: 'Yevme yekûnün-nâsü kel ferâşil mebsûs.',
      translation: 'O gün insanlar, etrafa saçılmış kelebekler gibi olur.',
    },
    {
      number: 5,
      arabic: 'وَتَكُونُ الْجِبَالُ كَالْعِهْنِ الْمَنْفُوشِ',
      transliteration: 'Ve tekûnül cibâlü kel ıhnil menfûş.',
      translation: 'Dağlar da atılmış renkli yün gibi olur.',
    },
    {
      number: 6,
      arabic: 'فَأَمَّا مَنْ ثَقُلَتْ مَوَازِينُهُ',
      transliteration: 'Fe emmâ men sekulet mevâzînüh.',
      translation: 'Artık kimin tartıları ağır gelirse,',
    },
    {
      number: 7,
      arabic: 'فَهُوَ فِي عِيشَةٍ رَاضِيَةٍ',
      transliteration: 'Fe hüve fî îşetin râdıyeh.',
      translation: 'o, hoşnut olacağı bir hayat içindedir.',
    },
    {
      number: 8,
      arabic: 'وَأَمَّا مَنْ خَفَّتْ مَوَازِينُهُ',
      transliteration: 'Ve emmâ men haffet mevâzînüh.',
      translation: 'Kimin de tartıları hafif gelirse,',
    },
    {
      number: 9,
      arabic: 'فَأُمُّهُ هَاوِيَةٌ',
      transliteration: 'Fe ümmühû hâviyeh.',
      translation: "onun varacağı yer Hâviye'dir.",
    },
    {
      number: 10,
      arabic: 'وَمَا أَدْرَاكَ مَا هِيَهْ',
      transliteration: 'Ve mâ edrâke mâ hiyeh.',
      translation: 'Onun ne olduğunu sen nereden bileceksin?',
    },
    {
      number: 11,
      arabic: 'نَارٌ حَامِيَةٌ',
      transliteration: 'Nârun hâmiyeh.',
      translation: 'O, kızgın bir ateştir.',
    },
  ],
};

const TEKASUR: SurahText = {
  surah: 102,
  complete: true,
  ayahs: [
    {
      number: 1,
      arabic: 'أَلْهَاكُمُ التَّكَاثُرُ',
      transliteration: 'Elhâkümüt-tekâsür.',
      translation: 'Çoklukla övünmek sizi oyaladı,',
    },
    {
      number: 2,
      arabic: 'حَتَّىٰ زُرْتُمُ الْمَقَابِرَ',
      transliteration: 'Hattâ zürtümül mekâbir.',
      translation: 'ta kabirlere varıncaya kadar.',
    },
    {
      number: 3,
      arabic: 'كَلَّا سَوْفَ تَعْلَمُونَ',
      transliteration: "Kellâ sevfe ta'lemûn.",
      translation: 'Hayır! Yakında bileceksiniz.',
    },
    {
      number: 4,
      arabic: 'ثُمَّ كَلَّا سَوْفَ تَعْلَمُونَ',
      transliteration: "Sümme kellâ sevfe ta'lemûn.",
      translation: 'Yine hayır! Yakında bileceksiniz.',
    },
    {
      number: 5,
      arabic: 'كَلَّا لَوْ تَعْلَمُونَ عِلْمَ الْيَقِينِ',
      transliteration: "Kellâ lev ta'lemûne ilmel yakîn.",
      translation: 'Hayır! Eğer kesin bilgiyle bilseydiniz,',
    },
    {
      number: 6,
      arabic: 'لَتَرَوُنَّ الْجَحِيمَ',
      transliteration: 'Le teravünnel cahîm.',
      translation: 'andolsun cehennemi görürdünüz.',
    },
    {
      number: 7,
      arabic: 'ثُمَّ لَتَرَوُنَّهَا عَيْنَ الْيَقِينِ',
      transliteration: 'Sümme le teravünnehâ aynel yakîn.',
      translation: 'Sonra onu kesin bir gözle mutlaka göreceksiniz.',
    },
    {
      number: 8,
      arabic: 'ثُمَّ لَتُسْأَلُنَّ يَوْمَئِذٍ عَنِ النَّعِيمِ',
      transliteration: "Sümme le tüs'elünne yevmeizin anin-naîm.",
      translation: 'Sonra o gün nimetlerden mutlaka hesaba çekileceksiniz.',
    },
  ],
};

const ASR: SurahText = {
  surah: 103,
  complete: true,
  ayahs: [
    {
      number: 1,
      arabic: 'وَالْعَصْرِ',
      transliteration: "Vel'asr.",
      translation: 'Asra yemin olsun ki,',
    },
    {
      number: 2,
      arabic: 'إِنَّ الْإِنْسَانَ لَفِي خُسْرٍ',
      transliteration: 'İnnel insâne le fî husr.',
      translation: 'insan mutlaka ziyandadır.',
    },
    {
      number: 3,
      arabic:
        'إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ',
      transliteration:
        'İllellezîne âmenû ve amilûs-sâlihâti ve tevâsav bil-hakkı ve tevâsav bis-sabr.',
      translation:
        'Ancak iman edenler, salih amel işleyenler, birbirlerine hakkı ve sabrı tavsiye edenler bunun dışındadır.',
    },
  ],
};

const HUMEZE: SurahText = {
  surah: 104,
  complete: true,
  ayahs: [
    {
      number: 1,
      arabic: 'وَيْلٌ لِكُلِّ هُمَزَةٍ لُمَزَةٍ',
      transliteration: 'Veylün li-külli hümezetin lümezeh.',
      translation:
        'Arkadan çekiştiren, kaş göz işaretiyle alay eden her kişinin vay hâline!',
    },
    {
      number: 2,
      arabic: 'الَّذِي جَمَعَ مَالًا وَعَدَّدَهُ',
      transliteration: "Ellezî cemea mâlen ve addedeh.",
      translation: 'O ki mal toplar ve onu durmadan sayar.',
    },
    {
      number: 3,
      arabic: 'يَحْسَبُ أَنَّ مَالَهُ أَخْلَدَهُ',
      transliteration: 'Yahsebü enne mâlehû ahledeh.',
      translation: 'Malının kendisini ebedî yaşatacağını sanır.',
    },
    {
      number: 4,
      arabic: 'كَلَّا ۖ لَيُنْبَذَنَّ فِي الْحُطَمَةِ',
      transliteration: 'Kellâ le yünbezenne fil hutameh.',
      translation: "Hayır! Andolsun o, Hutame'ye atılacaktır.",
    },
    {
      number: 5,
      arabic: 'وَمَا أَدْرَاكَ مَا الْحُطَمَةُ',
      transliteration: 'Ve mâ edrâke mel hutameh.',
      translation: "Hutame'nin ne olduğunu sen nereden bileceksin?",
    },
    {
      number: 6,
      arabic: 'نَارُ اللَّهِ الْمُوقَدَةُ',
      transliteration: 'Nârullâhil mûkadeh.',
      translation: "O, Allah'ın tutuşturulmuş ateşidir.",
    },
    {
      number: 7,
      arabic: 'الَّتِي تَطَّلِعُ عَلَى الْأَفْئِدَةِ',
      transliteration: "Elletî tettaliu alel ef'ideh.",
      translation: 'Öyle bir ateş ki yüreklere kadar işler.',
    },
    {
      number: 8,
      arabic: 'إِنَّهَا عَلَيْهِمْ مُؤْصَدَةٌ',
      transliteration: "İnnehâ aleyhim mü'sadeh.",
      translation: 'Şüphesiz o ateş, üzerlerine kapatılacaktır;',
    },
    {
      number: 9,
      arabic: 'فِي عَمَدٍ مُمَدَّدَةٍ',
      transliteration: 'Fî amedin mümeddedeh.',
      translation: 'uzatılmış direkler arasında.',
    },
  ],
};

const FIL: SurahText = {
  surah: 105,
  complete: true,
  ayahs: [
    {
      number: 1,
      arabic: 'أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ بِأَصْحَابِ الْفِيلِ',
      transliteration: 'Elem tera keyfe feale rabbüke bi-ashâbil fîl.',
      translation: 'Görmedin mi Rabbin fil sahiplerine ne yaptı?',
    },
    {
      number: 2,
      arabic: 'أَلَمْ يَجْعَلْ كَيْدَهُمْ فِي تَضْلِيلٍ',
      transliteration: "Elem yec'al keydehüm fî tadlîl.",
      translation: 'Onların tuzaklarını boşa çıkarmadı mı?',
    },
    {
      number: 3,
      arabic: 'وَأَرْسَلَ عَلَيْهِمْ طَيْرًا أَبَابِيلَ',
      transliteration: 'Ve ersele aleyhim tayran ebâbîl.',
      translation: 'Üzerlerine sürü sürü kuşlar gönderdi.',
    },
    {
      number: 4,
      arabic: 'تَرْمِيهِمْ بِحِجَارَةٍ مِنْ سِجِّيلٍ',
      transliteration: 'Termîhim bi-hicâratin min siccîl.',
      translation: 'O kuşlar onlara pişkin çamurdan taşlar atıyordu.',
    },
    {
      number: 5,
      arabic: 'فَجَعَلَهُمْ كَعَصْفٍ مَأْكُولٍ',
      transliteration: "Fe cealehüm ke'asfin me'kûl.",
      translation: 'Derken Rabbin onları yenilmiş ekin yaprağı gibi yapıverdi.',
    },
  ],
};

const KUREYS: SurahText = {
  surah: 106,
  complete: true,
  ayahs: [
    {
      number: 1,
      arabic: 'لِإِيلَافِ قُرَيْشٍ',
      transliteration: 'Li îlâfi Kureyş.',
      translation: "Kureyş'in güven ve barış içinde olması için,",
    },
    {
      number: 2,
      arabic: 'إِيلَافِهِمْ رِحْلَةَ الشِّتَاءِ وَالصَّيْفِ',
      transliteration: 'Îlâfihim rihleteş-şitâi ves-sayf.',
      translation: 'kış ve yaz yolculuklarında güvenliklerini sağlamak için,',
    },
    {
      number: 3,
      arabic: 'فَلْيَعْبُدُوا رَبَّ هَٰذَا الْبَيْتِ',
      transliteration: "Felya'büdû rabbe hâzel beyt.",
      translation: "onlar bu evin (Kâbe'nin) Rabbine kulluk etsinler.",
    },
    {
      number: 4,
      arabic: 'الَّذِي أَطْعَمَهُمْ مِنْ جُوعٍ وَآمَنَهُمْ مِنْ خَوْفٍ',
      transliteration: "Ellezî et'amehüm min cûin ve âmenehüm min havf.",
      translation: 'O, kendilerini açlıktan doyurdu ve korkudan güvene kavuşturdu.',
    },
  ],
};

const MAUN: SurahText = {
  surah: 107,
  complete: true,
  ayahs: [
    {
      number: 1,
      arabic: 'أَرَأَيْتَ الَّذِي يُكَذِّبُ بِالدِّينِ',
      transliteration: "Era'eytellezî yükezzibü bid-dîn.",
      translation: 'Dini yalanlayanı gördün mü?',
    },
    {
      number: 2,
      arabic: 'فَذَٰلِكَ الَّذِي يَدُعُّ الْيَتِيمَ',
      transliteration: "Fe zâlikellezî yedu'ul yetîm.",
      translation: 'İşte o, yetimi itip kakar,',
    },
    {
      number: 3,
      arabic: 'وَلَا يَحُضُّ عَلَىٰ طَعَامِ الْمِسْكِينِ',
      transliteration: 'Velâ yehuddu alâ taâmil miskîn.',
      translation: 'yoksulu doyurmaya teşvik etmez.',
    },
    {
      number: 4,
      arabic: 'فَوَيْلٌ لِلْمُصَلِّينَ',
      transliteration: 'Fe veylün lil-musallîn.',
      translation: 'Vay o namaz kılanların hâline ki,',
    },
    {
      number: 5,
      arabic: 'الَّذِينَ هُمْ عَنْ صَلَاتِهِمْ سَاهُونَ',
      transliteration: 'Ellezîne hüm an salâtihim sâhûn.',
      translation: 'onlar namazlarından gafildirler.',
    },
    {
      number: 6,
      arabic: 'الَّذِينَ هُمْ يُرَاءُونَ',
      transliteration: 'Ellezîne hüm yürâûn.',
      translation: 'Onlar gösteriş yaparlar,',
    },
    {
      number: 7,
      arabic: 'وَيَمْنَعُونَ الْمَاعُونَ',
      transliteration: "Ve yemne'ûnel mâûn.",
      translation: 'en küçük yardımı bile esirgerler.',
    },
  ],
};

const KEVSER: SurahText = {
  surah: 108,
  complete: true,
  ayahs: [
    {
      number: 1,
      arabic: 'إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ',
      transliteration: "İnnâ a'taynâkel kevser.",
      translation: "Şüphesiz biz sana Kevser'i verdik.",
    },
    {
      number: 2,
      arabic: 'فَصَلِّ لِرَبِّكَ وَانْحَرْ',
      transliteration: 'Fe salli li rabbike venhar.',
      translation: 'Öyleyse Rabbin için namaz kıl ve kurban kes.',
    },
    {
      number: 3,
      arabic: 'إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ',
      transliteration: 'İnne şânieke hüvel ebter.',
      translation: 'Asıl soyu kesik olan, sana kin besleyendir.',
    },
  ],
};

const KAFIRUN: SurahText = {
  surah: 109,
  complete: true,
  ayahs: [
    {
      number: 1,
      arabic: 'قُلْ يَا أَيُّهَا الْكَافِرُونَ',
      transliteration: 'Kul yâ eyyühel kâfirûn.',
      translation: 'De ki: Ey kâfirler!',
    },
    {
      number: 2,
      arabic: 'لَا أَعْبُدُ مَا تَعْبُدُونَ',
      transliteration: "Lâ a'büdü mâ ta'büdûn.",
      translation: 'Ben sizin taptıklarınıza tapmam.',
    },
    {
      number: 3,
      arabic: 'وَلَا أَنْتُمْ عَابِدُونَ مَا أَعْبُدُ',
      transliteration: "Velâ entüm âbidûne mâ a'büd.",
      translation: 'Siz de benim ibadet ettiğime ibadet edecek değilsiniz.',
    },
    {
      number: 4,
      arabic: 'وَلَا أَنَا عَابِدٌ مَا عَبَدْتُمْ',
      transliteration: 'Velâ ene âbidün mâ abedtüm.',
      translation: 'Ben sizin taptıklarınıza tapacak değilim.',
    },
    {
      number: 5,
      arabic: 'وَلَا أَنْتُمْ عَابِدُونَ مَا أَعْبُدُ',
      transliteration: "Velâ entüm âbidûne mâ a'büd.",
      translation: 'Siz de benim ibadet ettiğime ibadet edecek değilsiniz.',
    },
    {
      number: 6,
      arabic: 'لَكُمْ دِينُكُمْ وَلِيَ دِينِ',
      transliteration: 'Leküm dînüküm ve liye dîn.',
      translation: 'Sizin dininiz size, benim dinim banadır.',
    },
  ],
};

const NASR: SurahText = {
  surah: 110,
  complete: true,
  ayahs: [
    {
      number: 1,
      arabic: 'إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ',
      transliteration: 'İzâ câe nasrullâhi vel feth.',
      translation: "Allah'ın yardımı ve fetih geldiğinde,",
    },
    {
      number: 2,
      arabic: 'وَرَأَيْتَ النَّاسَ يَدْخُلُونَ فِي دِينِ اللَّهِ أَفْوَاجًا',
      transliteration: "Ve raeyten-nâse yedhulûne fî dînillâhi efvâcâ.",
      translation: "insanların bölük bölük Allah'ın dinine girdiklerini gördüğünde,",
    },
    {
      number: 3,
      arabic: 'فَسَبِّحْ بِحَمْدِ رَبِّكَ وَاسْتَغْفِرْهُ ۚ إِنَّهُ كَانَ تَوَّابًا',
      transliteration: 'Fe sebbih bi-hamdi rabbike vestağfirh. İnnehû kâne tevvâbâ.',
      translation:
        "Rabbini hamd ile tesbih et ve O'ndan bağışlanma dile. Çünkü O, tövbeleri çok kabul edendir.",
    },
  ],
};

const TEBBET: SurahText = {
  surah: 111,
  complete: true,
  ayahs: [
    {
      number: 1,
      arabic: 'تَبَّتْ يَدَا أَبِي لَهَبٍ وَتَبَّ',
      transliteration: 'Tebbet yedâ ebî lehebin ve tebb.',
      translation: "Ebû Leheb'in iki eli kurusun; kurudu da!",
    },
    {
      number: 2,
      arabic: 'مَا أَغْنَىٰ عَنْهُ مَالُهُ وَمَا كَسَبَ',
      transliteration: 'Mâ ağnâ anhü mâlühû ve mâ keseb.',
      translation: 'Malı ve kazandıkları ona fayda vermedi.',
    },
    {
      number: 3,
      arabic: 'سَيَصْلَىٰ نَارًا ذَاتَ لَهَبٍ',
      transliteration: 'Se yaslâ nâran zâte leheb.',
      translation: 'O, alevli bir ateşe girecektir.',
    },
    {
      number: 4,
      arabic: 'وَامْرَأَتُهُ حَمَّالَةَ الْحَطَبِ',
      transliteration: 'Vemraetühû hammâletel hatab.',
      translation: 'Karısı da odun taşıyıcısı olarak,',
    },
    {
      number: 5,
      arabic: 'فِي جِيدِهَا حَبْلٌ مِنْ مَسَدٍ',
      transliteration: 'Fî cîdihâ hablün min mesed.',
      translation: 'boynunda bükülmüş bir ip olduğu hâlde o ateşe girecektir.',
    },
  ],
};

const IHLAS: SurahText = {
  surah: 112,
  complete: true,
  ayahs: [
    {
      number: 1,
      arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ',
      transliteration: 'Kul hüvellâhü ehad.',
      translation: 'De ki: O Allah birdir.',
      tajweed: [{ text: 'قُلْ هُوَ اللَّهُ ' }, { text: 'أَحَدٌ', rule: 'kalkale' }],
    },
    {
      number: 2,
      arabic: 'اللَّهُ الصَّمَدُ',
      transliteration: 'Allâhüs-samed.',
      translation:
        "Allah Samed'dir (her şey O'na muhtaçtır, O hiçbir şeye muhtaç değildir).",
      tajweed: [{ text: 'اللَّهُ ' }, { text: 'الصَّمَدُ', rule: 'kalkale' }],
    },
    {
      number: 3,
      arabic: 'لَمْ يَلِدْ وَلَمْ يُولَدْ',
      transliteration: 'Lem yelid ve lem yûled.',
      translation: 'O doğurmamıştır ve doğurulmamıştır.',
      tajweed: [
        { text: 'لَمْ ' },
        { text: 'يَلِدْ', rule: 'kalkale' },
        { text: ' وَلَمْ ' },
        { text: 'يُولَدْ', rule: 'kalkale' },
      ],
    },
    {
      number: 4,
      arabic: 'وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ',
      transliteration: 'Ve lem yekün lehû küfüven ehad.',
      translation: "Hiçbir şey O'na denk değildir.",
      tajweed: [
        { text: 'وَلَمْ ' },
        { text: 'يَكُنْ لَهُ', rule: 'idgam' },
        { text: ' ' },
        { text: 'كُفُوًا أَحَدٌ', rule: 'izhar' },
      ],
    },
  ],
};

const FELAK: SurahText = {
  surah: 113,
  complete: true,
  ayahs: [
    {
      number: 1,
      arabic: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ',
      transliteration: 'Kul eûzü bi rabbil felak.',
      translation: 'De ki: Sabahın Rabbine sığınırım;',
    },
    {
      number: 2,
      arabic: 'مِنْ شَرِّ مَا خَلَقَ',
      transliteration: 'Min şerri mâ halak.',
      translation: 'yarattığı şeylerin şerrinden,',
    },
    {
      number: 3,
      arabic: 'وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ',
      transliteration: 'Ve min şerri gâsikın izâ vekab.',
      translation: 'karanlığı çöktüğü zaman gecenin şerrinden,',
    },
    {
      number: 4,
      arabic: 'وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ',
      transliteration: 'Ve min şerrin-neffâsâti fil ukad.',
      translation: 'düğümlere üfleyenlerin şerrinden,',
    },
    {
      number: 5,
      arabic: 'وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ',
      transliteration: 'Ve min şerri hâsidin izâ hased.',
      translation: 'haset ettiği zaman hasetçinin şerrinden.',
    },
  ],
};

const NAS: SurahText = {
  surah: 114,
  complete: true,
  ayahs: [
    {
      number: 1,
      arabic: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ',
      transliteration: 'Kul eûzü bi rabbin-nâs.',
      translation: 'De ki: İnsanların Rabbine sığınırım;',
    },
    {
      number: 2,
      arabic: 'مَلِكِ النَّاسِ',
      transliteration: 'Melikin-nâs.',
      translation: 'insanların hükümdarına,',
    },
    {
      number: 3,
      arabic: 'إِلَٰهِ النَّاسِ',
      transliteration: 'İlâhin-nâs.',
      translation: 'insanların ilâhına;',
    },
    {
      number: 4,
      arabic: 'مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ',
      transliteration: 'Min şerril vesvâsil hannâs.',
      translation: 'o sinsi vesvesecinin şerrinden;',
    },
    {
      number: 5,
      arabic: 'الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ',
      transliteration: 'Ellezî yüvesvisü fî sudûrin-nâs.',
      translation: 'o ki insanların göğüslerine vesvese verir;',
    },
    {
      number: 6,
      arabic: 'مِنَ الْجِنَّةِ وَالنَّاسِ',
      transliteration: 'Minel cinneti ven-nâs.',
      translation: 'gerek cinlerden gerek insanlardan.',
    },
  ],
};

const SURAH_TEXTS: SurahText[] = [
  FATIHA,
  BAKARA_SELECTION,
  DUHA,
  INSIRAH,
  TIN,
  ALAK,
  KADIR,
  BEYYINE,
  ZILZAL,
  ADIYAT,
  KARIA,
  TEKASUR,
  ASR,
  HUMEZE,
  FIL,
  KUREYS,
  MAUN,
  KEVSER,
  KAFIRUN,
  NASR,
  TEBBET,
  IHLAS,
  FELAK,
  NAS,
];

const BY_SURAH = new Map<number, SurahText>(SURAH_TEXTS.map((s) => [s.surah, s]));

/**
 * Tam Kur'an metni: Tanzil (Hafs, harekeli) + Elmalılı Hamdi Yazır meali.
 * Biçim: { "<sure>": [["arapça","meal"], ...] } — tools/build-quran.mjs üretir.
 * Zengin kayıtlar (transkripsiyon + tecvit) yukarıdaki seçme paketten gelir;
 * geri kalan sureler bu veriden üretilir (transkripsiyon boş bırakılır).
 */
const QURAN_FULL = require('./quran-full.json') as Record<string, [string, string][]>;

const FULL_CACHE = new Map<number, SurahText>();

function buildFromFull(surah: number): SurahText | undefined {
  const rows = QURAN_FULL[String(surah)];
  if (!rows) return undefined;
  const cached = FULL_CACHE.get(surah);
  if (cached) return cached;
  const built: SurahText = {
    surah,
    complete: true,
    ayahs: rows.map(([arabic, translation], i) => ({
      number: i + 1,
      arabic,
      transliteration: '',
      translation,
    })),
  };
  FULL_CACHE.set(surah, built);
  return built;
}

/** Metni bulunan sure numaraları — tam veri setiyle bütün mushaf. */
export const AVAILABLE_SURAH_NUMBERS: number[] = Array.from({ length: 114 }, (_, i) => i + 1);

/** Tamamı bulunan sureler (ezber dahil) — tam veri setiyle bütün mushaf. */
export const COMPLETE_SURAH_NUMBERS: number[] = AVAILABLE_SURAH_NUMBERS;

export function getSurahText(surah: number): SurahText | undefined {
  const rich = BY_SURAH.get(surah);
  // Zengin kayıt tam ise onu kullan (transkripsiyon + tecvit içerir);
  // kısmi ise (ör. Bakara seçkisi) tam metni tercih et.
  if (rich?.complete) return rich;
  return buildFromFull(surah) ?? rich;
}

export function isSurahAvailable(surah: number): boolean {
  return surah >= 1 && surah <= 114;
}

export function getAyahText(surah: number, ayah: number): Ayah | undefined {
  return getSurahText(surah)?.ayahs.find((a) => a.number === ayah);
}

/** Seçme paketteki kısmi kayıtlar (ör. Bakara 255/285-286) — not gösterimi için. */
export function getCuratedSurahText(surah: number): SurahText | undefined {
  return BY_SURAH.get(surah);
}
