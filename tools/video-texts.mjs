/**
 * Video başına: ekranda yakılacak altyazı satırları (lines — uygulamadaki
 * videos.ts subtitles ile birebir aynı) ve seslendirme metni (speech —
 * sayılar okunuşa çevrilmiş hâli). build-video.mjs tarafından kullanılır.
 */
export const VIDEO_TEXTS = {
  v1: {
    lines: [
      'Sabır, zorluk karşısında Allah\'a güvenerek dik durmaktır.',
      'Bakara suresi 153. ayet, sabır ve namazı birlikte anar.',
      'Sabır pasif bekleyiş değil, aktif bir direniştir.',
      'Peygamberimiz, müminin her hâlinin hayır olduğunu söyler.',
      'Bugün küçük bir zorlukta sabrı deneyin: öfkelenmeden önce durun.',
    ],
    speech:
      'Sabır, zorluk karşısında Allah\'a güvenerek dik durmaktır. Bakara suresi yüz elli üçüncü ayet, sabır ve namazı birlikte anar. Sabır pasif bir bekleyiş değil, aktif bir direniştir. Peygamberimiz, müminin her hâlinin hayır olduğunu söyler. Bugün küçük bir zorlukta sabrı deneyin; öfkelenmeden önce durun.',
  },
  v2: {
    lines: [
      'Namaz, günde beş kez Rabbimizle buluşma vaktidir.',
      'Ankebût suresi, namazın kötülükten alıkoyduğunu bildirir.',
      'Namaz vakitleri güne manevi bir ritim kazandırır.',
      'Bir vakti kaçırdıysanız ümitsizliğe kapılmayın; kaza edin ve devam edin.',
    ],
    speech:
      'Namaz, günde beş kez Rabbimizle buluşma vaktidir. Ankebût suresi, namazın kötülükten alıkoyduğunu bildirir. Namaz vakitleri güne manevi bir ritim kazandırır. Bir vakti kaçırdıysanız ümitsizliğe kapılmayın; kaza edin ve devam edin.',
  },
  v3: {
    lines: [
      'Abdestin farzları Mâide suresi 6. ayette sayılır.',
      'Önce eller yıkanır, ağız ve buruna su verilir.',
      'Yüz, kollar yıkanır; baş mesh edilir; ayaklar yıkanır.',
      'Uzuvları üçer kez yıkamak sünnettir.',
      'Abdest hem temizlik hem manevi hazırlıktır.',
    ],
    speech:
      'Abdestin farzları Mâide suresi altıncı ayette sayılır. Önce eller yıkanır, ağız ve buruna su verilir. Yüz ve kollar yıkanır, baş mesh edilir, ayaklar yıkanır. Uzuvları üçer kez yıkamak sünnettir. Abdest hem temizlik hem manevi hazırlıktır.',
  },
  v4: {
    lines: [
      'Efendimizin günü gece ibadetiyle başlardı.',
      'Ailesine ev işlerinde yardım ederdi.',
      'Komşularının hâlini sorar, hastaları ziyaret ederdi.',
      'Gülümsemeyi sadaka sayardı.',
    ],
    speech:
      'Efendimizin günü gece ibadetiyle başlardı. Ailesine ev işlerinde yardım ederdi. Komşularının hâlini sorar, hastaları ziyaret ederdi. Gülümsemeyi sadaka sayardı.',
  },
  v5: {
    lines: [
      'Veda Hutbesi, yüz binin üzerinde sahabiye okundu.',
      'Can, mal ve namus dokunulmazlığı vurgulandı.',
      'Üstünlük ancak takva iledir buyruldu.',
      'Kadın hakları özellikle emanet olarak anıldı.',
    ],
    speech:
      'Veda Hutbesi, yüz binin üzerinde sahabiye okundu. Can, mal ve namus dokunulmazlığı vurgulandı. Üstünlük ancak takva iledir buyruldu. Kadın hakları özellikle emanet olarak anıldı.',
  },
  v6: {
    lines: [
      'İman, beslenmeyen bir fidan gibi kurur; onu zikirle sulayın.',
      'Ra\'d suresi 28: kalpler ancak Allah\'ı anmakla huzur bulur.',
      'Sosyal medyada geçirdiğiniz süreyi bilinçli seçin.',
      'Sizi iyiliğe çağıran arkadaşlıklar kurun.',
    ],
    speech:
      'İman, beslenmeyen bir fidan gibi kurur; onu zikirle sulayın. Ra\'d suresi yirmi sekizinci ayet der ki: kalpler ancak Allah\'ı anmakla huzur bulur. Sosyal medyada geçirdiğiniz süreyi bilinçli seçin. Sizi iyiliğe çağıran arkadaşlıklar kurun.',
  },
  v7: {
    lines: [
      'Şükür, sahip olduklarımızı fark etme sanatıdır.',
      'İbrahim suresi 7: şükredene nimet artırılır.',
      'Her akşam üç nimeti yazmayı deneyin.',
      'Şükür dille, kalple ve amelle olur.',
    ],
    speech:
      'Şükür, sahip olduklarımızı fark etme sanatıdır. İbrahim suresi yedinci ayet: şükredene nimet artırılır. Her akşam üç nimeti yazmayı deneyin. Şükür dille, kalple ve amelle olur.',
  },
  v8: {
    lines: [
      'Ramazan bir ay değil, bir okuldur.',
      'Bakara 183: orucun amacı takvaya ulaşmaktır.',
      'Şaban ayında ara ara oruç tutarak hazırlanabilirsiniz.',
      'Kur\'an okuma ve infak planınızı önceden yapın.',
    ],
    speech:
      'Ramazan bir ay değil, bir okuldur. Bakara yüz seksen üçüncü ayete göre orucun amacı takvaya ulaşmaktır. Şaban ayında ara ara oruç tutarak hazırlanabilirsiniz. Kur\'an okuma ve infak planınızı önceden yapın.',
  },
  v9: {
    lines: [
      'Kur\'an öğrenmeye başlamak için geç kalmış değilsiniz.',
      'Önce harfleri, sonra harekeleri öğrenin.',
      'Günde on dakika düzenli çalışma, uzun seanslardan iyidir.',
      'Uygulamadaki ezber modu tekrar için tasarlandı.',
    ],
    speech:
      'Kur\'an öğrenmeye başlamak için geç kalmış değilsiniz. Önce harfleri, sonra harekeleri öğrenin. Günde on dakika düzenli çalışma, uzun seanslardan iyidir. Uygulamadaki ezber modu tekrar için tasarlandı.',
  },
  v10: {
    lines: [
      'er-Rahmân: rahmeti bütün yaratılmışları kuşatan.',
      'Fâtiha\'da her gün kırk kez bu ismi anarız.',
      'Rahmet, güçlünün şefkatli olmasıdır.',
      'Bugün bir canlıya karşılıksız iyilik yapın.',
    ],
    speech:
      'Er-Rahmân: rahmeti bütün yaratılmışları kuşatan. Fâtiha\'da her gün kırk kez bu ismi anarız. Rahmet, güçlünün şefkatli olmasıdır. Bugün bir canlıya karşılıksız iyilik yapın.',
  },
  v11: {
    lines: [
      'Besmele: Bismillâhirrahmânirrahîm!',
      'Yemeğe başlarken besmele çekeriz.',
      'Besmele, "Allah\'ım seninle başlıyorum" demektir.',
      'Sen de bugün işlerine besmeleyle başla!',
    ],
    speech:
      'Besmele: Bismillâhirrahmânirrahîm! Yemeğe başlarken besmele çekeriz. Besmele, Allah\'ım seninle başlıyorum demektir. Sen de bugün işlerine besmeleyle başla!',
  },
  v12: {
    lines: [
      'Gıybet, kişinin arkasından hoşlanmayacağı şekilde konuşmaktır.',
      'Hucurât 12, gıybeti ağır bir benzetmeyle yasaklar.',
      'Söz doğru olsa bile gıybet olabilir; yalansa iftiradır.',
      'Bir mecliste gıybet başlarsa konuyu değiştirin veya ayrılın.',
    ],
    speech:
      'Gıybet, kişinin arkasından hoşlanmayacağı şekilde konuşmaktır. Hucurât suresi on ikinci ayet, gıybeti ağır bir benzetmeyle yasaklar. Söz doğru olsa bile gıybet olabilir; yalansa iftiradır. Bir mecliste gıybet başlarsa konuyu değiştirin veya ayrılın.',
  },
  v13: {
    lines: [
      'İstiğfar, geçmişi silip yeni bir sayfa açmaktır.',
      'Nûh suresi 10: Rabbinizden bağışlanma dileyin; O çok bağışlayıcıdır.',
      'Peygamberimiz günde yüz kez istiğfar ederdi.',
      'Yatmadan önce üç kez estağfirullah demeyi alışkanlık edinin.',
    ],
    speech:
      'İstiğfar, geçmişi silip yeni bir sayfa açmaktır. Nûh suresi onuncu ayet: Rabbinizden bağışlanma dileyin; O çok bağışlayıcıdır. Peygamberimiz günde yüz kez istiğfar ederdi. Yatmadan önce üç kez estağfirullah demeyi alışkanlık edinin.',
  },
  v14: {
    lines: [
      'Anne babaya iyilik, Kur\'an\'da kulluğun hemen yanında anılır.',
      'İsrâ 23: onlara "öf" bile demeyin.',
      'Rabbin rızası, anne babanın rızasındadır.',
      'Bugün onları arayın; kısa bir telefon bile gönül alır.',
    ],
    speech:
      'Anne babaya iyilik, Kur\'an\'da kulluğun hemen yanında anılır. İsrâ suresi yirmi üçüncü ayet: onlara öf bile demeyin. Rabbin rızası, anne babanın rızasındadır. Bugün onları arayın; kısa bir telefon bile gönül alır.',
  },
  v15: {
    lines: [
      'Sadaka malı eksiltmez; bereketlendirir.',
      'Bakara 261: bir tohum, yedi başak, her başakta yüz tane.',
      'Küçük ama düzenli vermek, büyük ama tek seferden hayırlıdır.',
      'Bu hafta bir ihtiyaç sahibine küçük bir iyilik planlayın.',
    ],
    speech:
      'Sadaka malı eksiltmez; bereketlendirir. Bakara suresi iki yüz altmış birinci ayet: bir tohum, yedi başak, her başakta yüz tane. Küçük ama düzenli vermek, büyük ama tek seferden hayırlıdır. Bu hafta bir ihtiyaç sahibine küçük bir iyilik planlayın.',
  },
  v16: {
    lines: [
      'Tevekkül, tembellik değil; elinden geleni yapıp gerisini bırakmaktır.',
      'Talâk 3: Kim Allah\'a tevekkül ederse, O ona yeter.',
      'Kuşlar sabah aç çıkar, akşam tok döner.',
      'Kaygılandığınızda önce tedbirinizi alın, sonra kalbinizi teslim edin.',
    ],
    speech:
      'Tevekkül, tembellik değil; elinden geleni yapıp gerisini bırakmaktır. Talâk suresi üçüncü ayet: Kim Allah\'a tevekkül ederse, O ona yeter. Kuşlar sabah aç çıkar, akşam tok döner. Kaygılandığınızda önce tedbirinizi alın, sonra kalbinizi teslim edin.',
  },
  v17: {
    lines: [
      'Selam, iki kalp arasındaki en kısa köprüdür.',
      'Nisâ 86: selama daha güzeliyle karşılık verin.',
      'Selamı yaymak, sevginin ve imanın alametidir.',
      'Bugün tanımadığınız bir komşuya önce siz selam verin.',
    ],
    speech:
      'Selam, iki kalp arasındaki en kısa köprüdür. Nisâ suresi seksen altıncı ayet: selama daha güzeliyle karşılık verin. Selamı yaymak, sevginin ve imanın alametidir. Bugün tanımadığınız bir komşuya önce siz selam verin.',
  },
  v19: {
    lines: [
      'Dua, kulun Rabbiyle aracısız konuşmasıdır.',
      'Mü\'min suresi 60: Bana dua edin, size karşılık vereyim.',
      'Peygamberimiz duayı ibadetin özü sayar.',
      'Bugün bir işe başlarken kısa bir dua ile başlayın.',
    ],
    speech:
      'Dua, kulun Rabbiyle aracısız konuşmasıdır. Mü\'min suresi altmışıncı ayette Rabbimiz buyurur: Bana dua edin, size karşılık vereyim. Peygamberimiz duayı ibadetin özü sayar. Bugün bir işe başlarken kısa bir dua ile başlayın.',
  },
  v20: {
    lines: [
      'Gün, zikirle açılınca bereketlenir.',
      'Ahzâb 41-42: Allah\'ı çokça anın; sabah akşam tesbih edin.',
      'Sabah ve akşam zikirleri günün koruyucu kalkanıdır.',
      'Uygulamadaki Zikir sekmesinden bugün başlayabilirsiniz.',
    ],
    speech:
      'Gün, zikirle açılınca bereketlenir. Ahzâb suresi kırk bir ve kırk ikinci ayetler: Allah\'ı çokça anın; sabah akşam tesbih edin. Sabah ve akşam zikirleri günün koruyucu kalkanıdır. Uygulamadaki Zikir sekmesinden bugün başlayabilirsiniz.',
  },
  v21: {
    lines: [
      'Aile, sevgi ve merhamet üzerine kurulan bir yuvadır.',
      'Rûm suresi 21: aranıza sevgi ve merhamet koydu.',
      'En hayırlınız, ailesine hayırlı olandır buyurur Peygamberimiz.',
      'Bu akşam sofrayı birlikte kurmayı deneyin.',
    ],
    speech:
      'Aile, sevgi ve merhamet üzerine kurulan bir yuvadır. Rûm suresi yirmi birinci ayet der ki: aranıza sevgi ve merhamet koydu. En hayırlınız, ailesine hayırlı olandır buyurur Peygamberimiz. Bu akşam sofrayı birlikte kurmayı deneyin.',
  },
  v22: {
    lines: [
      'Akrabalık bağı, Kur\'an\'da Allah\'a saygıyla birlikte anılır.',
      'Sıla-i rahim rızkı genişletir, ömrü bereketlendirir.',
      'Uzak kalmış bir akrabanızı bugün arayın.',
      'Küçük bir ziyaret, büyük bir gönül köprüsüdür.',
    ],
    speech:
      'Akrabalık bağı, Kur\'an\'da Allah\'a saygıyla birlikte anılır. Sıla-i rahim rızkı genişletir, ömrü bereketlendirir. Uzak kalmış bir akrabanızı bugün arayın. Küçük bir ziyaret, büyük bir gönül köprüsüdür.',
  },
  v18: {
    lines: [
      'Gece, dünyanın sustuğu ve kalbin konuştuğu vakittir.',
      'Müzzemmil 6: gece kalkışı daha etkili, okuyuşu daha sağlamdır.',
      'Farzlardan sonra en faziletli namaz gece namazıdır.',
      'Önce haftada bir gece, iki rekâtla başlayın.',
    ],
    speech:
      'Gece, dünyanın sustuğu ve kalbin konuştuğu vakittir. Müzzemmil suresi altıncı ayet: gece kalkışı daha etkili, okuyuşu daha sağlamdır. Farzlardan sonra en faziletli namaz gece namazıdır. Önce haftada bir gece, iki rekâtla başlayın.',
  },
};
