/**
 * Öğrenme programları (P0-SPEC #16-17). İçerik özgün eğitim metnidir;
 * ayet ve hadis referansları gerçektir.
 */

export interface LessonSource {
  kind: 'ayah' | 'hadith' | 'book';
  reference: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answerIndex: number;
}

export interface Lesson {
  id: string;
  programId: string;
  order: number;
  title: string;
  body: string[];
  keyPoints: string[];
  sources: LessonSource[];
  quiz: QuizQuestion[];
  relatedAiQuestions: string[];
  relatedVideoIds: string[];
}

export interface Program {
  id: string;
  title: string;
  description: string;
  icon: string;
  lessonIds: string[];
}

export const LESSONS: Lesson[] = [
  // ——— İslam'a Başlangıç ———
  {
    id: 'islam-1',
    programId: 'islam',
    order: 1,
    title: 'İslam nedir? Kelime-i şehadet',
    body: [
      'İslam, Allah\'ın birliğine ve Hz. Muhammed\'in (s.a.v.) O\'nun kulu ve elçisi olduğuna inanarak Allah\'a teslim olmak demektir. Bu teslimiyet zorla değil, gönülden bir kabulle olur.',
      'İslam\'a giriş kelime-i şehadetle olur: "Eşhedü en lâ ilâhe illallah ve eşhedü enne Muhammeden abdühû ve rasûlüh" — Şahitlik ederim ki Allah\'tan başka ilah yoktur ve yine şahitlik ederim ki Muhammed O\'nun kulu ve elçisidir.',
      'İslam beş temel üzerine kurulmuştur: kelime-i şehadet, namaz, oruç, zekât ve hac. Bu esaslar Cibrîl hadisi diye bilinen rivayette özetlenir.',
    ],
    keyPoints: [
      'İslam, Allah\'a gönülden teslimiyettir.',
      'Giriş kapısı kelime-i şehadettir.',
      'Beş temel esas: şehadet, namaz, oruç, zekât, hac.',
    ],
    sources: [
      { kind: 'hadith', reference: 'Buhârî, Îmân 37 (Cibrîl hadisi)' },
      { kind: 'ayah', reference: 'Âl-i İmrân 3:19' },
    ],
    quiz: [
      {
        question: 'İslam\'ın beş şartından biri değildir?',
        options: ['Namaz', 'Oruç', 'Kurban', 'Zekât'],
        answerIndex: 2,
      },
      {
        question: 'Kelime-i şehadet neyi ifade eder?',
        options: [
          'Allah\'ın birliğine ve Hz. Muhammed\'in elçiliğine şahitliği',
          'Yalnızca namaz kılmayı',
          'Hacca gitmeyi',
          'Sadaka vermeyi',
        ],
        answerIndex: 0,
      },
    ],
    relatedAiQuestions: ['İslam\'ın şartları nelerdir?', 'Kelime-i şehadet ne anlama gelir?'],
    relatedVideoIds: ['v10'],
  },
  {
    id: 'islam-2',
    programId: 'islam',
    order: 2,
    title: 'İmanın esasları',
    body: [
      'İman altı esasa dayanır: Allah\'a, meleklerine, kitaplarına, peygamberlerine, ahiret gününe, kaza ve kadere inanmak. Bu esaslar Cibrîl hadisinde bir arada sayılır.',
      'İman yalnızca dil ile ikrar değil, kalp ile tasdiktir. Kalpteki iman, davranışlara güzel ahlak olarak yansır.',
    ],
    keyPoints: ['İmanın altı esası vardır.', 'İman kalp ile tasdik, dil ile ikrardır.'],
    sources: [
      { kind: 'hadith', reference: 'Müslim, Îmân 1' },
      { kind: 'ayah', reference: 'Bakara 2:285' },
    ],
    quiz: [
      {
        question: 'İmanın esaslarından biri değildir?',
        options: ['Meleklere iman', 'Kitaplara iman', 'Kâbe\'ye iman', 'Kadere iman'],
        answerIndex: 2,
      },
    ],
    relatedAiQuestions: ['İmanın şartları nelerdir?'],
    relatedVideoIds: ['v10'],
  },
  {
    id: 'islam-3',
    programId: 'islam',
    order: 3,
    title: 'Allah\'ı tanımak',
    body: [
      'Allah birdir; eşi, benzeri ve ortağı yoktur. İhlâs suresi bu inancın en özlü ifadesidir: "De ki: O Allah birdir. Allah Samed\'dir. Doğurmamış ve doğmamıştır. Hiçbir şey O\'na denk değildir."',
      'Allah\'ı isimleri (Esmaül Hüsna) ile tanırız: Rahmân, Rahîm, Kerîm, Gafûr... Bu isimler hem O\'nu tanıtır hem de bize ahlaki bir ufuk çizer.',
    ],
    keyPoints: ['Tevhid, İslam\'ın özüdür.', 'Esmaül Hüsna Allah\'ı tanımanın anahtarıdır.'],
    sources: [
      { kind: 'ayah', reference: 'İhlâs 112:1-4' },
      { kind: 'hadith', reference: 'Buhârî, Deavât 68' },
    ],
    quiz: [
      {
        question: 'Tevhid ne demektir?',
        options: [
          'Allah\'ın birliğine inanmak',
          'Namaz kılmak',
          'Oruç tutmak',
          'Sadaka vermek',
        ],
        answerIndex: 0,
      },
    ],
    relatedAiQuestions: ['Esmaül Hüsna nedir?'],
    relatedVideoIds: ['v10'],
  },

  // ——— Namazı Öğreniyorum ———
  {
    id: 'namaz-1',
    programId: 'namaz',
    order: 1,
    title: 'Namaz neden ve ne zaman kılınır?',
    body: [
      'Namaz, İslam\'ın direği ve müminin günde beş kez Rabbiyle buluşmasıdır. Kur\'an\'da namaz, hayâsızlıktan ve kötülükten alıkoyan bir ibadet olarak tanıtılır (Ankebût 29:45).',
      'Beş vakit: İmsak ile güneş doğuşu arasında sabah (2 rekât farz), öğle (4), ikindi (4), akşam (3) ve yatsı (4). Vakitler güneşin hareketine göre belirlenir; uygulamanın Namaz Vakitleri ekranı bulunduğunuz konuma göre hesaplar.',
    ],
    keyPoints: [
      'Namaz günde beş vakittir.',
      'Farz rekâtlar: sabah 2, öğle 4, ikindi 4, akşam 3, yatsı 4.',
      'Vakitler güneşe göre belirlenir.',
    ],
    sources: [
      { kind: 'ayah', reference: 'Ankebût 29:45' },
      { kind: 'ayah', reference: 'Nisâ 4:103' },
    ],
    quiz: [
      {
        question: 'Akşam namazının farzı kaç rekâttır?',
        options: ['2', '3', '4', '5'],
        answerIndex: 1,
      },
      {
        question: 'Namazın vakitleri neye göre belirlenir?',
        options: ['Aya', 'Güneşin hareketine', 'Saate', 'Mevsime'],
        answerIndex: 1,
      },
    ],
    relatedAiQuestions: ['Namaz vakitleri nasıl hesaplanır?', 'Kaza namazı nasıl kılınır?'],
    relatedVideoIds: ['v2'],
  },
  {
    id: 'namaz-2',
    programId: 'namaz',
    order: 2,
    title: 'Abdest: Namazın anahtarı',
    body: [
      'Abdestin farzları dörttür (Mâide 5:6): yüzü yıkamak, kolları dirseklerle birlikte yıkamak, başı mesh etmek, ayakları topuklarla birlikte yıkamak.',
      'Sünnetleri: niyet ve besmele ile başlamak, elleri ve ağzı-burnu yıkamak, uzuvları üçer kez yıkamak, sırayı gözetmek. Abdesti bozan başlıca durumlar: tuvalet ihtiyacı, uyku, bayılma.',
    ],
    keyPoints: ['Abdestin farzı dörttür.', 'Uzuvları üçer kez yıkamak sünnettir.'],
    sources: [{ kind: 'ayah', reference: 'Mâide 5:6' }],
    quiz: [
      {
        question: 'Abdestin farzlarından biri değildir?',
        options: ['Yüzü yıkamak', 'Başı mesh etmek', 'Ağzı üç kez çalkalamak', 'Ayakları yıkamak'],
        answerIndex: 2,
      },
    ],
    relatedAiQuestions: ['Abdesti bozan şeyler nelerdir?'],
    relatedVideoIds: ['v3'],
  },
  {
    id: 'namaz-3',
    programId: 'namaz',
    order: 3,
    title: 'Namazın kılınışı: adım adım',
    body: [
      'Namaz niyetle ve "Allahu Ekber" (iftitah tekbiri) ile başlar. Kıyamda Sübhâneke, Fâtiha ve bir sure okunur; rükûda "Sübhâne Rabbiye\'l-azîm", secdede "Sübhâne Rabbiye\'l-a\'lâ" denir.',
      'İki rekâtta bir oturulur ve Tahiyyât okunur. Son oturuşta Salli-Bârik ve Rabbenâ duaları eklenir; namaz sağa ve sola selam vererek tamamlanır.',
      'Yeni başlayan biri önce sabah namazının iki rekâtını öğrenmeli, kısa sureleri (İhlâs, Kevser) ezberlemelidir. Uygulamanın ezber modu bu sureler için tekrar imkânı sunar.',
    ],
    keyPoints: [
      'Namaz tekbirle başlar, selamla biter.',
      'Rükû ve secde tesbihleri farklıdır.',
      'Öğrenmeye sabah namazıyla başlayın.',
    ],
    sources: [
      { kind: 'hadith', reference: 'Buhârî, Ezân 122' },
      { kind: 'book', reference: 'Diyanet İlmihali, c.1' },
    ],
    quiz: [
      {
        question: 'Secdede hangi tesbih söylenir?',
        options: [
          'Sübhâne Rabbiye\'l-azîm',
          'Sübhâne Rabbiye\'l-a\'lâ',
          'Elhamdülillah',
          'Allahu Ekber',
        ],
        answerIndex: 1,
      },
    ],
    relatedAiQuestions: ['Namazda hangi sureler okunur?'],
    relatedVideoIds: ['v2', 'v3'],
  },

  // ——— Kur'an Okumaya Başlangıç ———
  {
    id: 'kuran-1',
    programId: 'kuran',
    order: 1,
    title: 'Kur\'an\'la tanışma',
    body: [
      'Kur\'an-ı Kerim, Allah\'ın Hz. Muhammed\'e (s.a.v.) yaklaşık 23 yılda vahyettiği son ilahi kitaptır; 114 sure ve 6236 ayetten oluşur.',
      'Kur\'an okumayı öğrenmek için önce Arap alfabesinin 28 harfi, sonra harekeler (üstün, esre, ötre) öğrenilir. Düzenli on dakikalık çalışma, düzensiz uzun seanslardan daha etkilidir.',
    ],
    keyPoints: ['Kur\'an 114 suredir.', 'Önce harfler, sonra harekeler öğrenilir.'],
    sources: [
      { kind: 'hadith', reference: 'Buhârî, Fezâilü\'l-Kur\'ân 21' },
      { kind: 'ayah', reference: 'Müzzemmil 73:4' },
    ],
    quiz: [
      {
        question: 'Kur\'an kaç sureden oluşur?',
        options: ['100', '114', '124', '99'],
        answerIndex: 1,
      },
    ],
    relatedAiQuestions: ['Kur\'an okumaya nereden başlamalıyım?'],
    relatedVideoIds: ['v9'],
  },
  {
    id: 'kuran-2',
    programId: 'kuran',
    order: 2,
    title: 'Tecvide giriş',
    body: [
      'Tecvit, Kur\'an harflerini hakkını vererek okuma ilmidir. Med (uzatma), ihfa (gizleme), idgam (katma) ve kalkale (harfi hafif sıçratma) temel kurallardandır.',
      'Uygulamanın Kur\'an okuma ekranında tecvit renkleri açılabilir; her rengin açıklaması rehberde yer alır. Tecvit en doğru şekilde bir hocadan yüz yüze öğrenilir; uygulama destekleyicidir.',
    ],
    keyPoints: ['Tecvit, doğru okuma ilmidir.', 'Uygulamadaki renkler öğrenmeye yardımcıdır.'],
    sources: [
      { kind: 'ayah', reference: 'Müzzemmil 73:4' },
      { kind: 'book', reference: 'Karabaş Tecvidi (klasik metin)' },
    ],
    quiz: [
      {
        question: 'Tecvit ilminin amacı nedir?',
        options: [
          'Hızlı okumak',
          'Harfleri hakkını vererek doğru okumak',
          'Ezber yapmak',
          'Meal okumak',
        ],
        answerIndex: 1,
      },
    ],
    relatedAiQuestions: ['Tecvit kuralları nelerdir?'],
    relatedVideoIds: ['v9'],
  },
  {
    id: 'kuran-3',
    programId: 'kuran',
    order: 3,
    title: 'Anlayarak okumak: Meal ve tefekkür',
    body: [
      'Kur\'an yalnızca yüzünden okunmak için değil, anlaşılıp yaşanmak için indirilmiştir: "Bu, ayetlerini düşünsünler diye sana indirdiğimiz mübarek bir kitaptır" (Sâd 38:29).',
      'Meal okurken sure ve ayetin bağlamını (iniş sebebi, öncesi-sonrası) dikkate almak yanlış anlamaları önler. Uygulamada her ayetin altında meal ve kaynak bilgisi gösterilir.',
    ],
    keyPoints: ['Kur\'an anlamak için okunur.', 'Bağlam, doğru anlamanın anahtarıdır.'],
    sources: [{ kind: 'ayah', reference: 'Sâd 38:29' }],
    quiz: [
      {
        question: 'Sâd 38:29\'a göre Kur\'an niçin indirilmiştir?',
        options: [
          'Sadece ezberlensin diye',
          'Ayetleri düşünülsün diye',
          'Duvara asılsın diye',
          'Yalnızca Ramazan\'da okunsun diye',
        ],
        answerIndex: 1,
      },
    ],
    relatedAiQuestions: ['Meal okumak yeterli mi?'],
    relatedVideoIds: ['v9'],
  },

  // ——— Peygamberimizin Hayatı ———
  {
    id: 'siyer-1',
    programId: 'siyer',
    order: 1,
    title: 'Doğumu ve gençliği: el-Emîn',
    body: [
      'Hz. Muhammed (s.a.v.) 571 yılında Mekke\'de doğdu. Babası Abdullah\'ı doğumundan önce, annesi Âmine\'yi altı yaşında kaybetti; dedesi Abdülmuttalib ve amcası Ebû Tâlib\'in himayesinde büyüdü.',
      'Gençliğinde dürüstlüğü ve güvenilirliğiyle tanındı; Mekkeliler ona "el-Emîn" (güvenilir) derdi. Peygamberlikten önce dahi topluma örnek bir ahlak sergiledi.',
    ],
    keyPoints: ['571\'de Mekke\'de doğdu.', 'Toplumda "el-Emîn" diye tanındı.'],
    sources: [{ kind: 'book', reference: 'İbn Hişâm, es-Sîretü\'n-Nebeviyye' }],
    quiz: [
      {
        question: 'Peygamberimize gençliğinde verilen lakap nedir?',
        options: ['el-Emîn', 'el-Fârûk', 'es-Sıddîk', 'Zünnûreyn'],
        answerIndex: 0,
      },
    ],
    relatedAiQuestions: ['Peygamberimizin ahlakı nasıldı?'],
    relatedVideoIds: ['v4'],
  },
  {
    id: 'siyer-2',
    programId: 'siyer',
    order: 2,
    title: 'Vahiy ve Mekke dönemi',
    body: [
      '610 yılında Hira mağarasında ilk vahiy geldi: "Yaratan Rabbinin adıyla oku!" (Alak 96:1). Mekke döneminde 13 yıl boyunca tevhid inancı tebliğ edildi.',
      'Müslümanlar bu dönemde büyük baskılara sabretti; Habeşistan\'a iki hicret yaşandı. Zorluklara rağmen tebliğ hikmet ve güzel öğütle sürdü (Nahl 16:125).',
    ],
    keyPoints: ['İlk vahiy 610\'da geldi.', 'Mekke dönemi sabır ve tebliğ dönemidir.'],
    sources: [
      { kind: 'ayah', reference: 'Alak 96:1-5' },
      { kind: 'hadith', reference: 'Buhârî, Bed\'ü\'l-vahy 3' },
    ],
    quiz: [
      {
        question: 'İlk vahyedilen ayet hangi emirle başlar?',
        options: ['Namaz kıl', 'Oku', 'Sabret', 'İnfak et'],
        answerIndex: 1,
      },
    ],
    relatedAiQuestions: ['İlk vahiy nasıl geldi?'],
    relatedVideoIds: ['v4'],
  },
  {
    id: 'siyer-3',
    programId: 'siyer',
    order: 3,
    title: 'Hicret ve Medine\'de kardeşlik',
    body: [
      '622\'de Medine\'ye hicret edildi; İslam takvimi bu olayı başlangıç alır. Medine\'de mescit inşa edildi, muhacirlerle ensar arasında kardeşlik (muâhât) kuruldu.',
      'Medine Vesikası ile farklı inanç grupları arasında bir arada yaşama hukuku düzenlendi. Bu, toplumsal sözleşme tarihinin önemli örneklerindendir.',
    ],
    keyPoints: ['Hicret, hicri takvimin başlangıcıdır.', 'Ensar-muhacir kardeşliği kuruldu.'],
    sources: [{ kind: 'book', reference: 'İbn Hişâm, es-Sîretü\'n-Nebeviyye' }],
    quiz: [
      {
        question: 'Hicri takvim hangi olayla başlar?',
        options: ['Bedir Savaşı', 'Hicret', 'Veda Haccı', 'İlk vahiy'],
        answerIndex: 1,
      },
    ],
    relatedAiQuestions: ['Hicret neden önemlidir?'],
    relatedVideoIds: ['v4'],
  },
  {
    id: 'siyer-4',
    programId: 'siyer',
    order: 4,
    title: 'Veda Hutbesi ve bize kalan miras',
    body: [
      '632 yılındaki Veda Haccı\'nda Efendimiz, yüz bini aşkın sahabiye insanlığın temel haklarını özetleyen hutbesini okudu: can, mal ve namus dokunulmazdır; üstünlük ancak takva iledir.',
      'Bize bıraktığı miras iki emanettir: Allah\'ın kitabı ve sünneti. Ona bağlılık, ahlakını hayatımıza taşımakla olur.',
    ],
    keyPoints: ['Veda Hutbesi evrensel bir insan hakları metnidir.', 'Miras: Kur\'an ve sünnet.'],
    sources: [{ kind: 'hadith', reference: 'Müslim, Hac 147' }],
    quiz: [
      {
        question: 'Veda Hutbesi\'ne göre üstünlük neyledir?',
        options: ['Soyla', 'Zenginlikle', 'Takvayla', 'Kuvvetle'],
        answerIndex: 2,
      },
    ],
    relatedAiQuestions: ['Veda Hutbesi\'nde neler söylendi?'],
    relatedVideoIds: ['v5'],
  },

  // ——— Güzel Ahlak ———
  {
    id: 'ahlak-1',
    programId: 'ahlak',
    order: 1,
    title: 'Ahlakın dindeki yeri',
    body: [
      'Peygamberimiz "Ben ancak güzel ahlakı tamamlamak için gönderildim" buyurmuştur (Muvatta\', Hüsnü\'l-hulk 8). İbadetler, ahlakı güzelleştirdiği ölçüde amacına ulaşır.',
      'Kur\'an, Efendimizi "büyük bir ahlak üzere" diye över (Kalem 68:4). Mümin; doğru sözlü, emanete sadık, insanlara faydalı kişidir.',
    ],
    keyPoints: ['Güzel ahlak, peygamberliğin amacındandır.', 'İbadet ahlaka yansımalıdır.'],
    sources: [
      { kind: 'ayah', reference: 'Kalem 68:4' },
      { kind: 'hadith', reference: 'Muvatta\', Hüsnü\'l-hulk 8' },
    ],
    quiz: [
      {
        question: 'Kalem 68:4 kimi "büyük bir ahlak üzere" diye över?',
        options: ['Hz. Musa', 'Hz. İbrahim', 'Hz. Muhammed (s.a.v.)', 'Hz. İsa'],
        answerIndex: 2,
      },
    ],
    relatedAiQuestions: ['İslam\'da güzel ahlak nedir?'],
    relatedVideoIds: ['v4'],
  },
  {
    id: 'ahlak-2',
    programId: 'ahlak',
    order: 2,
    title: 'Sabır ve tevekkül',
    body: [
      'Sabır; zorluk karşısında yılmadan, isyan etmeden Allah\'a güvenerek çaba göstermektir. "Allah sabredenlerle beraberdir" (Bakara 2:153).',
      'Tevekkül, tedbiri alıp sonucu Allah\'a bırakmaktır. "Deveni bağla, sonra tevekkül et" hadisi bu dengeyi öğretir (Tirmizî, Kıyâme 60).',
    ],
    keyPoints: ['Sabır aktif bir direniştir.', 'Tevekkül, tedbir + teslimiyettir.'],
    sources: [
      { kind: 'ayah', reference: 'Bakara 2:153' },
      { kind: 'hadith', reference: 'Tirmizî, Kıyâme 60' },
    ],
    quiz: [
      {
        question: '"Deveni bağla, sonra tevekkül et" hadisi neyi öğretir?',
        options: [
          'Tedbiri bırakmayı',
          'Tedbir alıp sonucu Allah\'a bırakmayı',
          'Sadece dua etmeyi',
          'Çalışmamayı',
        ],
        answerIndex: 1,
      },
    ],
    relatedAiQuestions: ['Tevekkül ne demektir?', 'Sabretmeyi nasıl öğrenirim?'],
    relatedVideoIds: ['v1'],
  },
  {
    id: 'ahlak-3',
    programId: 'ahlak',
    order: 3,
    title: 'Şükür ve kanaat',
    body: [
      'Şükür; nimeti görmek, Vereni bilmek ve nimeti O\'nun yolunda kullanmaktır. "Şükrederseniz elbette size nimetimi artırırım" (İbrahim 14:7).',
      'Kanaat, sahip olunanla yetinip gözü başkasının elindekinde tutmamaktır. Peygamberimiz, "Sizden aşağıdakine bakın; üstünüzdekine bakmayın" buyurur (Müslim, Zühd 9).',
    ],
    keyPoints: ['Şükür nimeti artırır.', 'Kanaat, kalp zenginliğidir.'],
    sources: [
      { kind: 'ayah', reference: 'İbrahim 14:7' },
      { kind: 'hadith', reference: 'Müslim, Zühd 9' },
    ],
    quiz: [
      {
        question: 'İbrahim 14:7\'ye göre şükrün karşılığı nedir?',
        options: ['Nimetin artması', 'Zorluk', 'Yalnızlık', 'Unutulmak'],
        answerIndex: 0,
      },
    ],
    relatedAiQuestions: ['Şükür nasıl edilir?'],
    relatedVideoIds: ['v7'],
  },
  {
    id: 'ahlak-4',
    programId: 'ahlak',
    order: 4,
    title: 'Dilin afetleri: Gıybet ve yalan',
    body: [
      'Gıybet, kardeşini arkasından hoşlanmayacağı şekilde anmaktır (Müslim, Birr 70). Kur\'an bunu ölü kardeşinin etini yemeye benzetir (Hucurât 49:12).',
      'Yalan, münafıklık alametlerindendir. Mümin; ya hayır söyler ya susar (Buhârî, Edeb 31). Dili korumak, kalbi korumaktır.',
    ],
    keyPoints: ['Gıybet büyük günahlardandır.', 'Ya hayır söyle ya sus.'],
    sources: [
      { kind: 'ayah', reference: 'Hucurât 49:12' },
      { kind: 'hadith', reference: 'Buhârî, Edeb 31' },
      { kind: 'hadith', reference: 'Müslim, Birr 70' },
    ],
    quiz: [
      {
        question: 'Söylenen söz doğruysa ama kişi hoşlanmazsa bu nedir?',
        options: ['İftira', 'Gıybet', 'Nasihat', 'Şaka'],
        answerIndex: 1,
      },
    ],
    relatedAiQuestions: ['Gıybet günah mıdır?'],
    relatedVideoIds: ['v12'],
  },

  // ——— Günlük Dualar ———
  {
    id: 'dualar-1',
    programId: 'dualar',
    order: 1,
    title: 'Dua nedir, nasıl edilir?',
    body: [
      'Dua, kulun Rabbine yönelmesi ve ihtiyacını yalnız O\'na arz etmesidir: "Bana dua edin, size icabet edeyim" (Mü\'min 40:60). Peygamberimiz duayı "ibadetin özü" olarak nitelendirmiştir.',
      'Dua ederken hamd ve salavatla başlamak, ısrarcı olmak ve helal lokmaya dikkat etmek kabulün edeplerindendir.',
    ],
    keyPoints: ['Dua ibadetin özüdür.', 'Hamd ve salavatla başlanır.'],
    sources: [
      { kind: 'ayah', reference: 'Mü\'min 40:60' },
      { kind: 'hadith', reference: 'Tirmizî, Deavât 1' },
    ],
    quiz: [
      {
        question: 'Mü\'min 40:60\'ta Allah ne vaad eder?',
        options: ['Duaya icabet', 'Zenginlik', 'Uzun ömür', 'Şöhret'],
        answerIndex: 0,
      },
    ],
    relatedAiQuestions: ['Duanın kabul olması için ne yapmalıyım?'],
    relatedVideoIds: ['v11'],
  },
  {
    id: 'dualar-2',
    programId: 'dualar',
    order: 2,
    title: 'Güne dua ile başlamak ve bitirmek',
    body: [
      'Sabah kalkınca "Bizi öldürdükten sonra dirilten Allah\'a hamd olsun" (Buhârî, Deavât 8) duası okunur. Yatarken Âyete\'l-Kürsî ve Muavvizeteyn (Felak-Nâs) okumak sünnettir.',
      'Uygulamanın Dualar bölümünde sabah, akşam ve uyku duaları Arapça metin, okunuş ve anlamıyla yer alır.',
    ],
    keyPoints: ['Güne hamd ile başlanır.', 'Uyumadan önce Felak-Nâs okunur.'],
    sources: [
      { kind: 'hadith', reference: 'Buhârî, Deavât 8' },
      { kind: 'hadith', reference: 'Buhârî, Fezâilü\'l-Kur\'ân 14' },
    ],
    quiz: [
      {
        question: 'Uyumadan önce okunması sünnet olan surelerden ikisi hangileridir?',
        options: ['Fâtiha-Bakara', 'Felak-Nâs', 'Yâsîn-Mülk', 'Kevser-Asr'],
        answerIndex: 1,
      },
    ],
    relatedAiQuestions: ['Sabah duaları nelerdir?'],
    relatedVideoIds: ['v11'],
  },

  // ——— Gençler İçin Temel Bilgiler ———
  {
    id: 'gencler-1',
    programId: 'gencler',
    order: 1,
    title: 'Dijital çağda Müslüman genç olmak',
    body: [
      'Sosyal medya çağında dikkatimiz en değerli sermayemizdir. Kalpler ancak Allah\'ı anmakla huzur bulur (Ra\'d 13:28); ekran süresi bilinçli yönetilmelidir.',
      'Çevrimiçi ortamda da ahlak geçerlidir: gıybet, iftira ve alay çevrimiçi yapıldığında da günahtır. Paylaşmadan önce "doğru mu, faydalı mı, kırıcı mı?" diye sorun.',
    ],
    keyPoints: ['Dikkatinizi bilinçli yönetin.', 'Çevrimiçi ahlak da ahlaktır.'],
    sources: [
      { kind: 'ayah', reference: 'Ra\'d 13:28' },
      { kind: 'ayah', reference: 'Hucurât 49:12' },
    ],
    quiz: [
      {
        question: 'Ra\'d 13:28\'e göre kalpler neyle huzur bulur?',
        options: ['Eğlenceyle', 'Allah\'ı anmakla', 'Alışverişle', 'Yolculukla'],
        answerIndex: 1,
      },
    ],
    relatedAiQuestions: ['Sosyal medya kullanımında nelere dikkat etmeliyim?'],
    relatedVideoIds: ['v6'],
  },
  {
    id: 'gencler-2',
    programId: 'gencler',
    order: 2,
    title: 'Arkadaşlık ve çevre seçimi',
    body: [
      'Peygamberimiz, "Kişi arkadaşının dini üzeredir; her biriniz kiminle arkadaşlık ettiğine baksın" buyurur (Ebû Dâvûd, Edeb 16). İyi arkadaş, güzel koku satıcısı gibidir (Buhârî, Büyû\' 38).',
      'Sizi iyiliğe çağıran, hatanızda uyaran ve başarınıza sevinen arkadaşlıklar kurun.',
    ],
    keyPoints: ['Arkadaş, karakteri etkiler.', 'İyi arkadaş misk satıcısı gibidir.'],
    sources: [
      { kind: 'hadith', reference: 'Ebû Dâvûd, Edeb 16' },
      { kind: 'hadith', reference: 'Buhârî, Büyû\' 38' },
    ],
    quiz: [
      {
        question: 'Hadiste iyi arkadaş neye benzetilir?',
        options: ['Demirciye', 'Güzel koku satıcısına', 'Çobana', 'Tüccara'],
        answerIndex: 1,
      },
    ],
    relatedAiQuestions: ['İyi arkadaş nasıl seçilir?'],
    relatedVideoIds: ['v6'],
  },

  // ——— Ramazan'a Hazırlık ———
  {
    id: 'ramazan-1',
    programId: 'ramazan',
    order: 1,
    title: 'Oruç: Anlamı ve hükümleri',
    body: [
      'Oruç, imsaktan iftara kadar yeme, içme ve orucu bozan şeylerden uzak durmaktır; amacı takvaya ulaşmaktır (Bakara 2:183).',
      'Hastalar, yolcular, hamile ve emziren kadınlar için kolaylık hükümleri vardır (Bakara 2:184-185); tutulamayan günler sonra kaza edilir. Kişisel sağlık durumları için mutlaka hekime ve müftülüğe danışılmalıdır.',
    ],
    keyPoints: ['Orucun amacı takvadır.', 'Mazeret sahiplerine kolaylık vardır.'],
    sources: [{ kind: 'ayah', reference: 'Bakara 2:183-185' }],
    quiz: [
      {
        question: 'Bakara 183\'e göre orucun amacı nedir?',
        options: ['Diyet', 'Takva', 'Gelenek', 'Spor'],
        answerIndex: 1,
      },
    ],
    relatedAiQuestions: ['Orucu bozan şeyler nelerdir?', 'Hastayken oruç tutmalı mıyım?'],
    relatedVideoIds: ['v8'],
  },
  {
    id: 'ramazan-2',
    programId: 'ramazan',
    order: 2,
    title: 'Ramazan\'ı verimli geçirmek',
    body: [
      'Ramazan; oruç, Kur\'an, infak ve teravih ayıdır. Peygamberimiz Ramazan\'da Kur\'an\'ı Cebrail ile mukabele ederdi (Buhârî, Savm 7).',
      'Gerçekçi bir plan yapın: günlük Kur\'an hedefi, bir hatim planı, düzenli sadaka. Uygulamanın Ramazan modu imsakiye, sayaçlar ve hatim takibiyle yardımcı olur.',
    ],
    keyPoints: ['Ramazan Kur\'an ayıdır.', 'Gerçekçi hedefler koyun.'],
    sources: [
      { kind: 'hadith', reference: 'Buhârî, Savm 7' },
      { kind: 'ayah', reference: 'Bakara 2:185' },
    ],
    quiz: [
      {
        question: 'Kur\'an hangi ayda indirilmeye başlanmıştır?',
        options: ['Şaban', 'Ramazan', 'Muharrem', 'Recep'],
        answerIndex: 1,
      },
    ],
    relatedAiQuestions: ['Ramazan\'da hatim nasıl yapılır?'],
    relatedVideoIds: ['v8'],
  },

  // ——— Hac ve Umre'ye Giriş ———
  {
    id: 'hac-1',
    programId: 'hac',
    order: 1,
    title: 'Hac ve umre nedir?',
    body: [
      'Hac; gücü yeten Müslümanın ömründe bir kez, hac aylarında Kâbe\'yi ve mukaddes mekânları usulünce ziyaret etmesidir (Âl-i İmrân 3:97). Umre ise yılın her zamanı yapılabilen nafile ziyarettir.',
      'Haccın farzları: ihram, Arafat vakfesi ve ziyaret tavafı. Kabul olmuş haccın karşılığı cennettir (Buhârî, Umre 1).',
    ],
    keyPoints: ['Hac, gücü yetene farzdır.', 'Umre her zaman yapılabilir.'],
    sources: [
      { kind: 'ayah', reference: 'Âl-i İmrân 3:97' },
      { kind: 'hadith', reference: 'Buhârî, Umre 1' },
    ],
    quiz: [
      {
        question: 'Haccın farzlarından biri değildir?',
        options: ['İhram', 'Arafat vakfesi', 'Ziyaret tavafı', 'Kurban kesmek'],
        answerIndex: 3,
      },
    ],
    relatedAiQuestions: ['Hac kimlere farzdır?'],
    relatedVideoIds: ['v5'],
  },
];

export const PROGRAMS: Program[] = [
  { id: 'islam', title: 'İslam\'a Başlangıç', description: 'Temel inanç esasları ve İslam\'ın şartları', icon: 'compass-outline', lessonIds: ['islam-1', 'islam-2', 'islam-3'] },
  { id: 'namaz', title: 'Namazı Öğreniyorum', description: 'Abdestten selama, adım adım namaz', icon: 'time-outline', lessonIds: ['namaz-1', 'namaz-2', 'namaz-3'] },
  { id: 'kuran', title: 'Kur\'an Okumaya Başlangıç', description: 'Harflerden anlayarak okumaya yol haritası', icon: 'book-outline', lessonIds: ['kuran-1', 'kuran-2', 'kuran-3'] },
  { id: 'siyer', title: 'Peygamberimizin Hayatı', description: 'Doğumundan Veda Hutbesi\'ne siyer', icon: 'footsteps-outline', lessonIds: ['siyer-1', 'siyer-2', 'siyer-3', 'siyer-4'] },
  { id: 'ahlak', title: 'Güzel Ahlak', description: 'Sabır, şükür ve dilin edebi', icon: 'heart-outline', lessonIds: ['ahlak-1', 'ahlak-2', 'ahlak-3', 'ahlak-4'] },
  { id: 'dualar', title: 'Günlük Dualar', description: 'Güne dua ile başlamak ve bitirmek', icon: 'hand-left-outline', lessonIds: ['dualar-1', 'dualar-2'] },
  { id: 'gencler', title: 'Gençler İçin Temel Bilgiler', description: 'Dijital çağda genç Müslüman olmak', icon: 'flash-outline', lessonIds: ['gencler-1', 'gencler-2'] },
  { id: 'ramazan', title: 'Ramazan\'a Hazırlık', description: 'Orucun hükümleri ve verimli Ramazan', icon: 'moon-outline', lessonIds: ['ramazan-1', 'ramazan-2'] },
  { id: 'hac', title: 'Hac ve Umre\'ye Giriş', description: 'Mukaddes yolculuğun temelleri', icon: 'globe-outline', lessonIds: ['hac-1'] },
];

export function getProgram(id: string): Program | undefined {
  return PROGRAMS.find((p) => p.id === id);
}

export function getLesson(id: string): Lesson | undefined {
  return LESSONS.find((l) => l.id === id);
}

export function getProgramLessons(programId: string): Lesson[] {
  return LESSONS.filter((l) => l.programId === programId).sort((a, b) => a.order - b.order);
}
