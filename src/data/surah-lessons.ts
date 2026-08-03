/**
 * Sure dersleri — demo içerik paketindeki sureler için ders içerikleri.
 *
 * Kaynaklar her derste `tafsirSources` alanında belirtilir.
 * Doğrulama durumu: dersler ilahiyat danışma kurulu onayından geçene kadar
 * `verified: false` ("Uzman kontrolü bekliyor") olarak işaretlidir.
 */

export interface SurahLessonQuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

export interface SurahLesson {
  /** progress.completedLessons anahtarı olarak da kullanılır */
  id: string;
  surah: number;
  /** Surenin adının anlamı */
  nameMeaning: string;
  mainTopics: string[];
  summary: string;
  takeaways: string[];
  /** Örn. 'Tefsir: İbn Kesir; Diyanet Tefsiri' */
  tafsirSources: string;
  quiz: SurahLessonQuizQuestion[];
  /** Asistan sekmesine yönlendirilen örnek sorular */
  aiQuestions: string[];
  verified: boolean;
}

export const SURAH_LESSONS: SurahLesson[] = [
  {
    id: 'surah-lesson-1',
    surah: 1,
    nameMeaning: "Fâtiha: 'Açan, açış' — Kur'an'ın açılış suresi olduğu için bu adı almıştır.",
    mainTopics: ['Hamd ve şükür', 'Allah\'ın rahmeti', 'Hesap günü', 'Kulluk ve yardım dileme', 'Doğru yol (hidayet) duası'],
    summary:
      "Fâtiha, Kur'an'ın özeti kabul edilir. Hamdin yalnızca âlemlerin Rabbi olan Allah'a ait olduğunu bildirir; O'nun rahmetini ve hesap gününün sahibi olduğunu hatırlatır. Kulluğun ve yardım dilemenin yalnızca Allah'a yapılacağını öğretir ve doğru yola iletilme duasıyla sona erer. Her namazın her rekâtında okunur.",
    takeaways: [
      'Güne hamd ile başlamak, nimetleri fark etmeyi öğretir.',
      "Yardımı önce Allah'tan istemek, kula umutsuzluk yerine tevekkül kazandırır.",
      "'Bizi doğru yola ilet' duası, her gün yeniden istikamet arayışıdır; namazda bilinçli okumaya çalışın.",
    ],
    tafsirSources: 'Tefsir: İbn Kesir; Elmalılı Hamdi Yazır (Hak Dini Kur\'an Dili); Diyanet Tefsiri',
    quiz: [
      {
        question: 'Fâtiha suresi kaç ayettir?',
        options: ['5', '7', '9'],
        correctIndex: 1,
      },
      {
        question: "'İyyâke na'büdü ve iyyâke neste'în' ayetinin anlamı nedir?",
        options: [
          'Bizi doğru yola ilet.',
          'Hamd, âlemlerin Rabbi olan Allah\'a mahsustur.',
          'Ancak sana ibadet ederiz ve yalnız senden yardım dileriz.',
        ],
        correctIndex: 2,
      },
      {
        question: 'Fâtiha suresi namazda ne sıklıkla okunur?',
        options: ['Yalnızca ilk rekâtta', 'Her rekâtta', 'Yalnızca sabah namazında'],
        correctIndex: 1,
      },
    ],
    aiQuestions: [
      'Fâtiha suresine neden "Kur\'an\'ın özeti" denir?',
      'Fâtiha suresindeki "doğru yol" ifadesi tefsirlerde nasıl açıklanır?',
      'Namazda Fâtiha okumanın hükmü nedir?',
    ],
    verified: false,
  },
  {
    id: 'surah-lesson-103',
    surah: 103,
    nameMeaning: "Asr: 'Zaman, ikindi vakti' — süreye/zamana yemin ile başlar.",
    mainTopics: ['Zamanın değeri', 'İnsanın ziyanı', 'İman ve salih amel', 'Hakkı ve sabrı tavsiye'],
    summary:
      'Asr suresi üç ayetiyle kurtuluşun formülünü verir: insan zaman içinde ziyandadır; ancak iman eden, salih amel işleyen, birbirine hakkı ve sabrı tavsiye edenler bunun dışındadır. İmam Şâfiî\'nin "İnsanlar yalnız bu sure üzerinde düşünseydi, bu onlara yeterdi" dediği nakledilir (İbn Kesir).',
    takeaways: [
      'Zamanı, geri gelmeyen bir sermaye olarak görüp günü planlayın.',
      'Kişisel iyilik yetmez; hakkı ve sabrı birbirine hatırlatan bir çevre kurun.',
      'Küçük ama sürekli salih ameller, büyük fakat süreksiz olanlardan daha değerlidir.',
    ],
    tafsirSources: 'Tefsir: İbn Kesir; Diyanet Tefsiri; Elmalılı Hamdi Yazır',
    quiz: [
      {
        question: 'Asr suresine göre insan hangi durumdadır?',
        options: ['Kazançtadır', 'Ziyandadır', 'Belirsizliktedir'],
        correctIndex: 1,
      },
      {
        question: 'Surede ziyandan kurtulanların özelliklerinden biri değildir?',
        options: ['İman etmek', 'Salih amel işlemek', 'Mal biriktirmek'],
        correctIndex: 2,
      },
      {
        question: 'Asr suresinde birbirine tavsiye edilmesi istenen iki şey nedir?',
        options: ['Hak ve sabır', 'İlim ve ticaret', 'Oruç ve zekât'],
        correctIndex: 0,
      },
    ],
    aiQuestions: [
      'Asr suresindeki "hüsr" (ziyan) kavramı ne anlama gelir?',
      'Hakkı ve sabrı tavsiye etmek günlük hayatta nasıl uygulanır?',
    ],
    verified: false,
  },
  {
    id: 'surah-lesson-105',
    surah: 105,
    nameMeaning: "Fîl: 'Fil' — Fil Vakası'nı anlattığı için bu adı almıştır.",
    mainTopics: ["Fil Vakası", "Kâbe'nin korunması", "Allah'ın kudreti", 'Zorbalığın sonu'],
    summary:
      "Sure, Peygamber Efendimizin doğduğu yıl civarında Kâbe'yi yıkmak için fillerle gelen Ebrehe ordusunun, Allah'ın gönderdiği sürü sürü kuşların attığı taşlarla helâk edilişini hatırlatır. Görünürde karşı konulamaz güçlerin bile Allah'ın iradesi karşısında âciz olduğunu öğretir.",
    takeaways: [
      'Hiçbir zorba güç kalıcı değildir; haksızlık karşısında umutsuzluğa kapılmayın.',
      "Allah'ın koruması, kulların hesap edemediği yollarla gelebilir.",
      'Tarihî olayları, ibret gözüyle okumak imanı güçlendirir.',
    ],
    tafsirSources: 'Tefsir: İbn Kesir; Diyanet Tefsiri',
    quiz: [
      {
        question: 'Fîl suresinde anlatılan ordunun amacı neydi?',
        options: ["Kâbe'yi yıkmak", "Mekke'de ticaret yapmak", "Medine'yi kuşatmak"],
        correctIndex: 0,
      },
      {
        question: 'Sureye göre ordu nasıl helâk edildi?',
        options: ['Fırtına ile', 'Sürü sürü kuşların attığı taşlarla', 'Deprem ile'],
        correctIndex: 1,
      },
      {
        question: "Fil Vakası hangi olayla yaklaşık aynı döneme denk gelir?",
        options: [
          'Hicret ile',
          'Peygamber Efendimizin doğumu ile',
          'Mekke\'nin fethi ile',
        ],
        correctIndex: 1,
      },
    ],
    aiQuestions: [
      'Fil Vakası tarihî kaynaklarda nasıl anlatılır?',
      'Fîl suresi ile Kureyş suresi arasındaki bağlantı nedir?',
    ],
    verified: false,
  },
  {
    id: 'surah-lesson-109',
    surah: 109,
    nameMeaning: "Kâfirûn: 'Kâfirler' — ilk ayetindeki hitaptan adını alır.",
    mainTopics: ['Tevhidde tavizsizlik', 'İnanç ayrılığı', 'Din özgürlüğü ilkesi'],
    summary:
      "Mekke müşrikleri, bir yıl kendi ilâhlarına bir yıl Allah'a ibadet etmeyi teklif ettiklerinde bu sure indirildi. Sure, ibadette hiçbir ortaklık ve pazarlık olamayacağını kesin bir dille bildirir ve 'Sizin dininiz size, benim dinim bana' ilkesiyle son bulur.",
    takeaways: [
      'İnanç esaslarında taviz verilmez; nezaket ile ilkesizlik karıştırılmamalıdır.',
      'Farklı inançtan insanlarla beraber yaşamak, inancın sulandırılmasını gerektirmez.',
      'Kimlik ve inancınızı net, fakat kavgasız bir dille ifade edebilirsiniz.',
    ],
    tafsirSources: 'Tefsir: İbn Kesir; Elmalılı Hamdi Yazır; Diyanet Tefsiri',
    quiz: [
      {
        question: 'Kâfirûn suresi hangi teklife cevap olarak indirilmiştir?',
        options: [
          'Ticaret ortaklığı teklifine',
          'Dönüşümlü ibadet teklifine',
          'Savaş anlaşması teklifine',
        ],
        correctIndex: 1,
      },
      {
        question: "'Leküm dînüküm ve liye dîn' ne demektir?",
        options: [
          'Sizin dininiz size, benim dinim banadır.',
          'Hepimiz aynı dine inanırız.',
          'Din konusunda tartışmayın.',
        ],
        correctIndex: 0,
      },
      {
        question: 'Surenin ana mesajı nedir?',
        options: [
          'İbadette ortaklık ve pazarlık olmaz.',
          'Komşuluk ilişkileri önemlidir.',
          'Ticarette dürüstlük esastır.',
        ],
        correctIndex: 0,
      },
    ],
    aiQuestions: [
      'Kâfirûn suresi hoşgörü ile tavizsizliği nasıl dengeler?',
      'Kâfirûn suresinin nüzul sebebi nedir?',
    ],
    verified: false,
  },
  {
    id: 'surah-lesson-110',
    surah: 110,
    nameMeaning: "Nasr: 'Yardım, zafer' — Allah'ın yardımını ve fethi müjdeler.",
    mainTopics: ["Allah'ın yardımı", 'Fetih', 'Tesbih ve hamd', 'İstiğfar'],
    summary:
      "Sure, Allah'ın yardımı ve fetih gerçekleştiğinde, insanların bölük bölük İslâm'a girdiği görüldüğünde yapılması gerekeni öğretir: Rabbi hamd ile tesbih etmek ve O'ndan bağışlanma dilemek. Medine döneminin sonlarında inmiştir ve Peygamber Efendimizin vefatının yaklaştığına işaret sayılmıştır.",
    takeaways: [
      'Başarı anında övünmek yerine şükür ve istiğfar edin.',
      'Zafer ve nimet, Allah\'ın yardımıyla gelir; kibirden korunun.',
      'Bir işin sonuna gelmek, yeni bir muhasebe başlangıcıdır.',
    ],
    tafsirSources: 'Tefsir: İbn Kesir; Buhârî (Meğâzî); Diyanet Tefsiri',
    quiz: [
      {
        question: 'Nasr suresine göre zafer geldiğinde ne yapılmalıdır?',
        options: [
          'Kutlama yapılmalıdır',
          'Hamd ile tesbih edilmeli ve istiğfar edilmelidir',
          'Yeni seferler planlanmalıdır',
        ],
        correctIndex: 1,
      },
      {
        question: 'Nasr suresi hangi dönemde inmiştir?',
        options: ['Mekke döneminin başında', 'Hicret esnasında', 'Medine döneminin sonlarında'],
        correctIndex: 2,
      },
      {
        question: "Surede insanların Allah'ın dinine nasıl girdiği anlatılır?",
        options: ['Tek tek', 'Bölük bölük', 'Gizlice'],
        correctIndex: 1,
      },
    ],
    aiQuestions: [
      'Nasr suresi neden Peygamberimizin vefatına işaret sayılmıştır?',
      'İstiğfarın müminin hayatındaki yeri nedir?',
    ],
    verified: false,
  },
  {
    id: 'surah-lesson-112',
    surah: 112,
    nameMeaning: "İhlâs: 'Samimiyet, saf tevhid' — Allah'ı en özlü şekilde tanıtır.",
    mainTopics: ["Allah'ın birliği (tevhid)", 'Samed sıfatı', 'Doğmamış ve doğurulmamış olması', 'Eşsizlik'],
    summary:
      "İhlâs suresi, tevhid inancının en özlü ifadesidir: Allah birdir; her şey O'na muhtaçtır, O hiçbir şeye muhtaç değildir; doğurmamış ve doğurulmamıştır; hiçbir şey O'na denk değildir. Hadiste bu surenin Kur'an'ın üçte birine denk olduğu bildirilmiştir (Buhârî, Fedâilü'l-Kur'ân 13).",
    takeaways: [
      "İhtiyaçlarınızı en son kapıya değil, önce Samed olan Allah'a arz edin.",
      'Tevhid, hayatın merkezine tek ölçü koymaktır; bu iç huzuru getirir.',
      'Kısa fakat anlamı derin sureleri ezberleyip namazda bilinçle okuyun.',
    ],
    tafsirSources: "Tefsir: İbn Kesir; Buhârî (Fedâilü'l-Kur'ân); Diyanet Tefsiri",
    quiz: [
      {
        question: "'Samed' sıfatının anlamı nedir?",
        options: [
          'Her şeyin kendisine muhtaç olduğu, hiçbir şeye muhtaç olmayan',
          'Çok bağışlayan',
          'Her şeyi işiten',
        ],
        correctIndex: 0,
      },
      {
        question: 'Hadise göre İhlâs suresi neye denk sayılmıştır?',
        options: ["Kur'an'ın yarısına", "Kur'an'ın üçte birine", "Kur'an'ın tamamına"],
        correctIndex: 1,
      },
      {
        question: 'İhlâs suresi kaç ayettir?',
        options: ['3', '4', '5'],
        correctIndex: 1,
      },
    ],
    aiQuestions: [
      "İhlâs suresi neden Kur'an'ın üçte birine denk sayılmıştır?",
      'Tevhid inancının günlük hayattaki yansımaları nelerdir?',
    ],
    verified: false,
  },
  {
    id: 'surah-lesson-113',
    surah: 113,
    nameMeaning: "Felak: 'Sabah aydınlığı, yarılma' — sığınma (muavvizeteyn) surelerinin ilkidir.",
    mainTopics: ['Allah\'a sığınma', 'Yaratılmışların şerri', 'Haset', 'Manevi korunma'],
    summary:
      "Felak suresi, sabahın Rabbine sığınmayı öğretir: yaratılmışların şerrinden, çöken karanlığın şerrinden, düğümlere üfleyenlerin ve haset edenin şerrinden. Nâs suresi ile birlikte 'muavvizeteyn' (iki sığındırıcı) olarak anılır; Peygamber Efendimiz yatmadan önce bu iki sureyi okurdu (Buhârî, Fedâilü'l-Kur'ân 14).",
    takeaways: [
      'Korkularınızı büyütmek yerine onları Allah\'a sığınarak teslim edin.',
      'Hasetten korunmak kadar haset etmemek de bu surenin dersidir.',
      'Sabah ve akşam Felak-Nâs okumayı günlük alışkanlık edinin.',
    ],
    tafsirSources: "Tefsir: İbn Kesir; Buhârî (Fedâilü'l-Kur'ân); Diyanet Tefsiri",
    quiz: [
      {
        question: "Felak ve Nâs sureleri birlikte hangi adla anılır?",
        options: ['Zehrâvân', 'Muavvizeteyn', 'Müsebbihât'],
        correctIndex: 1,
      },
      {
        question: 'Felak suresinde sığınılan şerlerden biri değildir?',
        options: ['Haset edenin şerri', 'Çöken karanlığın şerri', 'Açlığın şerri'],
        correctIndex: 2,
      },
      {
        question: "'Felak' kelimesinin anlamlarından biri nedir?",
        options: ['Sabah aydınlığı', 'Gece karanlığı', 'Yıldız'],
        correctIndex: 0,
      },
    ],
    aiQuestions: [
      'Muavvizeteyn sureleri ne zaman ve nasıl okunur?',
      'İslam\'da nazar ve hasetten korunmanın yolları nelerdir?',
    ],
    verified: false,
  },
  {
    id: 'surah-lesson-114',
    surah: 114,
    nameMeaning: "Nâs: 'İnsanlar' — her ayeti 'insanlar' kelimesiyle biten sığınma suresidir.",
    mainTopics: ['Vesveseden sığınma', "Allah'ın Rab, Melik ve İlâh oluşu", 'Cin ve insan şerri'],
    summary:
      "Kur'an'ın son suresi olan Nâs, insanların Rabbine, hükümdarına ve ilâhına sığınmayı öğretir: sinsi vesvesecinin, insanların kalplerine vesvese veren cin ve insan şeytanlarının şerrinden. Felak suresi dış şerlerden, Nâs suresi ise içteki vesveseden korunmayı konu alır.",
    takeaways: [
      'Olumsuz iç sesleri (vesvese) besleyip büyütmeyin; sığınma bilinciyle geçiştirin.',
      'Kalbinizi neyin beslediğine dikkat edin: çevre, içerik ve arkadaşlık seçimleri vesvesenin kapılarıdır.',
      'Namaz sonrası ve uyku öncesi Nâs suresini okuma alışkanlığı edinin.',
    ],
    tafsirSources: 'Tefsir: İbn Kesir; Diyanet Tefsiri; Elmalılı Hamdi Yazır',
    quiz: [
      {
        question: "Nâs suresinde Allah hangi üç sıfatla anılır?",
        options: [
          'Rab, Melik, İlâh',
          'Rahmân, Rahîm, Gafûr',
          'Hayy, Kayyûm, Azîm',
        ],
        correctIndex: 0,
      },
      {
        question: "'Hannâs' ne demektir?",
        options: [
          'Açıkça saldıran',
          'Sinsi, geri çekilip fırsat kollayan vesveseci',
          'Yardım eden',
        ],
        correctIndex: 1,
      },
      {
        question: 'Sureye göre vesvese kimlerden gelebilir?',
        options: ['Yalnızca cinlerden', 'Yalnızca insanlardan', 'Cinlerden ve insanlardan'],
        correctIndex: 2,
      },
    ],
    aiQuestions: [
      'Vesvese ile mücadelede Kur\'an ne tavsiye eder?',
      'Felak ve Nâs sureleri arasındaki fark nedir?',
    ],
    verified: false,
  },
];

const BY_SURAH = new Map<number, SurahLesson>(SURAH_LESSONS.map((l) => [l.surah, l]));
const BY_ID = new Map<string, SurahLesson>(SURAH_LESSONS.map((l) => [l.id, l]));

export function getLessonBySurah(surah: number): SurahLesson | undefined {
  return BY_SURAH.get(surah);
}

export function getLessonById(id: string): SurahLesson | undefined {
  return BY_ID.get(id);
}

export function hasLesson(surah: number): boolean {
  return BY_SURAH.has(surah);
}
