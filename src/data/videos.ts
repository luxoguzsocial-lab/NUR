/**
 * Demo video akışı verisi. Konuşmacılar ve videolar KURGUSALDIR ("Demo içerik"
 * etiketiyle gösterilir); referans verilen ayet ve hadis kaynakları gerçektir.
 * `media` alanı olan videolar AI ile üretilmiş gerçek klip oynatır (görüntü:
 * Kling, ses: Edge TTS, altyazı gömülü — bkz. tools/build-video.mjs);
 * olmayanlar altyazılı demo yüzeyini kullanır (bkz. src/app/feed.tsx).
 */

export type VideoCategory =
  | 'akaid'
  | 'ibadet'
  | 'siyer'
  | 'ahlak'
  | 'gencler'
  | 'ramazan'
  | 'kuran';

export type AgeGroup = 'genel' | 'genc' | 'cocuk';

export interface VideoSource {
  kind: 'ayah' | 'hadith' | 'book';
  reference: string;
  /** Kaynak metni / kısa alıntı (detay ekranında gösterilir) */
  text: string;
  verified: boolean;
}

export interface Creator {
  id: string;
  name: string;
  title: string;
  verified: boolean;
}

export interface VideoItem {
  id: string;
  title: string;
  description: string;
  creator: Creator;
  category: VideoCategory;
  durationSec: number;
  ageGroup: AgeGroup;
  kidFriendly: boolean;
  sources: VideoSource[];
  relatedVideoIds: string[];
  relatedLessonIds: string[];
  /** Demo altyazı/anlatım satırları */
  subtitles: string[];
  moderationStatus: 'approved';
  /** Gradyan placeholder için renk tonu (0-360) */
  thumbnailHue: number;
  /**
   * Gerçek video dosyası (bundled asset require() sonucu veya { uri }).
   * Yoksa oynatıcı, altyazılı demo yüzeyini gösterir.
   */
  media?: number | { uri: string };
}

export const CREATORS: Creator[] = [
  { id: 'c1', name: 'Dr. Ahmet Yılmaz', title: 'İlahiyatçı (kurgusal demo profil)', verified: true },
  { id: 'c2', name: 'Zeynep Kaya', title: 'Kur\'an eğitmeni (kurgusal demo profil)', verified: true },
  { id: 'c3', name: 'Mehmet Demir', title: 'Din kültürü öğretmeni (kurgusal demo profil)', verified: false },
  { id: 'c4', name: 'Dr. Fatma Arslan', title: 'Siyer araştırmacısı (kurgusal demo profil)', verified: true },
  { id: 'c5', name: 'Yusuf Çelik', title: 'Gençlik eğitmeni (kurgusal demo profil)', verified: false },
];

const creator = (id: string): Creator => CREATORS.find((c) => c.id === id)!;

export const VIDEOS: VideoItem[] = [
  {
    id: 'v1',
    title: 'Sabır nedir, nasıl sabredilir?',
    description: 'Kur\'an ve sünnet ışığında sabrın anlamı ve günlük hayatta sabırlı kalmanın yolları. (Görüntü: yapay zekâ ile üretilmiş örnek çekim)',
    media: require('../../assets/videos/v1.mp4') as number,
    creator: creator('c1'),
    category: 'ahlak',
    durationSec: 95,
    ageGroup: 'genel',
    kidFriendly: true,
    sources: [
      { kind: 'ayah', reference: 'Bakara 2:153', text: 'Ey iman edenler! Sabır ve namazla yardım isteyin. Şüphesiz Allah sabredenlerle beraberdir.', verified: true },
      { kind: 'hadith', reference: 'Müslim, Zühd 64', text: 'Müminin işi hayret vericidir; her hâli onun için hayırlıdır... Başına bir sıkıntı gelirse sabreder, bu da onun için hayır olur.', verified: true },
    ],
    relatedVideoIds: ['v2', 'v7'],
    relatedLessonIds: ['ahlak-2'],
    subtitles: [
      'Sabır, zorluk karşısında Allah\'a güvenerek dik durmaktır.',
      'Bakara suresi 153. ayet, sabır ve namazı birlikte anar.',
      'Sabır pasif bekleyiş değil, aktif bir direniştir.',
      'Peygamberimiz, müminin her hâlinin hayır olduğunu söyler.',
      'Bugün küçük bir zorlukta sabrı deneyin: öfkelenmeden önce durun.',
    ],
    moderationStatus: 'approved',
    thumbnailHue: 160,
  },
  {
    id: 'v2',
    title: 'Namazın hayatımızdaki yeri',
    description: 'Beş vakit namazın manevi ve pratik faydaları üzerine kısa bir sohbet.',
    media: require('../../assets/videos/v2.mp4') as number,
    creator: creator('c1'),
    category: 'ibadet',
    durationSec: 120,
    ageGroup: 'genel',
    kidFriendly: true,
    sources: [
      { kind: 'ayah', reference: 'Ankebût 29:45', text: 'Muhakkak ki namaz, hayâsızlıktan ve kötülükten alıkoyar.', verified: true },
      { kind: 'hadith', reference: 'Buhârî, Mevâkît 6', text: 'Beş vakit namaz, aralarındaki günahlara kefarettir...', verified: true },
    ],
    relatedVideoIds: ['v1', 'v3'],
    relatedLessonIds: ['namaz-1'],
    subtitles: [
      'Namaz, günde beş kez Rabbimizle buluşma vaktidir.',
      'Ankebût suresi, namazın kötülükten alıkoyduğunu bildirir.',
      'Namaz vakitleri güne manevi bir ritim kazandırır.',
      'Bir vakti kaçırdıysanız ümitsizliğe kapılmayın; kaza edin ve devam edin.',
    ],
    moderationStatus: 'approved',
    thumbnailHue: 200,
  },
  {
    id: 'v3',
    title: 'Abdest nasıl alınır?',
    description: 'Adım adım abdest: farzları, sünnetleri ve sık yapılan hatalar.',
    media: require('../../assets/videos/v3.mp4') as number,
    creator: creator('c2'),
    category: 'ibadet',
    durationSec: 150,
    ageGroup: 'genel',
    kidFriendly: true,
    sources: [
      { kind: 'ayah', reference: 'Mâide 5:6', text: 'Ey iman edenler! Namaza kalktığınızda yüzlerinizi ve dirseklere kadar ellerinizi yıkayın; başınızı mesh edin ve topuklara kadar ayaklarınızı yıkayın.', verified: true },
    ],
    relatedVideoIds: ['v2'],
    relatedLessonIds: ['namaz-2'],
    subtitles: [
      'Abdestin farzları Mâide suresi 6. ayette sayılır.',
      'Önce eller yıkanır, ağız ve buruna su verilir.',
      'Yüz, kollar yıkanır; baş mesh edilir; ayaklar yıkanır.',
      'Uzuvları üçer kez yıkamak sünnettir.',
      'Abdest hem temizlik hem manevi hazırlıktır.',
    ],
    moderationStatus: 'approved',
    thumbnailHue: 190,
  },
  {
    id: 'v4',
    title: 'Peygamberimizin bir günü',
    description: 'Hz. Muhammed\'in (s.a.v.) günlük yaşamından kesitler: ibadet, aile ve komşuluk.',
    media: require('../../assets/videos/v4.mp4') as number,
    creator: creator('c4'),
    category: 'siyer',
    durationSec: 180,
    ageGroup: 'genel',
    kidFriendly: true,
    sources: [
      { kind: 'hadith', reference: 'Buhârî, Edeb 27', text: 'İnsanlara merhamet etmeyene Allah da merhamet etmez.', verified: true },
      { kind: 'book', reference: 'İbn Hişâm, es-Sîretü\'n-Nebeviyye', text: 'Klasik siyer kaynağı.', verified: true },
    ],
    relatedVideoIds: ['v5'],
    relatedLessonIds: ['siyer-1'],
    subtitles: [
      'Efendimizin günü gece ibadetiyle başlardı.',
      'Ailesine ev işlerinde yardım ederdi.',
      'Komşularının hâlini sorar, hastaları ziyaret ederdi.',
      'Gülümsemeyi sadaka sayardı.',
    ],
    moderationStatus: 'approved',
    thumbnailHue: 40,
  },
  {
    id: 'v5',
    title: 'Veda Hutbesi\'nin evrensel mesajları',
    description: 'İnsan hakları, kardeşlik ve emanet bilinci: Veda Hutbesi\'nden bugüne dersler.',
    media: require('../../assets/videos/v5.mp4') as number,
    creator: creator('c4'),
    category: 'siyer',
    durationSec: 160,
    ageGroup: 'genel',
    kidFriendly: false,
    sources: [
      { kind: 'hadith', reference: 'Müslim, Hac 147', text: 'Veda Haccı hutbesinin rivayeti: canlar, mallar ve ırzlar dokunulmazdır...', verified: true },
    ],
    relatedVideoIds: ['v4'],
    relatedLessonIds: ['siyer-4'],
    subtitles: [
      'Veda Hutbesi, yüz binin üzerinde sahabiye okundu.',
      'Can, mal ve namus dokunulmazlığı vurgulandı.',
      'Üstünlük ancak takva iledir buyruldu.',
      'Kadın hakları özellikle emanet olarak anıldı.',
    ],
    moderationStatus: 'approved',
    thumbnailHue: 30,
  },
  {
    id: 'v6',
    title: 'Gençler soruyor: İnancımı nasıl korurum?',
    description: 'Sosyal medya çağında imanı taze tutmanın pratik yolları.',
    media: require('../../assets/videos/v6.mp4') as number,
    creator: creator('c5'),
    category: 'gencler',
    durationSec: 140,
    ageGroup: 'genc',
    kidFriendly: false,
    sources: [
      { kind: 'ayah', reference: 'Ra\'d 13:28', text: 'Bilesiniz ki kalpler ancak Allah\'ı anmakla huzur bulur.', verified: true },
      { kind: 'hadith', reference: 'Tirmizî, Deavât 4', text: 'Allah\'ı zikretmek kalplerin cilasıdır (rivayet).', verified: false },
    ],
    relatedVideoIds: ['v1', 'v7'],
    relatedLessonIds: ['gencler-1'],
    subtitles: [
      'İman, beslenmeyen bir fidan gibi kurur; onu zikirle sulayın.',
      'Ra\'d suresi 28: kalpler ancak Allah\'ı anmakla huzur bulur.',
      'Sosyal medyada geçirdiğiniz süreyi bilinçli seçin.',
      'Sizi iyiliğe çağıran arkadaşlıklar kurun.',
    ],
    moderationStatus: 'approved',
    thumbnailHue: 260,
  },
  {
    id: 'v7',
    title: 'Şükür: Az şeyle zengin olmak',
    description: 'Şükrün psikolojik ve manevi gücü; günlük şükür alışkanlığı kurma.',
    media: require('../../assets/videos/v7.mp4') as number,
    creator: creator('c3'),
    category: 'ahlak',
    durationSec: 110,
    ageGroup: 'genel',
    kidFriendly: true,
    sources: [
      { kind: 'ayah', reference: 'İbrahim 14:7', text: 'Andolsun, eğer şükrederseniz elbette size nimetimi artırırım.', verified: true },
      { kind: 'hadith', reference: 'Müslim, Zühd 64', text: 'Müminin işi hayret vericidir; nimete kavuşursa şükreder, bu onun için hayır olur.', verified: true },
    ],
    relatedVideoIds: ['v1'],
    relatedLessonIds: ['ahlak-3'],
    subtitles: [
      'Şükür, sahip olduklarımızı fark etme sanatıdır.',
      'İbrahim suresi 7: şükredene nimet artırılır.',
      'Her akşam üç nimeti yazmayı deneyin.',
      'Şükür dille, kalple ve amelle olur.',
    ],
    moderationStatus: 'approved',
    thumbnailHue: 90,
  },
  {
    id: 'v8',
    title: 'Ramazan\'a nasıl hazırlanırım?',
    description: 'Ramazan öncesi manevi ve pratik hazırlık: niyet, plan ve alışkanlıklar.',
    media: require('../../assets/videos/v8.mp4') as number,
    creator: creator('c2'),
    category: 'ramazan',
    durationSec: 130,
    ageGroup: 'genel',
    kidFriendly: true,
    sources: [
      { kind: 'ayah', reference: 'Bakara 2:183', text: 'Ey iman edenler! Sizden öncekilere farz kılındığı gibi oruç size de farz kılındı; umulur ki korunursunuz.', verified: true },
      { kind: 'hadith', reference: 'Buhârî, Savm 6', text: 'Kim inanarak ve sevabını Allah\'tan bekleyerek Ramazan orucunu tutarsa geçmiş günahları bağışlanır.', verified: true },
    ],
    relatedVideoIds: ['v2'],
    relatedLessonIds: ['ramazan-1'],
    subtitles: [
      'Ramazan bir ay değil, bir okuldur.',
      'Bakara 183: orucun amacı takvaya ulaşmaktır.',
      'Şaban ayında ara ara oruç tutarak hazırlanabilirsiniz.',
      'Kur\'an okuma ve infak planınızı önceden yapın.',
    ],
    moderationStatus: 'approved',
    thumbnailHue: 280,
  },
  {
    id: 'v9',
    title: 'Kur\'an okumaya nereden başlamalı?',
    description: 'Harflerden tecvide: yeni başlayanlar için yol haritası ve motivasyon.',
    media: require('../../assets/videos/v9.mp4') as number,
    creator: creator('c2'),
    category: 'kuran',
    durationSec: 125,
    ageGroup: 'genel',
    kidFriendly: true,
    sources: [
      { kind: 'hadith', reference: 'Buhârî, Fezâilü\'l-Kur\'ân 21', text: 'Sizin en hayırlınız, Kur\'an\'ı öğrenen ve öğretendir.', verified: true },
      { kind: 'ayah', reference: 'Müzzemmil 73:4', text: 'Kur\'an\'ı tane tane, düşünerek oku.', verified: true },
    ],
    relatedVideoIds: ['v3'],
    relatedLessonIds: ['kuran-1'],
    subtitles: [
      'Kur\'an öğrenmeye başlamak için geç kalmış değilsiniz.',
      'Önce harfleri, sonra harekeleri öğrenin.',
      'Günde on dakika düzenli çalışma, uzun seanslardan iyidir.',
      'Uygulamadaki ezber modu tekrar için tasarlandı.',
    ],
    moderationStatus: 'approved',
    thumbnailHue: 150,
  },
  {
    id: 'v10',
    title: 'Allah\'ın isimlerini tanımak: er-Rahmân',
    description: 'Esmaül Hüsna serisinin ilk bölümü: Rahmet sıfatının hayatımıza yansıması.',
    media: require('../../assets/videos/v10.mp4') as number,
    creator: creator('c1'),
    category: 'akaid',
    durationSec: 100,
    ageGroup: 'genel',
    kidFriendly: true,
    sources: [
      { kind: 'ayah', reference: 'Fâtiha 1:3', text: 'O, Rahmân\'dır, Rahîm\'dir.', verified: true },
      { kind: 'hadith', reference: 'Buhârî, Deavât 68', text: 'Allah\'ın doksan dokuz ismi vardır; kim onları sayarsa (ezberleyip gereğiyle amel ederse) cennete girer.', verified: true },
    ],
    relatedVideoIds: ['v7'],
    relatedLessonIds: [],
    subtitles: [
      'er-Rahmân: rahmeti bütün yaratılmışları kuşatan.',
      'Fâtiha\'da her gün kırk kez bu ismi anarız.',
      'Rahmet, güçlünün şefkatli olmasıdır.',
      'Bugün bir canlıya karşılıksız iyilik yapın.',
    ],
    moderationStatus: 'approved',
    thumbnailHue: 120,
  },
  {
    id: 'v11',
    title: 'Çocuklara: Besmele ile başlarım!',
    description: 'Minikler için besmelenin anlamı — eğlenceli ve kısa anlatım.',
    media: require('../../assets/videos/v11.mp4') as number,
    creator: creator('c3'),
    category: 'gencler',
    durationSec: 60,
    ageGroup: 'cocuk',
    kidFriendly: true,
    sources: [
      { kind: 'hadith', reference: 'Ebû Dâvûd, Edeb 20', text: 'Besmele ile başlanmayan her önemli iş bereketsizdir (rivayet).', verified: false },
    ],
    relatedVideoIds: ['v9'],
    relatedLessonIds: [],
    subtitles: [
      'Besmele: Bismillâhirrahmânirrahîm!',
      'Yemeğe başlarken besmele çekeriz.',
      'Besmele, "Allah\'ım seninle başlıyorum" demektir.',
      'Sen de bugün işlerine besmeleyle başla!',
    ],
    moderationStatus: 'approved',
    thumbnailHue: 35,
  },
  {
    id: 'v12',
    title: 'Gıybet: Dilin ağır imtihanı',
    description: 'Gıybetin tanımı, zararları ve dilini korumanın pratik yolları.',
    media: require('../../assets/videos/v12.mp4') as number,
    creator: creator('c1'),
    category: 'ahlak',
    durationSec: 115,
    ageGroup: 'genel',
    kidFriendly: false,
    sources: [
      { kind: 'ayah', reference: 'Hucurât 49:12', text: 'Biriniz diğerinizi arkasından çekiştirmesin. Biriniz, ölmüş kardeşinin etini yemekten hoşlanır mı?', verified: true },
      { kind: 'hadith', reference: 'Müslim, Birr 70', text: 'Gıybet, kardeşini hoşlanmayacağı bir şeyle anmandır.', verified: true },
    ],
    relatedVideoIds: ['v1', 'v7'],
    relatedLessonIds: ['ahlak-4'],
    subtitles: [
      'Gıybet, kişinin arkasından hoşlanmayacağı şekilde konuşmaktır.',
      'Hucurât 12, gıybeti ağır bir benzetmeyle yasaklar.',
      'Söz doğru olsa bile gıybet olabilir; yalansa iftiradır.',
      'Bir mecliste gıybet başlarsa konuyu değiştirin veya ayrılın.',
    ],
    moderationStatus: 'approved',
    thumbnailHue: 0,
  },
  {
    id: 'v13',
    title: 'İstiğfar: Yeni bir sayfa açmak',
    description: 'Tevbe ve istiğfarın gücü; her gün temiz bir başlangıç yapmak.',
    media: require('../../assets/videos/v13.mp4') as number,
    creator: creator('c1'),
    category: 'ibadet',
    durationSec: 105,
    ageGroup: 'genel',
    kidFriendly: true,
    sources: [
      { kind: 'ayah', reference: 'Nûh 71:10', text: 'Rabbinizden bağışlanma dileyin; çünkü O çok bağışlayıcıdır.', verified: true },
      { kind: 'hadith', reference: 'Müslim, Zikir 41', text: 'Ben günde yüz defa Allah\'a istiğfar ederim.', verified: true },
    ],
    relatedVideoIds: ['v1'],
    relatedLessonIds: [],
    subtitles: [
      'İstiğfar, geçmişi silip yeni bir sayfa açmaktır.',
      'Nûh suresi 10: Rabbinizden bağışlanma dileyin; O çok bağışlayıcıdır.',
      'Peygamberimiz günde yüz kez istiğfar ederdi.',
      'Yatmadan önce üç kez estağfirullah demeyi alışkanlık edinin.',
    ],
    moderationStatus: 'approved',
    thumbnailHue: 45,
  },
  {
    id: 'v14',
    title: 'Anne babaya iyilik: En yakın kapı',
    description: 'İslam\'da anne baba hakkı ve onlara güzel davranmanın yolları.',
    media: require('../../assets/videos/v14.mp4') as number,
    creator: creator('c3'),
    category: 'ahlak',
    durationSec: 110,
    ageGroup: 'genel',
    kidFriendly: true,
    sources: [
      { kind: 'ayah', reference: 'İsrâ 17:23', text: 'Rabbin, yalnız kendisine kulluk etmenizi ve anne babaya iyilik etmenizi emretti; onlara "öf" bile deme.', verified: true },
      { kind: 'hadith', reference: 'Tirmizî, Birr 3', text: 'Rabbin rızası, anne babanın rızasındadır.', verified: true },
    ],
    relatedVideoIds: ['v4'],
    relatedLessonIds: [],
    subtitles: [
      'Anne babaya iyilik, Kur\'an\'da kulluğun hemen yanında anılır.',
      'İsrâ 23: onlara "öf" bile demeyin.',
      'Rabbin rızası, anne babanın rızasındadır.',
      'Bugün onları arayın; kısa bir telefon bile gönül alır.',
    ],
    moderationStatus: 'approved',
    thumbnailHue: 25,
  },
  {
    id: 'v15',
    title: 'Sadaka: Bereketin anahtarı',
    description: 'İnfak ve sadakanın hem verene hem alana kazandırdıkları.',
    media: require('../../assets/videos/v15.mp4') as number,
    creator: creator('c1'),
    category: 'ahlak',
    durationSec: 108,
    ageGroup: 'genel',
    kidFriendly: true,
    sources: [
      { kind: 'ayah', reference: 'Bakara 2:261', text: 'Mallarını Allah yolunda harcayanların durumu, yedi başak bitiren ve her başağında yüz tane bulunan bir tohum gibidir.', verified: true },
      { kind: 'hadith', reference: 'Müslim, Birr 69', text: 'Sadaka, maldan hiçbir şey eksiltmez.', verified: true },
    ],
    relatedVideoIds: ['v7'],
    relatedLessonIds: [],
    subtitles: [
      'Sadaka malı eksiltmez; bereketlendirir.',
      'Bakara 261: bir tohum, yedi başak, her başakta yüz tane.',
      'Küçük ama düzenli vermek, büyük ama tek seferden hayırlıdır.',
      'Bu hafta bir ihtiyaç sahibine küçük bir iyilik planlayın.',
    ],
    moderationStatus: 'approved',
    thumbnailHue: 70,
  },
  {
    id: 'v16',
    title: 'Tevekkül: Kuşlar gibi güvenmek',
    description: 'Tedbir alıp sonucu Allah\'a bırakmak; kaygıyla başa çıkmanın imani yolu.',
    media: require('../../assets/videos/v16.mp4') as number,
    creator: creator('c5'),
    category: 'akaid',
    durationSec: 112,
    ageGroup: 'genel',
    kidFriendly: true,
    sources: [
      { kind: 'ayah', reference: 'Talâk 65:3', text: 'Kim Allah\'a tevekkül ederse, O ona yeter.', verified: true },
      { kind: 'hadith', reference: 'Tirmizî, Zühd 33', text: 'Allah\'a hakkıyla tevekkül etseydiniz, kuşları rızıklandırdığı gibi sizi de rızıklandırırdı; onlar sabah aç çıkar, akşam tok döner.', verified: true },
    ],
    relatedVideoIds: ['v1'],
    relatedLessonIds: [],
    subtitles: [
      'Tevekkül, tembellik değil; elinden geleni yapıp gerisini bırakmaktır.',
      'Talâk 3: Kim Allah\'a tevekkül ederse, O ona yeter.',
      'Kuşlar sabah aç çıkar, akşam tok döner.',
      'Kaygılandığınızda önce tedbirinizi alın, sonra kalbinizi teslim edin.',
    ],
    moderationStatus: 'approved',
    thumbnailHue: 200,
  },
  {
    id: 'v17',
    title: 'Selamı yaymak: Kardeşliğin ilk adımı',
    description: 'Selamlaşmanın değeri ve toplumsal bağları güçlendiren gücü.',
    media: require('../../assets/videos/v17.mp4') as number,
    creator: creator('c5'),
    category: 'gencler',
    durationSec: 100,
    ageGroup: 'genel',
    kidFriendly: true,
    sources: [
      { kind: 'ayah', reference: 'Nisâ 4:86', text: 'Size bir selam verildiğinde, ondan daha güzeliyle veya aynıyla karşılık verin.', verified: true },
      { kind: 'hadith', reference: 'Müslim, Îmân 93', text: 'İman etmedikçe cennete giremezsiniz; birbirinizi sevmedikçe iman etmiş olmazsınız. Aranızda selamı yayın.', verified: true },
    ],
    relatedVideoIds: ['v6'],
    relatedLessonIds: [],
    subtitles: [
      'Selam, iki kalp arasındaki en kısa köprüdür.',
      'Nisâ 86: selama daha güzeliyle karşılık verin.',
      'Selamı yaymak, sevginin ve imanın alametidir.',
      'Bugün tanımadığınız bir komşuya önce siz selam verin.',
    ],
    moderationStatus: 'approved',
    thumbnailHue: 330,
  },
  {
    id: 'v18',
    title: 'Gece namazı: Sessizliğin bereketi',
    description: 'Teheccüdün fazileti ve gece ibadetine alışmanın pratik adımları.',
    media: require('../../assets/videos/v18.mp4') as number,
    creator: creator('c2'),
    category: 'ibadet',
    durationSec: 115,
    ageGroup: 'genel',
    kidFriendly: false,
    sources: [
      { kind: 'ayah', reference: 'Müzzemmil 73:6', text: 'Gece kalkışı, etki bakımından daha kuvvetli, okuyuş bakımından daha sağlamdır.', verified: true },
      { kind: 'hadith', reference: 'Müslim, Sıyâm 203', text: 'Farz namazlardan sonra en faziletli namaz, gece namazıdır.', verified: true },
    ],
    relatedVideoIds: ['v2'],
    relatedLessonIds: [],
    subtitles: [
      'Gece, dünyanın sustuğu ve kalbin konuştuğu vakittir.',
      'Müzzemmil 6: gece kalkışı daha etkili, okuyuşu daha sağlamdır.',
      'Farzlardan sonra en faziletli namaz gece namazıdır.',
      'Önce haftada bir gece, iki rekâtla başlayın.',
    ],
    moderationStatus: 'approved',
    thumbnailHue: 240,
  },
];

export function getVideo(id: string): VideoItem | undefined {
  return VIDEOS.find((v) => v.id === id);
}

export const VIDEO_CATEGORIES: { id: VideoCategory; labelTr: string }[] = [
  { id: 'akaid', labelTr: 'İnanç' },
  { id: 'ibadet', labelTr: 'İbadet' },
  { id: 'siyer', labelTr: 'Siyer' },
  { id: 'ahlak', labelTr: 'Ahlak' },
  { id: 'gencler', labelTr: 'Gençler & Çocuklar' },
  { id: 'ramazan', labelTr: 'Ramazan' },
  { id: 'kuran', labelTr: "Kur'an" },
];
