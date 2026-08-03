/**
 * Demo RAG cevap havuzu (P0-SPEC #14-15). Cevaplar önceden hazırlanmış,
 * kaynaklı örneklerdir ve arayüzde "Demo içerik" etiketiyle gösterilir.
 * Eşleşme bulunamazsa asistan KAYNAKSIZ CEVAP ÜRETMEZ (null döner).
 */

import type { AiSource } from '@/store/media';

export interface DemoAnswer {
  id: string;
  keywords: string[];
  question: string;
  shortAnswer: string;
  detailedAnswer: string;
  sources: AiSource[];
  confidence: 'high' | 'medium' | 'low';
  differences?: string;
  referToScholar?: boolean;
  relatedTopics: string[];
  relatedLessonIds: string[];
  relatedVideoIds: string[];
}

export const DEMO_ANSWERS: DemoAnswer[] = [
  {
    id: 'a-namaz-vakit',
    keywords: ['namaz vakti', 'namaz vakitleri', 'vakitler', 'ezan saati'],
    question: 'Namaz vakitleri nasıl belirlenir?',
    shortAnswer: 'Beş vakit namazın süreleri güneşin konumuna göre belirlenir; uygulama bulunduğunuz konuma göre bunları hesaplar.',
    detailedAnswer: 'Sabah namazı tan yerinin ağarmasıyla (imsak) başlar, güneşin doğuşuyla çıkar. Öğle, güneşin tepe noktasını geçmesiyle; ikindi, gölge uzunluğuna göre; akşam, güneşin batmasıyla; yatsı, şafağın kaybolmasıyla girer. Ülkeler farklı astronomik açılar (hesaplama yöntemleri) kullanır; Türkiye\'de Diyanet takvimi esas alınır. Uygulamanın ayarlarından yöntem seçebilir ve dakika düzeltmesi yapabilirsiniz.',
    sources: [
      { kind: 'ayah', reference: 'Nisâ 4:103', text: 'Şüphesiz namaz, müminlere belirli vakitlere bağlı olarak farz kılınmıştır.', verified: true },
      { kind: 'hadith', reference: 'Müslim, Mesâcid 166', text: 'Cebrail\'in imamlığında iki günde vakitlerin baş ve son sınırlarının gösterildiğine dair rivayet.', grading: 'Sahih', verified: true },
    ],
    confidence: 'high',
    relatedTopics: ['Kaza namazı nedir?', 'İkindi vakti mezheplere göre değişir mi?'],
    relatedLessonIds: ['namaz-1'],
    relatedVideoIds: ['v2'],
  },
  {
    id: 'a-ikindi-mezhep',
    keywords: ['ikindi', 'hanefi', 'şafii', 'mezhep', 'asr'],
    question: 'İkindi vakti mezheplere göre değişir mi?',
    shortAnswer: 'Evet. Hanefi mezhebinde ikindi, cismin gölgesi kendisinin iki katı olunca; diğer üç mezhepte bir katı olunca girer.',
    detailedAnswer: 'İkindi vaktinin başlangıcı konusunda fıkhi görüş farkı vardır: Şafiî, Mâlikî ve Hanbelî mezhepleri ile Ebû Yûsuf ve İmam Muhammed\'e göre gölge, cismin bir misli olunca; Ebû Hanîfe\'ye göre iki misli olunca ikindi girer. Her iki görüş de sahih delillere dayanır; uygulamada ayarlardan tercihinizi seçebilirsiniz. Bu bir "doğru-yanlış" meselesi değil, delillerin farklı yorumudur.',
    sources: [
      { kind: 'hadith', reference: 'Müslim, Mesâcid 173', text: 'Vakitlerle ilgili Cebrail hadisi rivayetleri.', grading: 'Sahih', verified: true },
      { kind: 'book', reference: 'Diyanet İlmihali, c.1 (Namaz Vakitleri)', text: 'Mezheplerin ikindi vakti görüşlerinin özeti.', verified: true },
    ],
    confidence: 'high',
    differences: 'Hanefi mezhebi: gölge iki misli (asr-ı sânî). Şafiî/Mâlikî/Hanbelî: gölge bir misli (asr-ı evvel). İkisi de muteberdir; bulunduğunuz ülkenin takvimi genelde birini esas alır.',
    relatedTopics: ['Namaz vakitleri nasıl belirlenir?'],
    relatedLessonIds: ['namaz-1'],
    relatedVideoIds: ['v2'],
  },
  {
    id: 'a-abdest',
    keywords: ['abdest', 'abdesti bozan', 'gusül'],
    question: 'Abdesti bozan şeyler nelerdir?',
    shortAnswer: 'Başlıcaları: tuvalet ihtiyacının giderilmesi, yellenme, uyku, bayılma ve vücuttan kan-irin akması (Hanefi\'ye göre).',
    detailedAnswer: 'Abdesti bozan durumların bir kısmında ittifak, bir kısmında mezhep farkı vardır. İttifakla bozanlar: önden ve arkadan çıkanlar, derin uyku, bayılma. Hanefilere göre vücuttan akan kan abdesti bozar; Şafiîlere göre bozmaz, ancak karşı cinse temas bozar. Şüpheye düşen kişi, kesin bilgiye göre davranır: abdestli olduğundan eminse şüpheyle bozulmaz.',
    sources: [
      { kind: 'ayah', reference: 'Mâide 5:6', text: 'Abdest ayeti.', verified: true },
      { kind: 'hadith', reference: 'Buhârî, Vudû\' 34', text: 'Kendisinde şüphe olan kişinin ses veya koku duymadıkça namazı bırakmaması emri.', grading: 'Sahih', verified: true },
    ],
    confidence: 'high',
    differences: 'Kan akması Hanefî\'de bozar, Şafiî\'de bozmaz; karşı cinse temas Şafiî\'de bozar, Hanefî\'de bozmaz.',
    relatedTopics: ['Gusül ne zaman gerekir?'],
    relatedLessonIds: ['namaz-2'],
    relatedVideoIds: ['v3'],
  },
  {
    id: 'a-oruc-bozan',
    keywords: ['orucu bozan', 'oruç bozulur mu', 'oruçluyken'],
    question: 'Orucu bozan şeyler nelerdir?',
    shortAnswer: 'Bilerek yemek, içmek ve cinsel ilişki orucu bozar. Unutarak yemek-içmek orucu bozmaz.',
    detailedAnswer: 'Oruç; imsaktan iftara kadar yeme, içme ve cinsel ilişkiden uzak durmaktır. Unutarak yiyip içen kişinin orucu bozulmaz; Peygamberimiz "Orucunu tamamlasın, onu Allah yedirmiş içirmiştir" buyurur. Kusma kendiliğinden olursa bozmaz. İğne, aşı, diş tedavisi gibi güncel meselelerde durumlar değişebildiği için Din İşleri Yüksek Kurulu kararlarına veya müftülüğe başvurmak en doğrusudur.',
    sources: [
      { kind: 'ayah', reference: 'Bakara 2:187', text: 'Şafağın beyaz ipliği siyah iplikten ayırt edilinceye kadar yiyin için; sonra orucu geceye kadar tamamlayın.', verified: true },
      { kind: 'hadith', reference: 'Buhârî, Savm 26', text: 'Unutarak yiyip içenin orucunu tamamlaması emri.', grading: 'Sahih', verified: true },
    ],
    confidence: 'high',
    relatedTopics: ['Hastayken oruç tutmalı mıyım?', 'Kaza ve fidye nedir?'],
    relatedLessonIds: ['ramazan-1'],
    relatedVideoIds: ['v8'],
  },
  {
    id: 'a-oruc-hasta',
    keywords: ['hasta oruç', 'ilaç oruç', 'şeker hastası', 'hamile oruç'],
    question: 'Hastayken oruç tutmalı mıyım?',
    shortAnswer: 'Hastalık, oruç tutmamayı mubah kılan mazeretlerdendir; ancak kişisel durumunuz için hekiminize ve müftülüğe danışmalısınız.',
    detailedAnswer: 'Kur\'an, hasta ve yolcuya tutamadığı günleri sonradan kaza etme kolaylığı tanır (Bakara 2:184). Oruç tutması sağlığına zarar verecek kişinin oruç tutmaması gerekir; iyileşince kaza eder, iyileşme umudu yoksa fidye gündeme gelir. Bu değerlendirme kişiye özeldir: hastalığınızın oruca etkisini hekiminiz, dinî hükmünü müftülük değerlendirmelidir.',
    sources: [
      { kind: 'ayah', reference: 'Bakara 2:184-185', text: 'Sizden kim hasta veya yolcu olursa, tutamadığı günler sayısınca başka günlerde tutar... Allah size kolaylık diler, zorluk dilemez.', verified: true },
    ],
    confidence: 'medium',
    referToScholar: true,
    relatedTopics: ['Orucu bozan şeyler nelerdir?'],
    relatedLessonIds: ['ramazan-1'],
    relatedVideoIds: ['v8'],
  },
  {
    id: 'a-zekat',
    keywords: ['zekât', 'zekat', 'nisab', 'kimlere zekat'],
    question: 'Zekât nedir, kimlere verilir?',
    shortAnswer: 'Zekât; nisab miktarı mala sahip Müslümanın, malının kırkta birini (%2,5) her yıl hak sahiplerine vermesidir.',
    detailedAnswer: 'Zekât İslam\'ın beş şartındandır. Verilecek yerler Tevbe 9:60\'ta sayılır: fakirler, miskinler, zekât memurları, kalpleri ısındırılacaklar, köleler, borçlular, Allah yolundakiler ve yolda kalmışlar. Nisab; 80,18 gr altın veya karşılığı birikime, üzerinden bir kameri yıl geçmiş olarak sahip olmaktır. Kendi zekât hesabınız (hangi mallar dahil, borçlar nasıl düşülür) kişiye özel olduğundan müftülüğe veya Diyanet\'in yayınlarına başvurmanız uygundur.',
    sources: [
      { kind: 'ayah', reference: 'Tevbe 9:60', text: 'Sadakalar (zekâtlar) Allah\'tan bir farz olarak ancak fakirlere, düşkünlere... verilir.', verified: true },
      { kind: 'hadith', reference: 'Buhârî, Zekât 1', text: 'İslam beş şey üzerine kurulmuştur... zekât vermek.', grading: 'Sahih', verified: true },
    ],
    confidence: 'high',
    referToScholar: true,
    relatedTopics: ['Fitre nedir?'],
    relatedLessonIds: ['islam-1'],
    relatedVideoIds: [],
  },
  {
    id: 'a-sabir',
    keywords: ['sabır', 'sabretmek', 'zorluk', 'sıkıntı', 'musibet'],
    question: 'Zorluklara nasıl sabredebilirim?',
    shortAnswer: 'Sabır; namaz ve dua ile desteklenen, Allah\'ın beraberliğine güvenen aktif bir duruştur.',
    detailedAnswer: 'Kur\'an "Sabır ve namazla yardım isteyin" buyurur (Bakara 2:153) ve sabredenlere "beraberlik" müjdesi verir. Sabır; şikayeti Allah\'a arz etmeyi, sebeplere sarılmayı ve ümidi korumayı içerir. Peygamberimiz, müminin başına gelen her sıkıntının günahlarına kefaret olduğunu bildirir. Pratik öneri: sıkıntı anında "innâ lillâhi ve innâ ileyhi râciûn" demek (Bakara 2:156) ve iki rekât namaz kılmak.',
    sources: [
      { kind: 'ayah', reference: 'Bakara 2:153-157', text: 'Ey iman edenler! Sabır ve namazla yardım isteyin...', verified: true },
      { kind: 'hadith', reference: 'Buhârî, Merdâ 1', text: 'Müslümana isabet eden her yorgunluk, hastalık ve üzüntü günahlarına kefarettir.', grading: 'Sahih', verified: true },
    ],
    confidence: 'high',
    relatedTopics: ['Tevekkül ne demektir?', 'Şükür nasıl edilir?'],
    relatedLessonIds: ['ahlak-2'],
    relatedVideoIds: ['v1'],
  },
  {
    id: 'a-tevekkul',
    keywords: ['tevekkül', 'kader', 'allaha güvenmek'],
    question: 'Tevekkül ne demektir?',
    shortAnswer: 'Tevekkül; üzerine düşeni yaptıktan sonra sonucu Allah\'a bırakıp O\'na güvenmektir.',
    detailedAnswer: 'Tevekkül tembellik değildir. "Deveni bağla, sonra tevekkül et" hadisi, önce tedbirin alınmasını öğretir. Âl-i İmrân 159 "Kararını verdiğinde Allah\'a tevekkül et" der: istişare + karar + güven. Sonuç umulduğu gibi olmazsa mümin "Allah\'ın takdirinde hayır vardır" diyerek huzurunu korur.',
    sources: [
      { kind: 'ayah', reference: 'Âl-i İmrân 3:159', text: 'Kararını verdiğin zaman artık Allah\'a dayanıp güven.', verified: true },
      { kind: 'hadith', reference: 'Tirmizî, Kıyâme 60', text: 'Deveni bağla, sonra tevekkül et.', grading: 'Hasen', verified: true },
    ],
    confidence: 'high',
    relatedTopics: ['Zorluklara nasıl sabredebilirim?'],
    relatedLessonIds: ['ahlak-2'],
    relatedVideoIds: ['v1'],
  },
  {
    id: 'a-dua-adabi',
    keywords: ['dua', 'dua nasıl', 'duanın kabulü', 'dua adabı'],
    question: 'Duanın kabul olması için nelere dikkat etmeliyim?',
    shortAnswer: 'Helal kazanç, hamd ve salavatla başlama, ısrar ve kabul saatlerini gözetmek duanın edeplerindendir.',
    detailedAnswer: 'Allah "Bana dua edin, icabet edeyim" buyurur (Mü\'min 40:60). Kabul edepleri: abdestli ve kıbleye dönük olmak, hamd-salavatla başlamak, kesin bir dille ve ısrarla istemek, acele etmemek ("dua ettim de kabul olmadı" dememek — Buhârî, Deavât 22). Seher vakti, cuma günü, secde hâli ve iftar anı kabul umulan zamanlardandır. Dua bazen istenen şeyle, bazen bir kötülüğün def\'iyle, bazen ahiret sevabıyla karşılanır.',
    sources: [
      { kind: 'ayah', reference: 'Mü\'min 40:60', text: 'Bana dua edin, size icabet edeyim.', verified: true },
      { kind: 'hadith', reference: 'Buhârî, Deavât 22', text: 'Acele etmedikçe dualarınız kabul olunur.', grading: 'Sahih', verified: true },
    ],
    confidence: 'high',
    relatedTopics: ['Sabah duaları nelerdir?'],
    relatedLessonIds: ['dualar-1', 'dualar-2'],
    relatedVideoIds: ['v11'],
  },
  {
    id: 'a-anne-baba',
    keywords: ['anne', 'baba', 'anne baba hakkı', 'ebeveyn'],
    question: 'Anne-baba hakkı nedir?',
    shortAnswer: 'Allah, kendisine kulluktan hemen sonra anne-babaya iyiliği emreder; onlara "öf" bile demek yasaklanmıştır.',
    detailedAnswer: 'İsrâ 17:23-24, anne-babaya iyiliği Allah\'a kulluğun hemen yanına koyar: yaşlandıklarında onlara "öf" bile demeden, güzel söz söyleyip merhamet kanadını germek emredilir. Peygamberimize "Allah katında en sevimli amel nedir?" diye sorulduğunda "Vaktinde kılınan namaz" demiş, "sonra hangisi?" sorusuna "Anne-babaya iyilik" buyurmuştur. Anne-baba gayrimüslim bile olsa iyi davranmak esastır.',
    sources: [
      { kind: 'ayah', reference: 'İsrâ 17:23-24', text: 'Rabbin, yalnız kendisine kulluk etmenizi ve anne-babaya iyilik etmenizi emretti...', verified: true },
      { kind: 'hadith', reference: 'Buhârî, Mevâkît 5', text: 'En faziletli ameller sıralamasında anne-babaya iyilik.', grading: 'Sahih', verified: true },
    ],
    confidence: 'high',
    relatedTopics: ['Komşu hakkı nedir?'],
    relatedLessonIds: ['ahlak-1'],
    relatedVideoIds: ['v4'],
  },
  {
    id: 'a-komsu',
    keywords: ['komşu', 'komşuluk', 'komşu hakkı'],
    question: 'Komşu hakkı nedir?',
    shortAnswer: 'Komşuya iyilik imandandır; Cebrail\'in tavsiyesi o kadar sürmüştür ki Peygamberimiz komşunun mirasçı kılınacağını sanmıştır.',
    detailedAnswer: 'Nisâ 4:36 yakın ve uzak komşuya iyiliği emreder. Peygamberimiz "Allah\'a ve ahiret gününe iman eden komşusuna eziyet etmesin" buyurmuş; "komşusu şerrinden emin olmayan kişinin gerçek anlamda iman etmiş olamayacağını" bildirmiştir. Pratikte: selam vermek, yemekten ikram etmek, gürültüden kaçınmak, hastalığında ziyaret etmek komşuluk haklarındandır.',
    sources: [
      { kind: 'ayah', reference: 'Nisâ 4:36', text: 'Yakın komşuya, uzak komşuya... iyilik edin.', verified: true },
      { kind: 'hadith', reference: 'Buhârî, Edeb 31', text: 'Allah\'a ve ahiret gününe iman eden komşusuna eziyet etmesin.', grading: 'Sahih', verified: true },
    ],
    confidence: 'high',
    relatedTopics: ['Anne-baba hakkı nedir?'],
    relatedLessonIds: ['ahlak-1'],
    relatedVideoIds: ['v4'],
  },
  {
    id: 'a-giybet',
    keywords: ['gıybet', 'dedikodu', 'arkasından konuşmak'],
    question: 'Gıybet günah mıdır?',
    shortAnswer: 'Evet; gıybet Kur\'an\'da ağır bir benzetmeyle yasaklanmış büyük günahlardandır.',
    detailedAnswer: 'Hucurât 49:12 gıybeti "ölmüş kardeşinin etini yemek" benzetmesiyle yasaklar. Peygamberimiz gıybeti "kardeşini hoşlanmayacağı şeyle anman" diye tanımlar; söylenen doğruysa gıybet, yalansa iftira olduğunu belirtir. Telafisi; tövbe etmek, mümkünse helallik istemek ve o kişiyi gıyabında hayırla anmaktır. Zulmü ifşa, hakkını arama gibi istisnai durumlar fıkıh kitaplarında ayrıca ele alınır.',
    sources: [
      { kind: 'ayah', reference: 'Hucurât 49:12', text: 'Biriniz diğerinizi arkasından çekiştirmesin...', verified: true },
      { kind: 'hadith', reference: 'Müslim, Birr 70', text: 'Gıybet nedir bilir misiniz? Kardeşini hoşlanmayacağı şeyle anmandır.', grading: 'Sahih', verified: true },
    ],
    confidence: 'high',
    relatedTopics: ['Dilin afetleri nelerdir?'],
    relatedLessonIds: ['ahlak-4'],
    relatedVideoIds: ['v12'],
  },
  {
    id: 'a-kuran-baslama',
    keywords: ['kuran öğrenmek', 'kuran okumaya', 'elifba', 'kuran nasıl'],
    question: 'Kur\'an okumaya nereden başlamalıyım?',
    shortAnswer: 'Harfler ve harekelerle başlayın; günde 10 dakikalık düzenli çalışma en etkili yoldur.',
    detailedAnswer: 'Önce 28 harfin yazılış ve sesleri, sonra harekeler (üstün, esre, ötre), ardından cezm-şedde ve uzatmalar öğrenilir. Kısa surelerle (Fâtiha, İhlâs, Kevser) pratik yapın; uygulamanın ezber modu tekrar sayısı ve bekleme süresiyle bunu destekler. "Kur\'an\'ı öğrenen ve öğreten en hayırlınızdır" müjdesi yolun motivasyonudur. Telaffuz için mutlaka bir hocadan veya kurstan yüz yüze destek alın.',
    sources: [
      { kind: 'hadith', reference: 'Buhârî, Fezâilü\'l-Kur\'ân 21', text: 'Sizin en hayırlınız Kur\'an\'ı öğrenen ve öğretendir.', grading: 'Sahih', verified: true },
      { kind: 'hadith', reference: 'Müslim, Müsâfirîn 244', text: 'Kur\'an\'ı zorlanarak okuyana iki ecir vardır.', grading: 'Sahih', verified: true },
    ],
    confidence: 'high',
    relatedTopics: ['Tecvit kuralları nelerdir?'],
    relatedLessonIds: ['kuran-1', 'kuran-2'],
    relatedVideoIds: ['v9'],
  },
  // Yüksek riskli konular — genel bilgi + yönlendirme
  {
    id: 'a-miras',
    keywords: ['miras', 'miras paylaşımı', 'varis'],
    question: 'İslam\'da miras nasıl paylaşılır?',
    shortAnswer: 'Miras payları Nisâ suresinde ayrıntıyla düzenlenmiştir; ancak somut paylaşım hesabı kişiye özel fetva gerektirir.',
    detailedAnswer: 'Kur\'an mirası en ayrıntılı düzenlenen konulardandır (Nisâ 4:11-12, 176). Paylar; mirasçıların kimler olduğuna (eş, çocuk, anne-baba, kardeşler) göre değişir ve borçlar ile vasiyet çıkarıldıktan sonra hesaplanır. Gerçek bir miras paylaşımı hem dinî hem hukuki boyut taşıdığından, somut durumunuz için mutlaka müftülüğe ve bir hukukçuya birlikte danışmanız gerekir; bu asistan fetva veremez.',
    sources: [
      { kind: 'ayah', reference: 'Nisâ 4:11-12', text: 'Allah size çocuklarınız hakkında şunu emreder...', verified: true },
    ],
    confidence: 'medium',
    referToScholar: true,
    relatedTopics: ['Zekât nedir?'],
    relatedLessonIds: [],
    relatedVideoIds: [],
  },
  {
    id: 'a-bosanma',
    keywords: ['boşanma', 'talak', 'nikah', 'evlilik sorunu'],
    question: 'Boşanma hakkında bilgi alabilir miyim?',
    shortAnswer: 'Boşanma İslam\'da meşru ama en son çaredir; somut durumlar kişiye özel değerlendirme gerektirir.',
    detailedAnswer: 'İslam evliliğin korunmasını esas alır; anlaşmazlıkta önce sabır, istişare ve hakem yolu önerilir (Nisâ 4:35). Boşanma (talâk) meşrudur ancak "Allah katında en sevimsiz helal" olarak nitelendirilir (rivayetin sıhhati tartışmalıdır). İddet, mehir ve çocukların hakları gibi hükümler somut duruma göre değişir. Bu konu hem dinî hem hukuki ve ailevi boyutlarıyla kişiye özeldir: lütfen müftülüğe ve gerekirse aile danışmanına başvurun; bu asistan fetva veremez.',
    sources: [
      { kind: 'ayah', reference: 'Nisâ 4:35', text: 'Eğer karı-kocanın arasının açılmasından korkarsanız, bir hakem erkeğin ailesinden, bir hakem de kadının ailesinden gönderin.', verified: true },
      { kind: 'ayah', reference: 'Talâk 65:1-2', text: 'Boşanma hükümlerine dair ayetler.', verified: true },
    ],
    confidence: 'low',
    referToScholar: true,
    relatedTopics: [],
    relatedLessonIds: [],
    relatedVideoIds: [],
  },
  {
    id: 'a-faiz',
    keywords: ['faiz', 'kredi', 'banka', 'riba'],
    question: 'Faiz ve kredi hakkında ne söylenebilir?',
    shortAnswer: 'Faiz (riba) Kur\'an\'da açıkça haram kılınmıştır; günümüz finans ürünlerine dair somut sorular kişiye özel fetva gerektirir.',
    detailedAnswer: 'Bakara 2:275-279 faizi kesin biçimde yasaklar ve ticaretle faizin farklı olduğunu vurgular. Bununla birlikte günümüzdeki kredi türleri, katılım bankacılığı ürünleri, enflasyon farkı gibi meseleler ayrıntılı fıkhi değerlendirme ister ve âlimler arasında görüş farkları vardır. Somut bir finansal işlem için Din İşleri Yüksek Kurulu kararlarına bakmanız veya müftülüğe danışmanız gerekir; bu asistan fetva veremez.',
    sources: [
      { kind: 'ayah', reference: 'Bakara 2:275', text: 'Allah alışverişi helal, faizi haram kılmıştır.', verified: true },
    ],
    confidence: 'medium',
    referToScholar: true,
    relatedTopics: ['Zekât nedir?'],
    relatedLessonIds: [],
    relatedVideoIds: [],
  },
];

/**
 * Basit anahtar kelime eşleşmesi (demo "RAG"). Skorlama: sorguda geçen
 * anahtar kelime sayısı; eşik altında null döner (kaynaksız cevap üretilmez).
 */
export function findAnswer(query: string): DemoAnswer | null {
  const q = query.toLocaleLowerCase('tr');
  let best: DemoAnswer | null = null;
  let bestScore = 0;
  for (const answer of DEMO_ANSWERS) {
    let score = 0;
    for (const keyword of answer.keywords) {
      if (q.includes(keyword.toLocaleLowerCase('tr'))) score += keyword.length > 6 ? 2 : 1;
    }
    if (score > bestScore) {
      best = answer;
      bestScore = score;
    }
  }
  return bestScore > 0 ? best : null;
}

export const SUGGESTED_QUESTIONS = [
  'Namaz vakitleri nasıl belirlenir?',
  'Orucu bozan şeyler nelerdir?',
  'Zorluklara nasıl sabredebilirim?',
  'Duanın kabul olması için nelere dikkat etmeliyim?',
  'Gıybet günah mıdır?',
];
