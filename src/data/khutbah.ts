/**
 * Diyanet İşleri Başkanlığı'nın haftalık Cuma hutbesi.
 * Resmî, kamuya açık metin; kaynak zorunluluğu gereği tarih + kurum +
 * bağlantı ile birlikte tutulur. Yeni hutbe yayımlandığında bu kayıt
 * güncellenir (kaynak: dinhizmetleri.diyanet.gov.tr / diyanethaber.com.tr).
 */

export interface KhutbahSection {
  /** Hitap satırı, ör. "Muhterem Müslümanlar!" */
  heading?: string;
  text: string;
}

export interface Khutbah {
  /** Okunduğu cuma günü */
  dateISO: string;
  title: string;
  source: string;
  sourceUrl: string;
  /** Hutbenin merkezindeki ayet: Arapça + Türkçe meal + referans */
  ayah: {
    arabic: string;
    meal: string;
    reference: string;
  };
  sections: KhutbahSection[];
  footnotes: string[];
}

export const LATEST_KHUTBAH: Khutbah = {
  dateISO: '2026-08-07',
  title: 'Kardeşlik',
  source: 'Diyanet İşleri Başkanlığı — Din Hizmetleri Genel Müdürlüğü',
  sourceUrl: 'https://www.diyanethaber.com.tr/7-agustos-2026-cuma-hutbesi',
  ayah: {
    arabic: 'وَاعْتَصِمُوا بِحَبْلِ اللّٰهِ جَم۪يعًا وَلَا تَفَرَّقُوا',
    meal: 'Hep birlikte Allah\'ın ipine sımsıkı sarılın; bölünüp parçalanmayın.',
    reference: 'Âl-i İmrân 3/103',
  },
  sections: [
    {
      heading: 'Muhterem Müslümanlar!',
      text:
        'Yüce dinimiz İslam\'ın temel hedefi, hem bu dünya hem de ebedi âlemde insanlığın huzur ve mutluluğunu sağlamaktır. Huzur ve mutluluğu sağlamanın yolu ise; kardeş olmaktan, aramızdaki sevgi ve muhabbeti daha da güçlendirmekten geçmektedir. Öyle ki Rahmet Elçisi Peygamberimiz (s.a.s), birbirimizi sevmeyi iman etmenin bir gereği olarak ifade etmiştir.[1]',
    },
    {
      heading: 'Aziz Müminler!',
      text:
        'Savaşların farklı bölgelere yayıldığı, İslam coğrafyasında kan ve gözyaşının hâkim olduğu, ülkemizin ateş çemberinin içine çekilmek istendiği bir dönemde; istikbalimiz, kardeşliğimize bağlıdır. Ecdadımızın canlarını feda ederek bizlere emanet ettiği cennet vatanımızda; sevinçlerimiz, hüzünlerimiz, dualarımız, zenginlik olarak kabul ettiğimiz farklılıklarımız bizleri yekvücut kılacaktır.',
    },
    {
      heading: 'Kıymetli Müslümanlar!',
      text:
        'Dün olduğu gibi bugün de kardeşliğimize göz diken, muhabbetimize kasteden, bizi birbirimize düşürmek isteyenler olacaktır. Şunu unutmayalım ki, sadece Müslümanların değil, mazlum durumda olan bütün insanların umudu olan bizler, gaflet içerisinde olmadığımız müddetçe düşmanlarımızın emelleri kursaklarında kalacaktır. Cenâb-ı Hakk\'ın, "Hep birlikte Allah\'ın ipine sımsıkı sarılın; bölünüp parçalanmayın"[2] emri gereğince dinimize ve mukaddesatımıza bağlı kalırsak fitne ve fesat ateşi bizlere dokunamayacaktır. Rahmet Peygamberi (s.a.s)\'in, "Birbirinizle ilgi ve alakayı kesmeyin, birbirinize sırt çevirmeyin, birbirinize kin beslemeyin, birbirinize haset etmeyin. Ey Allah\'ın kulları! Kardeş olun"[3] çağrısına kulak verirsek ayrılık ve gayrılık bu topraklarda kendine yer bulamayacaktır. "Müminler ancak kardeştirler, öyleyse kardeşlerinizin arasını düzeltin, Allah\'a itaatsizlikten sakının ki rahmetine mazhar olasınız"[4] emr-i ilahisine göre davranırsak vatanımızın dirliğini ve ümmetin birliğini kimse bozamayacaktır.',
    },
    {
      heading: 'Değerli Müminler!',
      text:
        'Şunu hepimiz biliriz ki;\n\n"Girmeden tefrika bir millete düşman giremez.\nToplu vurdukça yürekler onu top sindiremez."\n\nBugün bize düşen; fitneye karşı basiretle, ayrılığa karşı vahdet şuuru ile hareket etmek, birbirimizi koruyup gözetmektir. Kardeşliğimizi zedeleyebilecek her türlü şeyden uzak durmak, birbirimizin yükünü hafifletmektir. Milli ve manevi değerlerimiz etrafında buluşmak; birlikte rahmetin, ayrılıkta azabın olduğunu[5] unutmamaktır.',
    },
    {
      heading: 'Aziz Kardeşlerim!',
      text:
        'Kendi inanç ve medeniyet köklerimize tutunduğumuzda, bir binanın tuğlaları gibi birbirimize sımsıkı kenetlendiğimizde yarınlarımız daha huzurlu olacaktır. Hutbemizi, Yüce Rabbimizin şu uyarısıyla bitiriyoruz: "Allah\'a ve Resûlüne itaat edin ve birbirinizle çekişmeyin. Sonra gevşersiniz ve gücünüz, devletiniz elden gider. Sabırlı olun. Çünkü Allah sabredenlerle beraberdir."[6]',
    },
  ],
  footnotes: [
    '[1] Müslim, Îmân, 93.',
    '[2] Âl-i İmrân, 3/103.',
    '[3] Tirmizî, Birr ve Sıla, 24.',
    '[4] Hucurât, 49/10.',
    '[5] İbn Hanbel, IV, 278.',
    '[6] Enfâl, 8/46.',
  ],
};
