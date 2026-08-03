/**
 * Esmaül Hüsna — Allah'ın 99 güzel ismi.
 * Liste kaynağı: Tirmizî, Deavât 82 (Ebû Hüreyre r.a. rivayeti).
 */

export interface EsmaName {
  order: number;
  arabic: string;
  /** Türkçe okunuş, ör. 'er-Rahmân' */
  transliteration: string;
  /** Kısa anlam */
  meaningTr: string;
  /** 1-2 cümlelik açıklama */
  description: string;
}

export const ESMA_SOURCE = 'Tirmizî, Deavât 82';

export const ESMA_NAMES: EsmaName[] = [
  { order: 1, arabic: 'اَلرَّحْمٰنُ', transliteration: 'er-Rahmân', meaningTr: 'Rahmeti sonsuz, esirgeyen', description: 'Mümin-kâfir ayırmaksızın bütün yaratılmışlara dünyada merhamet eden. Rahmeti her şeyi kuşatmıştır.' },
  { order: 2, arabic: 'اَلرَّحِيمُ', transliteration: 'er-Rahîm', meaningTr: 'Çok merhametli, bağışlayan', description: 'İman edenlere karşı özellikle ahirette sonsuz merhamet sahibi olan.' },
  { order: 3, arabic: 'اَلْمَلِكُ', transliteration: 'el-Melik', meaningTr: 'Mülkün gerçek sahibi', description: 'Görünen ve görünmeyen bütün âlemlerin tek ve mutlak hükümdarı.' },
  { order: 4, arabic: 'اَلْقُدُّوسُ', transliteration: 'el-Kuddûs', meaningTr: 'Her eksiklikten uzak', description: 'Bütün kusur ve noksanlıklardan münezzeh, tertemiz olan.' },
  { order: 5, arabic: 'اَلسَّلَامُ', transliteration: 'es-Selâm', meaningTr: 'Esenlik veren', description: 'Her türlü tehlikeden selâmete çıkaran; esenliğin ve barışın kaynağı olan.' },
  { order: 6, arabic: 'اَلْمُؤْمِنُ', transliteration: 'el-Mü’min', meaningTr: 'Güven veren', description: 'Kalplere iman ve güven veren; vaadine güvenilen.' },
  { order: 7, arabic: 'اَلْمُهَيْمِنُ', transliteration: 'el-Müheymin', meaningTr: 'Gözetip koruyan', description: 'Bütün varlıkları görüp gözeten, koruyan ve yöneten.' },
  { order: 8, arabic: 'اَلْعَزِيزُ', transliteration: 'el-Azîz', meaningTr: 'Mutlak galip, izzet sahibi', description: 'Mağlup edilmesi mümkün olmayan; her işinde üstün gelen.' },
  { order: 9, arabic: 'اَلْجَبَّارُ', transliteration: 'el-Cebbâr', meaningTr: 'İradesini yürüten, onaran', description: 'Hükmünü her durumda geçerli kılan; eksikleri tamamlayan, kırıkları onaran.' },
  { order: 10, arabic: 'اَلْمُتَكَبِّرُ', transliteration: 'el-Mütekebbir', meaningTr: 'Büyüklük kendisine ait olan', description: 'Azamet ve yücelik yalnızca kendisine yaraşan.' },
  { order: 11, arabic: 'اَلْخَالِقُ', transliteration: 'el-Hâlık', meaningTr: 'Yaratan', description: 'Her şeyi yoktan var eden; takdir ederek yaratan.' },
  { order: 12, arabic: 'اَلْبَارِئُ', transliteration: 'el-Bârî', meaningTr: 'Örneksiz var eden', description: 'Varlıkları örneği olmadan, birbiriyle uyumlu şekilde yaratan.' },
  { order: 13, arabic: 'اَلْمُصَوِّرُ', transliteration: 'el-Musavvir', meaningTr: 'Şekil veren', description: 'Her varlığa kendine özgü suret ve özellik veren.' },
  { order: 14, arabic: 'اَلْغَفَّارُ', transliteration: 'el-Gaffâr', meaningTr: 'Günahları örtüp bağışlayan', description: 'Kullarının günahlarını tekrar tekrar bağışlayan, kusurları örten.' },
  { order: 15, arabic: 'اَلْقَهَّارُ', transliteration: 'el-Kahhâr', meaningTr: 'Her şeye galip gelen', description: 'Her şeyi hükmü altında tutan; gücüne karşı konulamayan.' },
  { order: 16, arabic: 'اَلْوَهَّابُ', transliteration: 'el-Vehhâb', meaningTr: 'Karşılıksız veren', description: 'Sayısız nimeti karşılık beklemeden bolca bağışlayan.' },
  { order: 17, arabic: 'اَلرَّزَّاقُ', transliteration: 'er-Rezzâk', meaningTr: 'Rızık veren', description: 'Bütün canlıların rızkını yaratan ve ulaştıran.' },
  { order: 18, arabic: 'اَلْفَتَّاحُ', transliteration: 'el-Fettâh', meaningTr: 'Hayır kapılarını açan', description: 'Hayır kapılarını açan, zorlukları çözen; hak ile hükmeden.' },
  { order: 19, arabic: 'اَلْعَلِيمُ', transliteration: 'el-Alîm', meaningTr: 'Her şeyi bilen', description: 'Gizli-açık, olmuş-olacak her şeyi eksiksiz bilen.' },
  { order: 20, arabic: 'اَلْقَابِضُ', transliteration: 'el-Kâbıd', meaningTr: 'Daraltan, tutan', description: 'Hikmetiyle rızkı daraltan ve canları alan.' },
  { order: 21, arabic: 'اَلْبَاسِطُ', transliteration: 'el-Bâsıt', meaningTr: 'Genişleten', description: 'Rızkı ve gönülleri genişleten, bollaştıran.' },
  { order: 22, arabic: 'اَلْخَافِضُ', transliteration: 'el-Hâfıd', meaningTr: 'Alçaltan', description: 'Büyüklenenleri ve zalimleri alçaltan.' },
  { order: 23, arabic: 'اَلرَّافِعُ', transliteration: 'er-Râfi’', meaningTr: 'Yükselten', description: 'Dilediğini şeref ve derecelerle yükselten.' },
  { order: 24, arabic: 'اَلْمُعِزُّ', transliteration: 'el-Muizz', meaningTr: 'İzzet veren', description: 'Dilediğine izzet, şeref ve itibar veren.' },
  { order: 25, arabic: 'اَلْمُذِلُّ', transliteration: 'el-Müzill', meaningTr: 'Zillete düşüren', description: 'Hak edeni zillete düşüren; izzet ve zillet yalnız O’nun elindedir.' },
  { order: 26, arabic: 'اَلسَّمِيعُ', transliteration: 'es-Semî’', meaningTr: 'Her şeyi işiten', description: 'Gizli-açık her sesi ve her duayı işiten.' },
  { order: 27, arabic: 'اَلْبَصِيرُ', transliteration: 'el-Basîr', meaningTr: 'Her şeyi gören', description: 'Her şeyi bütün incelikleriyle gören.' },
  { order: 28, arabic: 'اَلْحَكَمُ', transliteration: 'el-Hakem', meaningTr: 'Hükmeden', description: 'Son hükmü veren; hakkı yerine getiren.' },
  { order: 29, arabic: 'اَلْعَدْلُ', transliteration: 'el-Adl', meaningTr: 'Mutlak adaletli', description: 'Asla zulmetmeyen; tam ve mutlak adalet sahibi.' },
  { order: 30, arabic: 'اَللَّطِيفُ', transliteration: 'el-Latîf', meaningTr: 'Lütufkâr, inceliği bilen', description: 'Kullarına incelikle muamele eden; işlerin en gizli inceliklerini bilen.' },
  { order: 31, arabic: 'اَلْخَبِيرُ', transliteration: 'el-Habîr', meaningTr: 'Her şeyden haberdar', description: 'Her şeyin iç yüzünden haberdar olan.' },
  { order: 32, arabic: 'اَلْحَلِيمُ', transliteration: 'el-Halîm', meaningTr: 'Yumuşak davranan', description: 'Cezalandırmada acele etmeyen; kullarına fırsat ve mühlet veren.' },
  { order: 33, arabic: 'اَلْعَظِيمُ', transliteration: 'el-Azîm', meaningTr: 'Pek azametli', description: 'Büyüklüğü akıllarla kavranamayan, sonsuz azamet sahibi.' },
  { order: 34, arabic: 'اَلْغَفُورُ', transliteration: 'el-Gafûr', meaningTr: 'Çok bağışlayan', description: 'Günahları ne kadar çok olursa olsun bağışlayan.' },
  { order: 35, arabic: 'اَلشَّكُورُ', transliteration: 'eş-Şekûr', meaningTr: 'Az amele çok veren', description: 'Rızası için yapılan amelleri kat kat ödüllendiren.' },
  { order: 36, arabic: 'اَلْعَلِيُّ', transliteration: 'el-Aliyy', meaningTr: 'Pek yüce', description: 'Şanı, kudreti ve zâtı ile her şeyden yüce olan.' },
  { order: 37, arabic: 'اَلْكَبِيرُ', transliteration: 'el-Kebîr', meaningTr: 'En büyük', description: 'Zâtında ve sıfatlarında en büyük olan.' },
  { order: 38, arabic: 'اَلْحَفِيظُ', transliteration: 'el-Hafîz', meaningTr: 'Koruyup gözeten', description: 'Her şeyi koruyan, dengede tutan; amelleri kaydeden.' },
  { order: 39, arabic: 'اَلْمُقِيتُ', transliteration: 'el-Mukît', meaningTr: 'Azık veren', description: 'Her canlının gıdasını ve ihtiyacını veren; her şeye gücü yeten.' },
  { order: 40, arabic: 'اَلْحَسِيبُ', transliteration: 'el-Hasîb', meaningTr: 'Hesaba çeken, yeten', description: 'Kullarına yeten ve onları hesaba çekecek olan.' },
  { order: 41, arabic: 'اَلْجَلِيلُ', transliteration: 'el-Celîl', meaningTr: 'Celâl sahibi', description: 'Ululuk, yücelik ve heybet sahibi olan.' },
  { order: 42, arabic: 'اَلْكَرِيمُ', transliteration: 'el-Kerîm', meaningTr: 'Cömert, ikram sahibi', description: 'Karşılıksız ve hesapsız ikram eden.' },
  { order: 43, arabic: 'اَلرَّقِيبُ', transliteration: 'er-Rakîb', meaningTr: 'Gözetleyen', description: 'Bütün varlıkları her an gözetip denetleyen.' },
  { order: 44, arabic: 'اَلْمُجِيبُ', transliteration: 'el-Mücîb', meaningTr: 'Duaları kabul eden', description: 'Kendisine yönelen kullarının dualarına karşılık veren.' },
  { order: 45, arabic: 'اَلْوَاسِعُ', transliteration: 'el-Vâsi’', meaningTr: 'İlmi ve rahmeti geniş', description: 'İlmi, rahmeti ve kudretiyle her şeyi kuşatan.' },
  { order: 46, arabic: 'اَلْحَكِيمُ', transliteration: 'el-Hakîm', meaningTr: 'Hikmet sahibi', description: 'Her işi hikmetli, her hükmü yerli yerinde olan.' },
  { order: 47, arabic: 'اَلْوَدُودُ', transliteration: 'el-Vedûd', meaningTr: 'Çok seven, çok sevilen', description: 'Salih kullarını seven ve kulları tarafından sevilen.' },
  { order: 48, arabic: 'اَلْمَجِيدُ', transliteration: 'el-Mecîd', meaningTr: 'Şanı yüce', description: 'Şeref ve azameti sonsuz olan.' },
  { order: 49, arabic: 'اَلْبَاعِثُ', transliteration: 'el-Bâis', meaningTr: 'Dirilten, gönderen', description: 'Ölüleri diriltecek olan; insanlara peygamberler gönderen.' },
  { order: 50, arabic: 'اَلشَّهِيدُ', transliteration: 'eş-Şehîd', meaningTr: 'Her şeye şahit', description: 'Her an her yerde hazır olan; hiçbir şey kendisinden gizlenemeyen.' },
  { order: 51, arabic: 'اَلْحَقُّ', transliteration: 'el-Hakk', meaningTr: 'Gerçeğin kendisi', description: 'Varlığı ve ulûhiyeti gerçek olan; hakkın ve hakikatin kaynağı.' },
  { order: 52, arabic: 'اَلْوَكِيلُ', transliteration: 'el-Vekîl', meaningTr: 'Güvenilip dayanılan', description: 'Kendisine tevekkül edenlerin işlerini en güzel şekilde gören.' },
  { order: 53, arabic: 'اَلْقَوِيُّ', transliteration: 'el-Kaviyy', meaningTr: 'Pek güçlü', description: 'Gücü her şeye yeten; asla zaafa uğramayan.' },
  { order: 54, arabic: 'اَلْمَتِينُ', transliteration: 'el-Metîn', meaningTr: 'Sarsılmaz kuvvet sahibi', description: 'Kudreti sağlam, kesintisiz ve sarsılmaz olan.' },
  { order: 55, arabic: 'اَلْوَلِيُّ', transliteration: 'el-Veliyy', meaningTr: 'Dost ve yardımcı', description: 'Müminlerin dostu, yardımcısı ve koruyucusu.' },
  { order: 56, arabic: 'اَلْحَمِيدُ', transliteration: 'el-Hamîd', meaningTr: 'Övgüye lâyık', description: 'Her hâlükârda hamde ve övgüye lâyık olan.' },
  { order: 57, arabic: 'اَلْمُحْصِي', transliteration: 'el-Muhsî', meaningTr: 'Her şeyi tek tek bilen', description: 'Her şeyin sayısını ve ölçüsünü bir bir bilen.' },
  { order: 58, arabic: 'اَلْمُبْدِئُ', transliteration: 'el-Mübdî', meaningTr: 'İlkin yaratan', description: 'Varlıkları ilk defa, hiçbir örnek olmadan yaratan.' },
  { order: 59, arabic: 'اَلْمُعِيدُ', transliteration: 'el-Muîd', meaningTr: 'Yeniden dirilten', description: 'Ölümden sonra varlıkları yeniden yaratacak olan.' },
  { order: 60, arabic: 'اَلْمُحْيِي', transliteration: 'el-Muhyî', meaningTr: 'Hayat veren', description: 'Can veren, dirilten; ölü toprağa hayat veren.' },
  { order: 61, arabic: 'اَلْمُمِيتُ', transliteration: 'el-Mümît', meaningTr: 'Öldüren', description: 'Eceli gelen canlıların ölümünü yaratan.' },
  { order: 62, arabic: 'اَلْحَيُّ', transliteration: 'el-Hayy', meaningTr: 'Diri', description: 'Ezelî ve ebedî hayat sahibi olan.' },
  { order: 63, arabic: 'اَلْقَيُّومُ', transliteration: 'el-Kayyûm', meaningTr: 'Her şeyi ayakta tutan', description: 'Kendi zâtıyla var olan; bütün varlığı yönetip ayakta tutan.' },
  { order: 64, arabic: 'اَلْوَاجِدُ', transliteration: 'el-Vâcid', meaningTr: 'Dilediğini bulan', description: 'İstediğini istediği anda bulan; hiçbir şeye muhtaç olmayan.' },
  { order: 65, arabic: 'اَلْمَاجِدُ', transliteration: 'el-Mâcid', meaningTr: 'Şanlı, kerem sahibi', description: 'Şanı yüce, cömertliği bol olan.' },
  { order: 66, arabic: 'اَلْوَاحِدُ', transliteration: 'el-Vâhid', meaningTr: 'Tek', description: 'Zâtında, sıfatlarında ve fiillerinde eşi benzeri olmayan.' },
  { order: 67, arabic: 'اَلْأَحَدُ', transliteration: 'el-Ehad', meaningTr: 'Bir olan', description: 'Mutlak bir olan; bölünmesi ve parçalanması düşünülemeyen.' },
  { order: 68, arabic: 'اَلصَّمَدُ', transliteration: 'es-Samed', meaningTr: 'Hiçbir şeye muhtaç olmayan', description: 'Her varlığın kendisine muhtaç olduğu; kendisi hiçbir şeye muhtaç olmayan.' },
  { order: 69, arabic: 'اَلْقَادِرُ', transliteration: 'el-Kâdir', meaningTr: 'Kudret sahibi', description: 'Dilediğini dilediği gibi yapmaya gücü yeten.' },
  { order: 70, arabic: 'اَلْمُقْتَدِرُ', transliteration: 'el-Muktedir', meaningTr: 'Her şeye gücü yeten', description: 'Kudretiyle her şey üzerinde dilediği gibi tasarruf eden.' },
  { order: 71, arabic: 'اَلْمُقَدِّمُ', transliteration: 'el-Mukaddim', meaningTr: 'Öne alan', description: 'Dilediğini öne geçiren, ileri alan.' },
  { order: 72, arabic: 'اَلْمُؤَخِّرُ', transliteration: 'el-Muahhir', meaningTr: 'Geriye bırakan', description: 'Dilediğini erteleyen, geride bırakan.' },
  { order: 73, arabic: 'اَلْأَوَّلُ', transliteration: 'el-Evvel', meaningTr: 'İlk', description: 'Varlığının başlangıcı olmayan.' },
  { order: 74, arabic: 'اَلْآخِرُ', transliteration: 'el-Âhir', meaningTr: 'Son', description: 'Varlığının sonu olmayan.' },
  { order: 75, arabic: 'اَلظَّاهِرُ', transliteration: 'ez-Zâhir', meaningTr: 'Varlığı apaçık', description: 'Varlığı eserleri ve delilleriyle apaçık görünen.' },
  { order: 76, arabic: 'اَلْبَاطِنُ', transliteration: 'el-Bâtın', meaningTr: 'Gizli, iç yüzünü bilen', description: 'Zâtı gözle görülmeyen; her şeyin iç yüzünü bilen.' },
  { order: 77, arabic: 'اَلْوَالِي', transliteration: 'el-Vâlî', meaningTr: 'Yöneten', description: 'Bütün varlıkları idare eden, işlerini yürüten.' },
  { order: 78, arabic: 'اَلْمُتَعَالِي', transliteration: 'el-Müteâlî', meaningTr: 'Pek yüce', description: 'Yaratılmışların nitelemelerinden ve noksanlıklardan yüce olan.' },
  { order: 79, arabic: 'اَلْبَرُّ', transliteration: 'el-Berr', meaningTr: 'İyilik sahibi', description: 'Kullarına karşı şefkatli olan; iyiliği ve ihsanı bol olan.' },
  { order: 80, arabic: 'اَلتَّوَّابُ', transliteration: 'et-Tevvâb', meaningTr: 'Tövbeleri kabul eden', description: 'Tövbe kapısını açık tutan ve tövbeleri çokça kabul eden.' },
  { order: 81, arabic: 'اَلْمُنْتَقِمُ', transliteration: 'el-Müntakım', meaningTr: 'Hak edeni cezalandıran', description: 'Israrla zulmedenlere ve azgınlara hak ettikleri karşılığı veren.' },
  { order: 82, arabic: 'اَلْعَفُوُّ', transliteration: 'el-Afüvv', meaningTr: 'Affeden', description: 'Günahları silip yok eden, affetmeyi seven.' },
  { order: 83, arabic: 'اَلرَّؤُوفُ', transliteration: 'er-Raûf', meaningTr: 'Pek şefkatli', description: 'Kullarına karşı çok şefkatli ve esirgeyici olan.' },
  { order: 84, arabic: 'مَالِكُ الْمُلْكِ', transliteration: 'Mâlikü’l-Mülk', meaningTr: 'Mülkün ebedî sahibi', description: 'Mülkü dilediğine veren, dilediğinden alan gerçek sahip.' },
  { order: 85, arabic: 'ذُو الْجَلَالِ وَالْإِكْرَامِ', transliteration: 'Zü’l-Celâli ve’l-İkrâm', meaningTr: 'Ululuk ve ikram sahibi', description: 'Azamet ve keremin, yücelik ve cömertliğin kendisinde toplandığı.' },
  { order: 86, arabic: 'اَلْمُقْسِطُ', transliteration: 'el-Muksit', meaningTr: 'Adaletle hükmeden', description: 'Bütün işlerini denk, adaletli ve yerli yerinde yapan.' },
  { order: 87, arabic: 'اَلْجَامِعُ', transliteration: 'el-Câmi’', meaningTr: 'Toplayan', description: 'Dilediklerini dilediği yerde toplayan; kıyamet günü insanları bir araya getirecek olan.' },
  { order: 88, arabic: 'اَلْغَنِيُّ', transliteration: 'el-Ganiyy', meaningTr: 'Zengin, muhtaç olmayan', description: 'Hiçbir şeye muhtaç olmayan; zenginliği sonsuz olan.' },
  { order: 89, arabic: 'اَلْمُغْنِي', transliteration: 'el-Muğnî', meaningTr: 'Zenginlik veren', description: 'Dilediğini zengin eden, ihtiyaçtan kurtaran.' },
  { order: 90, arabic: 'اَلْمَانِعُ', transliteration: 'el-Mâni’', meaningTr: 'Engelleyen', description: 'Dilemediği şeyin gerçekleşmesine izin vermeyen; kötülükleri önleyen.' },
  { order: 91, arabic: 'اَلضَّارُّ', transliteration: 'ed-Dârr', meaningTr: 'Zararı yaratan', description: 'Hikmeti gereği elem ve zararı yaratan; kullarını bununla imtihan eden.' },
  { order: 92, arabic: 'اَلنَّافِعُ', transliteration: 'en-Nâfi’', meaningTr: 'Fayda veren', description: 'Hayrı ve menfaati yaratan; faydalı olan her şeyi lütfeden.' },
  { order: 93, arabic: 'اَلنُّورُ', transliteration: 'en-Nûr', meaningTr: 'Nur, aydınlatan', description: 'Âlemleri nurlandıran; kalplere iman ışığı veren.' },
  { order: 94, arabic: 'اَلْهَادِي', transliteration: 'el-Hâdî', meaningTr: 'Hidayet veren', description: 'Doğru yolu gösteren, dilediğini hidayete erdiren.' },
  { order: 95, arabic: 'اَلْبَدِيعُ', transliteration: 'el-Bedî’', meaningTr: 'Eşsiz yaratan', description: 'Örneği olmadan, hayranlık verici güzellikte yaratan.' },
  { order: 96, arabic: 'اَلْبَاقِي', transliteration: 'el-Bâkî', meaningTr: 'Varlığı sonsuz', description: 'Varlığının sonu olmayan, ebedî olan.' },
  { order: 97, arabic: 'اَلْوَارِثُ', transliteration: 'el-Vâris', meaningTr: 'Her şeyin gerçek vârisi', description: 'Bütün varlıklar son bulduktan sonra bâki kalan; mülkün gerçek sahibi.' },
  { order: 98, arabic: 'اَلرَّشِيدُ', transliteration: 'er-Reşîd', meaningTr: 'Doğruya ulaştıran', description: 'Bütün işleri isabetli olan; kullarını doğru yola yönelten.' },
  { order: 99, arabic: 'اَلصَّبُورُ', transliteration: 'es-Sabûr', meaningTr: 'Çok sabırlı', description: 'Cezalandırmada acele etmeyen; isyan edenlere dahi mühlet veren.' },
];

export function getEsmaByOrder(order: number): EsmaName | undefined {
  return ESMA_NAMES.find((n) => n.order === order);
}
