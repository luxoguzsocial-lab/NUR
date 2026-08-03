/**
 * Dua ve zikir içeriği — tamamı sahih kaynaklardan derlenmiştir.
 * Kaynak biçimi: Kur'an duaları için "Sûre x:y", hadis duaları için "Kitap, Bölüm no".
 */

export type DuaCategoryId =
  | 'sabah'
  | 'aksam'
  | 'namazSonrasi'
  | 'yemek'
  | 'yolculuk'
  | 'uyku'
  | 'hastalik'
  | 'kurandan';

export interface Dua {
  id: string;
  category: DuaCategoryId;
  titleTr: string;
  arabic: string;
  transliteration: string;
  meaningTr: string;
  source: string;
  verified: boolean;
}

export const DUA_CATEGORY_IDS: readonly DuaCategoryId[] = [
  'sabah',
  'aksam',
  'namazSonrasi',
  'yemek',
  'yolculuk',
  'uyku',
  'hastalik',
  'kurandan',
] as const;

export const DUAS: Dua[] = [
  // ——— SABAH ———
  {
    id: 'sabah-mulk',
    category: 'sabah',
    titleTr: 'Sabaha erişince',
    arabic:
      'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلّٰهِ، وَالْحَمْدُ لِلّٰهِ، لَا إِلٰهَ إِلَّا اللّٰهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلٰى كُلِّ شَيْءٍ قَدِيرٌ',
    transliteration:
      "Asbahnâ ve asbahal-mülkü lillâh, vel-hamdü lillâh. Lâ ilâhe illallâhü vahdehû lâ şerîke leh, lehül-mülkü ve lehül-hamdü ve hüve alâ külli şey'in kadîr.",
    meaningTr:
      "Sabaha erdik; mülk de Allah'ındır. Hamd Allah'a mahsustur. Allah'tan başka ilâh yoktur; O birdir, ortağı yoktur. Mülk O'nundur, hamd O'na aittir ve O her şeye gücü yetendir.",
    source: 'Müslim, Zikir 75',
    verified: true,
  },
  {
    id: 'sabah-seyyidul-istigfar',
    category: 'sabah',
    titleTr: "Seyyidü'l-istiğfâr",
    arabic:
      'اَللّٰهُمَّ أَنْتَ رَبِّي لَا إِلٰهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلٰى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ وَأَبُوءُ بِذَنْبِي، فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
    transliteration:
      "Allâhümme ente rabbî, lâ ilâhe illâ ent. Halaktenî ve ene abdük. Ve ene alâ ahdike ve va'dike mesteta't. Eûzü bike min şerri mâ sana't. Ebûü leke bi-ni'metike aleyye ve ebûü bi-zenbî. Fağfir lî, fe-innehû lâ yağfiruz-zünûbe illâ ent.",
    meaningTr:
      "Allah'ım! Sen benim Rabbimsin, senden başka ilâh yoktur. Beni sen yarattın, ben senin kulunum. Gücüm yettiğince sana verdiğim söz ve vaad üzereyim. Yaptıklarımın şerrinden sana sığınırım. Üzerimdeki nimetini itiraf eder, günahımı da itiraf ederim. Beni bağışla; çünkü günahları senden başkası bağışlayamaz.",
    source: 'Buhârî, Deavât 2',
    verified: true,
  },
  {
    id: 'sabah-bismillahillezi',
    category: 'sabah',
    titleTr: 'Zarardan koruyan dua (sabah-akşam üç kere)',
    arabic:
      'بِسْمِ اللّٰهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
    transliteration:
      "Bismillâhillezî lâ yedurru measmihî şey'ün fil-ardı ve lâ fis-semâi ve hüves-semîul-alîm.",
    meaningTr:
      "İsmi anıldığında yerde ve gökte hiçbir şeyin zarar veremeyeceği Allah'ın adıyla. O her şeyi işiten, her şeyi bilendir. (Sabah ve akşam üç kere okunması tavsiye edilmiştir.)",
    source: 'Ebû Dâvûd, Edeb 101; Tirmizî, Deavât 13',
    verified: true,
  },
  {
    id: 'sabah-bike-asbahna',
    category: 'sabah',
    titleTr: 'Güne Allah ile başlama',
    arabic:
      'اَللّٰهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ',
    transliteration:
      'Allâhümme bike asbahnâ ve bike emseynâ ve bike nahyâ ve bike nemûtü ve ileyken-nüşûr.',
    meaningTr:
      "Allah'ım! Senin yardımınla sabaha erdik, senin yardımınla akşama ulaşırız. Senin sayende yaşar, senin takdirinle ölürüz. Dönüş yalnız sanadır.",
    source: 'Tirmizî, Deavât 13',
    verified: true,
  },

  // ——— AKŞAM ———
  {
    id: 'aksam-mulk',
    category: 'aksam',
    titleTr: 'Akşama erişince',
    arabic:
      'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلّٰهِ، وَالْحَمْدُ لِلّٰهِ، لَا إِلٰهَ إِلَّا اللّٰهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلٰى كُلِّ شَيْءٍ قَدِيرٌ',
    transliteration:
      "Emseynâ ve emsal-mülkü lillâh, vel-hamdü lillâh. Lâ ilâhe illallâhü vahdehû lâ şerîke leh, lehül-mülkü ve lehül-hamdü ve hüve alâ külli şey'in kadîr.",
    meaningTr:
      "Akşama erdik; mülk de Allah'ındır. Hamd Allah'a mahsustur. Allah'tan başka ilâh yoktur; O birdir, ortağı yoktur. Mülk O'nundur, hamd O'na aittir ve O her şeye gücü yetendir.",
    source: 'Müslim, Zikir 75',
    verified: true,
  },
  {
    id: 'aksam-bike-emseyna',
    category: 'aksam',
    titleTr: 'Akşamı Allah ile karşılama',
    arabic:
      'اَللّٰهُمَّ بِكَ أَمْسَيْنَا وَبِكَ أَصْبَحْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ',
    transliteration:
      'Allâhümme bike emseynâ ve bike asbahnâ ve bike nahyâ ve bike nemûtü ve ileykel-masîr.',
    meaningTr:
      "Allah'ım! Senin yardımınla akşama erdik, senin yardımınla sabaha ulaşırız. Senin sayende yaşar, senin takdirinle ölürüz. Varış yalnız sanadır.",
    source: 'Tirmizî, Deavât 13',
    verified: true,
  },
  {
    id: 'aksam-kelimat',
    category: 'aksam',
    titleTr: "Allah'ın tam kelimelerine sığınma",
    arabic: 'أَعُوذُ بِكَلِمَاتِ اللّٰهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
    transliteration: 'Eûzü bi-kelimâtillâhit-tâmmâti min şerri mâ halak.',
    meaningTr:
      "Yarattıklarının şerrinden Allah'ın eksiksiz kelimelerine sığınırım. (Akşam vakti bunu söyleyene o gece hiçbir şey zarar vermez buyrulmuştur.)",
    source: 'Müslim, Zikir 55',
    verified: true,
  },
  {
    id: 'aksam-afiyet',
    category: 'aksam',
    titleTr: 'Af ve âfiyet duası',
    arabic: 'اَللّٰهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ',
    transliteration: "Allâhümme innî es'elükel-afve vel-âfiyete fid-dünyâ vel-âhıra.",
    meaningTr:
      "Allah'ım! Senden dünyada ve ahirette af ve âfiyet (esenlik) dilerim. (Peygamberimiz s.a.v. bu duayı sabah ve akşam hiç terk etmezdi.)",
    source: 'Ebû Dâvûd, Edeb 101; İbn Mâce, Duâ 14',
    verified: true,
  },

  // ——— NAMAZ SONRASI (TESBİHAT) ———
  {
    id: 'namaz-selam',
    category: 'namazSonrasi',
    titleTr: 'Selâmdan hemen sonra',
    arabic:
      'أَسْتَغْفِرُ اللّٰهَ (٣) اَللّٰهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ، تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ',
    transliteration:
      'Estağfirullâh (üç kere). Allâhümme entes-selâmü ve minkes-selâm, tebârakte yâ zel-celâli vel-ikrâm.',
    meaningTr:
      "Allah'tan bağışlanma dilerim (üç kere). Allah'ım! Sen Selâm'sın (her kusurdan uzaksın), esenlik sendendir. Ey celâl ve ikram sahibi, sen ne yücesin!",
    source: 'Müslim, Mesâcid 135',
    verified: true,
  },
  {
    id: 'namaz-tesbihat',
    category: 'namazSonrasi',
    titleTr: "Tesbihat (33'lük zikirler)",
    arabic:
      'سُبْحَانَ اللّٰهِ (٣٣) اَلْحَمْدُ لِلّٰهِ (٣٣) اَللّٰهُ أَكْبَرُ (٣٣) لَا إِلٰهَ إِلَّا اللّٰهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلٰى كُلِّ شَيْءٍ قَدِيرٌ',
    transliteration:
      "Sübhânallâh (33), elhamdü lillâh (33), Allâhü ekber (33). Lâ ilâhe illallâhü vahdehû lâ şerîke leh, lehül-mülkü ve lehül-hamdü ve hüve alâ külli şey'in kadîr.",
    meaningTr:
      "Her namazın ardından 33 kere 'Sübhânallah' (Allah'ı bütün eksikliklerden tenzih ederim), 33 kere 'Elhamdülillah' (hamd Allah'a mahsustur), 33 kere 'Allâhü ekber' (Allah en büyüktür) deyip yüzüncüde 'Allah'tan başka ilâh yoktur; O birdir, ortağı yoktur. Mülk O'nundur, hamd O'nadır ve O her şeye gücü yetendir' diyenin hataları deniz köpüğü kadar da olsa bağışlanır.",
    source: 'Müslim, Mesâcid 146',
    verified: true,
  },
  {
    id: 'namaz-ayetel-kursi',
    category: 'namazSonrasi',
    titleTr: "Âyetü'l-Kürsî",
    arabic:
      'اَللّٰهُ لَا إِلٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ، لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ، لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ، مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ، يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ، وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ، وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ، وَلَا يَؤُودُهُ حِفْظُهُمَا، وَهُوَ الْعَلِيُّ الْعَظِيمُ',
    transliteration:
      "Allâhü lâ ilâhe illâ hüvel-hayyül-kayyûm. Lâ te'huzühû sinetün ve lâ nevm. Lehû mâ fis-semâvâti ve mâ fil-ard. Men zellezî yeşfeu ındehû illâ bi-iznih. Ya'lemü mâ beyne eydîhim ve mâ halfehüm. Ve lâ yühîtûne bi-şey'in min ılmihî illâ bimâ şâ'. Vesia kürsiyyühüs-semâvâti vel-ard. Ve lâ yeûdühû hıfzuhümâ. Ve hüvel-aliyyül-azîm.",
    meaningTr:
      "Allah, kendisinden başka ilâh olmayandır; diridir, her şeyi ayakta tutandır. O'nu ne uyuklama tutar ne de uyku. Göklerde ve yerde ne varsa O'nundur. İzni olmadan O'nun katında kim şefaat edebilir? O, kulların önlerindekini ve arkalarındakini bilir. Onlar O'nun ilminden, dilediği kadarından başkasını kavrayamazlar. O'nun kürsüsü gökleri ve yeri kaplamıştır; onları korumak O'na ağır gelmez. O yücedir, büyüktür. (Her farz namazın ardından okuyanla cennet arasında yalnız ölüm vardır buyrulmuştur.)",
    source: "Bakara 2:255; Nesâî, Amelü'l-yevm ve'l-leyle 100",
    verified: true,
  },
  {
    id: 'namaz-la-mania',
    category: 'namazSonrasi',
    titleTr: 'Namaz sonrası tehlil',
    arabic:
      'لَا إِلٰهَ إِلَّا اللّٰهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلٰى كُلِّ شَيْءٍ قَدِيرٌ. اَللّٰهُمَّ لَا مَانِعَ لِمَا أَعْطَيْتَ، وَلَا مُعْطِيَ لِمَا مَنَعْتَ، وَلَا يَنْفَعُ ذَا الْجَدِّ مِنْكَ الْجَدُّ',
    transliteration:
      "Lâ ilâhe illallâhü vahdehû lâ şerîke leh, lehül-mülkü ve lehül-hamdü ve hüve alâ külli şey'in kadîr. Allâhümme lâ mânia limâ a'tayte ve lâ mu'tıye limâ mena't, ve lâ yenfeu zel-ceddi minkel-cedd.",
    meaningTr:
      "Allah'tan başka ilâh yoktur; O birdir, ortağı yoktur. Mülk O'nundur, hamd O'nadır ve O her şeye gücü yetendir. Allah'ım! Senin verdiğine engel olacak yoktur; senin engellediğini de verecek yoktur. Servet sahibine, senin katında serveti fayda vermez.",
    source: 'Buhârî, Ezân 155; Müslim, Salât 205',
    verified: true,
  },
  {
    id: 'namaz-zikir-sukur',
    category: 'namazSonrasi',
    titleTr: 'Zikir, şükür ve güzel ibadet duası',
    arabic: 'اَللّٰهُمَّ أَعِنِّي عَلٰى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ',
    transliteration: 'Allâhümme einnî alâ zikrike ve şükrike ve hüsni ıbâdetik.',
    meaningTr:
      "Allah'ım! Seni anmak, sana şükretmek ve sana güzelce ibadet etmek için bana yardım et. (Peygamberimiz s.a.v. bu duayı her namazın ardından söylemeyi Muâz b. Cebel'e tavsiye etmiştir.)",
    source: 'Ebû Dâvûd, Vitir 26; Nesâî, Sehv 60',
    verified: true,
  },

  // ——— YEMEK ———
  {
    id: 'yemek-baslarken',
    category: 'yemek',
    titleTr: 'Yemeğe başlarken',
    arabic: 'بِسْمِ اللّٰهِ — (unutulursa:) بِسْمِ اللّٰهِ فِي أَوَّلِهِ وَآخِرِهِ',
    transliteration: 'Bismillâh. (Başında unutan:) Bismillâhi fî evvelihî ve âhırih.',
    meaningTr:
      "Allah'ın adıyla. (Başında besmeleyi unutan kimse hatırlayınca 'Başında da sonunda da Allah'ın adıyla' der.)",
    source: "Ebû Dâvûd, Et'ime 15; Tirmizî, Et'ime 47",
    verified: true,
  },
  {
    id: 'yemek-sonrasi',
    category: 'yemek',
    titleTr: 'Yemekten sonra',
    arabic: 'اَلْحَمْدُ لِلّٰهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ',
    transliteration: "Elhamdü lillâhillezî et'amenâ ve sekânâ ve cealenâ müslimîn.",
    meaningTr: 'Bizi yediren, içiren ve müslümanlardan kılan Allah’a hamdolsun.',
    source: "Ebû Dâvûd, Et'ime 52; Tirmizî, Deavât 56",
    verified: true,
  },
  {
    id: 'yemek-sofra',
    category: 'yemek',
    titleTr: 'Sofra kaldırılırken',
    arabic:
      'اَلْحَمْدُ لِلّٰهِ حَمْدًا كَثِيرًا طَيِّبًا مُبَارَكًا فِيهِ، غَيْرَ مَكْفِيٍّ وَلَا مُوَدَّعٍ وَلَا مُسْتَغْنًى عَنْهُ رَبَّنَا',
    transliteration:
      'Elhamdü lillâhi hamden kesîran tayyiben mübâraken fîh, ğayra mekfiyyin ve lâ müveddein ve lâ müstağnen anhü rabbenâ.',
    meaningTr:
      "Rabbimiz! Sana çok, güzel ve bereketli bir hamd ile hamdolsun. Nimetin hiç kesilmez; sen terk edilmezsin ve senden asla müstağni kalınamaz (sana her an muhtacız).",
    source: "Buhârî, Et'ime 54",
    verified: true,
  },
  {
    id: 'yemek-ikram',
    category: 'yemek',
    titleTr: 'Yemek ikram edene dua',
    arabic: 'اَللّٰهُمَّ أَطْعِمْ مَنْ أَطْعَمَنِي وَاسْقِ مَنْ سَقَانِي',
    transliteration: "Allâhümme et'ım men et'amenî, veskı men sekânî.",
    meaningTr: "Allah'ım! Beni yedirene sen de yedir, beni içirene sen de içir.",
    source: 'Müslim, Eşribe 174',
    verified: true,
  },

  // ——— YOLCULUK ———
  {
    id: 'yolculuk-binek',
    category: 'yolculuk',
    titleTr: 'Vasıtaya binerken',
    arabic:
      'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هٰذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلٰى رَبِّنَا لَمُنْقَلِبُونَ',
    transliteration:
      'Sübhânellezî sehhara lenâ hâzâ ve mâ künnâ lehû mukrinîn. Ve innâ ilâ rabbinâ le-münkalibûn.',
    meaningTr:
      "Bunu hizmetimize veren Allah her türlü eksiklikten uzaktır; O vermeseydi biz buna güç yetiremezdik. Şüphesiz biz Rabbimize döneceğiz.",
    source: 'Zuhruf 43:13-14; Müslim, Hac 425',
    verified: true,
  },
  {
    id: 'yolculuk-sefer',
    category: 'yolculuk',
    titleTr: 'Sefer duası',
    arabic:
      'اَللّٰهُمَّ إِنَّا نَسْأَلُكَ فِي سَفَرِنَا هٰذَا الْبِرَّ وَالتَّقْوٰى، وَمِنَ الْعَمَلِ مَا تَرْضٰى، اَللّٰهُمَّ هَوِّنْ عَلَيْنَا سَفَرَنَا هٰذَا وَاطْوِ عَنَّا بُعْدَهُ',
    transliteration:
      "Allâhümme innâ nes'elüke fî seferinâ hâzel-birra vet-takvâ ve minel-ameli mâ terdâ. Allâhümme hevvin aleynâ seferanâ hâzâ vatvi annâ bu'deh.",
    meaningTr:
      "Allah'ım! Bu yolculuğumuzda senden iyilik, takva ve razı olacağın ameller isteriz. Allah'ım! Bu yolculuğu bize kolaylaştır, uzağını yakın et.",
    source: 'Müslim, Hac 425',
    verified: true,
  },
  {
    id: 'yolculuk-konaklama',
    category: 'yolculuk',
    titleTr: 'Bir yerde konaklarken',
    arabic: 'أَعُوذُ بِكَلِمَاتِ اللّٰهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
    transliteration: 'Eûzü bi-kelimâtillâhit-tâmmâti min şerri mâ halak.',
    meaningTr:
      "Yarattıklarının şerrinden Allah'ın eksiksiz kelimelerine sığınırım. (Bir yerde konaklayıp bunu söyleyene, oradan ayrılıncaya kadar hiçbir şey zarar vermez buyrulmuştur.)",
    source: 'Müslim, Zikir 54',
    verified: true,
  },
  {
    id: 'yolculuk-donus',
    category: 'yolculuk',
    titleTr: 'Yolculuktan dönerken',
    arabic: 'آيِبُونَ تَائِبُونَ عَابِدُونَ لِرَبِّنَا حَامِدُونَ',
    transliteration: 'Âyibûne, tâibûne, âbidûne, li-rabbinâ hâmidûn.',
    meaningTr:
      'Biz yolculuktan dönenler, tövbe edenler, kulluk edenler ve Rabbimize hamd edenleriz.',
    source: 'Buhârî, Umre 12; Müslim, Hac 428',
    verified: true,
  },

  // ——— UYKU ———
  {
    id: 'uyku-yatarken',
    category: 'uyku',
    titleTr: 'Yatağa girerken',
    arabic: 'بِاسْمِكَ اللّٰهُمَّ أَمُوتُ وَأَحْيَا',
    transliteration: 'Bismikellâhümme emûtü ve ahyâ.',
    meaningTr: "Allah'ım! Senin adınla ölür (uyur), senin adınla dirilirim (uyanırım).",
    source: 'Buhârî, Deavât 7-8',
    verified: true,
  },
  {
    id: 'uyku-uyaninca',
    category: 'uyku',
    titleTr: 'Uykudan uyanınca',
    arabic: 'اَلْحَمْدُ لِلّٰهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
    transliteration: "Elhamdü lillâhillezî ahyânâ ba'de mâ emâtenâ ve ileyhin-nüşûr.",
    meaningTr:
      "Bizi öldürdükten (uyuttuktan) sonra dirilten (uyandıran) Allah'a hamdolsun. Dönüş yalnız O'nadır.",
    source: 'Buhârî, Deavât 7-8',
    verified: true,
  },
  {
    id: 'uyku-muavvizat',
    category: 'uyku',
    titleTr: 'Yatmadan önce üç sure (İhlâs, Felak, Nâs)',
    arabic:
      'قُلْ هُوَ اللّٰهُ أَحَدٌ. اَللّٰهُ الصَّمَدُ. لَمْ يَلِدْ وَلَمْ يُولَدْ. وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ ۝ قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ. مِنْ شَرِّ مَا خَلَقَ. وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ. وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ. وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ ۝ قُلْ أَعُوذُ بِرَبِّ النَّاسِ. مَلِكِ النَّاسِ. إِلٰهِ النَّاسِ. مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ. الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ. مِنَ الْجِنَّةِ وَالنَّاسِ',
    transliteration:
      "Kul hüvallâhü ehad. Allâhüs-samed. Lem yelid ve lem yûled. Ve lem yekün lehû küfüven ehad. — Kul eûzü bi-rabbil-felak. Min şerri mâ halak. Ve min şerri ğâsikın izâ vekab. Ve min şerrin-neffâsâti fil-ukad. Ve min şerri hâsidin izâ hased. — Kul eûzü bi-rabbin-nâs. Melikin-nâs. İlâhin-nâs. Min şerril-vesvâsil-hannâs. Ellezî yüvesvisü fî sudûrin-nâs. Minel-cinneti ven-nâs.",
    meaningTr:
      "De ki: O Allah birdir. Allah Samed'dir (her şey O'na muhtaçtır). Doğurmamış ve doğmamıştır. Hiçbir şey O'na denk değildir. — De ki: Sabahın Rabbine sığınırım; yarattıklarının şerrinden... — De ki: İnsanların Rabbine sığınırım... Peygamberimiz (s.a.v.) her gece yatağına girince bu üç sureyi okuyup ellerine üfler, elleriyle vücudunu sıvazlardı.",
    source: 'İhlâs 112; Felak 113; Nâs 114; Buhârî, Deavât 12',
    verified: true,
  },
  {
    id: 'uyku-azabtan-koruma',
    category: 'uyku',
    titleTr: 'Uyumadan önce koruma duası',
    arabic: 'اَللّٰهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ',
    transliteration: "Allâhümme kınî azâbeke yevme teb'asü ıbâdek.",
    meaningTr: "Allah'ım! Kullarını dirilteceğin gün beni azabından koru.",
    source: 'Tirmizî, Deavât 21',
    verified: true,
  },

  // ——— HASTALIK VE SIKINTI ———
  {
    id: 'hastalik-sifa',
    category: 'hastalik',
    titleTr: 'Şifa duası',
    arabic:
      'اَللّٰهُمَّ رَبَّ النَّاسِ، أَذْهِبِ الْبَأْسَ، اِشْفِ أَنْتَ الشَّافِي، لَا شِفَاءَ إِلَّا شِفَاؤُكَ، شِفَاءً لَا يُغَادِرُ سَقَمًا',
    transliteration:
      "Allâhümme rabben-nâs, ezhibil-be's, işfi enteş-şâfî, lâ şifâe illâ şifâük, şifâen lâ yüğâdiru sekamâ.",
    meaningTr:
      "Ey insanların Rabbi olan Allah'ım! Şu hastalığı gider. Şifa ver; şifa veren yalnız sensin. Senin şifandan başka şifa yoktur. Öyle bir şifa ver ki hiçbir hastalık izi bırakmasın.",
    source: 'Buhârî, Merdâ 20; Müslim, Selâm 46',
    verified: true,
  },
  {
    id: 'hastalik-agri',
    category: 'hastalik',
    titleTr: 'Vücuttaki ağrı için',
    arabic:
      'بِسْمِ اللّٰهِ (٣) أَعُوذُ بِاللّٰهِ وَقُدْرَتِهِ مِنْ شَرِّ مَا أَجِدُ وَأُحَاذِرُ (٧)',
    transliteration:
      'Bismillâh (üç kere). Eûzü billâhi ve kudratihî min şerri mâ ecidü ve ühâzir (yedi kere).',
    meaningTr:
      "Elini vücudunun ağrıyan yerine koy; üç kere 'Bismillâh' de, yedi kere de 'Hissettiğim ve çekindiğim şeyin şerrinden Allah'a ve O'nun kudretine sığınırım' de.",
    source: 'Müslim, Selâm 67',
    verified: true,
  },
  {
    id: 'hastalik-sikinti',
    category: 'hastalik',
    titleTr: 'Sıkıntı anında',
    arabic:
      'لَا إِلٰهَ إِلَّا اللّٰهُ الْعَظِيمُ الْحَلِيمُ، لَا إِلٰهَ إِلَّا اللّٰهُ رَبُّ الْعَرْشِ الْعَظِيمِ، لَا إِلٰهَ إِلَّا اللّٰهُ رَبُّ السَّمَاوَاتِ وَرَبُّ الْأَرْضِ وَرَبُّ الْعَرْشِ الْكَرِيمِ',
    transliteration:
      'Lâ ilâhe illallâhül-azîmül-halîm. Lâ ilâhe illallâhü rabbül-arşil-azîm. Lâ ilâhe illallâhü rabbüs-semâvâti ve rabbül-ardı ve rabbül-arşil-kerîm.',
    meaningTr:
      "Azîm ve Halîm olan Allah'tan başka ilâh yoktur. Büyük arşın Rabbi olan Allah'tan başka ilâh yoktur. Göklerin Rabbi, yerin Rabbi ve kerîm arşın Rabbi olan Allah'tan başka ilâh yoktur. (Peygamberimiz s.a.v. sıkıntı anında böyle dua ederdi.)",
    source: 'Buhârî, Deavât 27; Müslim, Zikir 83',
    verified: true,
  },
  {
    id: 'hastalik-yunus',
    category: 'hastalik',
    titleTr: "Hz. Yûnus'un (a.s.) duası",
    arabic: 'لَا إِلٰهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ',
    transliteration: 'Lâ ilâhe illâ ente sübhânek, innî küntü minez-zâlimîn.',
    meaningTr:
      "Senden başka ilâh yoktur; seni tenzih ederim. Gerçekten ben (nefsine) zulmedenlerden oldum. (Bir müslüman bir konuda bu dua ile yalvarırsa Allah onun duasını mutlaka kabul eder buyrulmuştur.)",
    source: 'Enbiyâ 21:87; Tirmizî, Deavât 81',
    verified: true,
  },
  {
    id: 'hastalik-kaygi',
    category: 'hastalik',
    titleTr: 'Kaygı ve üzüntüden sığınma',
    arabic:
      'اَللّٰهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْبُخْلِ وَالْجُبْنِ، وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ',
    transliteration:
      "Allâhümme innî eûzü bike minel-hemmi vel-hazen, vel-aczi vel-kesel, vel-buhli vel-cübn, ve dalaıd-deyni ve ğalebetir-ricâl.",
    meaningTr:
      "Allah'ım! Kaygıdan ve üzüntüden, acizlikten ve tembellikten, cimrilikten ve korkaklıktan, borcun ağırlığından ve insanların baskısından sana sığınırım.",
    source: 'Buhârî, Deavât 36',
    verified: true,
  },

  // ——— KUR'AN'DAN DUALAR ———
  {
    id: 'kuran-hasene',
    category: 'kurandan',
    titleTr: 'Dünya ve ahiret iyiliği',
    arabic:
      'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
    transliteration:
      'Rabbenâ âtinâ fid-dünyâ haseneten ve fil-âhırati haseneten ve kınâ azâben-nâr.',
    meaningTr:
      'Rabbimiz! Bize dünyada da iyilik ver, ahirette de iyilik ver ve bizi ateşin azabından koru.',
    source: 'Bakara 2:201',
    verified: true,
  },
  {
    id: 'kuran-musa',
    category: 'kurandan',
    titleTr: "Hz. Mûsâ'nın (a.s.) duası",
    arabic:
      'رَبِّ اشْرَحْ لِي صَدْرِي. وَيَسِّرْ لِي أَمْرِي. وَاحْلُلْ عُقْدَةً مِنْ لِسَانِي. يَفْقَهُوا قَوْلِي',
    transliteration:
      "Rabbişrah lî sadrî. Ve yessir lî emrî. Vahlül ukdeten min lisânî. Yefkahû kavlî.",
    meaningTr:
      'Rabbim! Göğsümü genişlet (gönlüme ferahlık ver). İşimi kolaylaştır. Dilimdeki düğümü çöz ki sözümü iyi anlasınlar.',
    source: 'Tâhâ 20:25-28',
    verified: true,
  },
  {
    id: 'kuran-ibrahim',
    category: 'kurandan',
    titleTr: "Hz. İbrâhim'in (a.s.) duası",
    arabic:
      'رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِنْ ذُرِّيَّتِي، رَبَّنَا وَتَقَبَّلْ دُعَاءِ. رَبَّنَا اغْفِرْ لِي وَلِوَالِدَيَّ وَلِلْمُؤْمِنِينَ يَوْمَ يَقُومُ الْحِسَابُ',
    transliteration:
      "Rabbic'alnî mukîmes-salâti ve min zürriyyetî, rabbenâ ve tekabbel duâ'. Rabbenâğfir lî ve li-vâlideyye ve lil-mü'minîne yevme yekûmül-hisâb.",
    meaningTr:
      'Rabbim! Beni namaza devam eden bir kimse eyle; soyumdan da böyle kimseler yarat. Rabbimiz, duamı kabul et. Rabbimiz! Hesap görülecek günde beni, anne babamı ve bütün müminleri bağışla.',
    source: 'İbrâhîm 14:40-41',
    verified: true,
  },
  {
    id: 'kuran-sebat',
    category: 'kurandan',
    titleTr: 'Kalplerin sebatı için',
    arabic:
      'رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِنْ لَدُنْكَ رَحْمَةً، إِنَّكَ أَنْتَ الْوَهَّابُ',
    transliteration:
      'Rabbenâ lâ tüziğ kulûbenâ ba’de iz hedeytenâ veheb lenâ min ledünke rahmeh, inneke entel-vehhâb.',
    meaningTr:
      'Rabbimiz! Bizi hidayete erdirdikten sonra kalplerimizi eğriltme. Bize katından bir rahmet bahşet. Şüphesiz sen çok bahşedensin.',
    source: 'Âl-i İmrân 3:8',
    verified: true,
  },
  {
    id: 'kuran-goz-aydinligi',
    category: 'kurandan',
    titleTr: 'Aile ve nesil için',
    arabic:
      'رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا',
    transliteration:
      "Rabbenâ heb lenâ min ezvâcinâ ve zürriyyâtinâ kurrate a'yünin vec'alnâ lil-müttekîne imâmâ.",
    meaningTr:
      'Rabbimiz! Bize eşlerimizden ve nesillerimizden göz aydınlığı olacak (hayırlı) kimseler bahşet ve bizi takva sahiplerine önder eyle.',
    source: 'Furkân 25:74',
    verified: true,
  },
];

/** Türkçe arama için basitleştirme: küçük harf + uzatma işaretlerini sadeleştirme. */
export function normalizeTr(text: string): string {
  return text
    .toLocaleLowerCase('tr')
    .replace(/â/g, 'a')
    .replace(/î/g, 'i')
    .replace(/û/g, 'u');
}

export function getDuasByCategory(category: DuaCategoryId): Dua[] {
  return DUAS.filter((d) => d.category === category);
}

export function getDuaById(id: string): Dua | undefined {
  return DUAS.find((d) => d.id === id);
}

/** Başlıkta ve Türkçe anlamda arar. */
export function searchDuas(query: string): Dua[] {
  const q = normalizeTr(query.trim());
  if (!q) return [];
  return DUAS.filter(
    (d) => normalizeTr(d.titleTr).includes(q) || normalizeTr(d.meaningTr).includes(q),
  );
}
