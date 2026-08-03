# İçerik Kaynakları ve Lisanslar

P0 kabul kriteri: "Kur'an içeriğinin kaynağı ve lisansı belgelenmelidir."

## Kur'an-ı Kerim

| İçerik | Kaynak | Lisans / Durum |
| --- | --- | --- |
| Arapça metin (tam mushaf) | Tanzil projesi standardında Hafs/Uthmani metin | Tanzil metni CC BY-ND 3.0; uygulamada değiştirilmeden kullanılır |
| Türkçe meal (tam) | Elmalılı Hamdi Yazır meali (sadeleştirilmiş üslup) | Elmalılı (v. 1942) orijinal metni Türkiye'de kamu malıdır |
| Transkripsiyon | Uygulama içinde üretilmiş Türkçe okunuş | Özgün içerik |
| Sesli okuma | everyayah.com üzerinden akış (Mishary Alafasy, Mahmoud Khalil Al-Husary) | everyayah.com ücretsiz kullanım; ses dosyaları uygulamayla dağıtılmaz, akışla dinletilir |
| Tecvit işaretleri | Uygulama içi demo anotasyon (Fatiha + İhlas) | **Uzman kontrolü bekliyor** — danışma kurulu onayına kadar bu etiketle gösterilir |

Uygulama, Kur'an'ın TAM metnini içerir: 114 sure / 6236 ayet, Tanzil (Hafs, harekeli) Arapça
metni ve Elmalılı Hamdi Yazır meali uygulamayla birlikte paketlenir ve tamamen çevrimdışı çalışır
(üretim hattı: tools/build-quran.mjs). Transkripsiyon ve tecvit anotasyonları şimdilik seçme
surelerde (Fâtiha, Asr, Fîl-Nâs, Duhâ-Hümeze) mevcuttur.

## Hadisler

- Yalnızca Kütüb-i Sitte kaynaklı, yaygın olarak sahih kabul edilen rivayetler kullanılır.
- Her hadis "Kitap, Bölüm Numara" formatında kaynak gösterir (örn. `Buhârî, Deavât 7`).
- Sıhhat derecesi belirtilmeden hadis gösterilmez; AI asistanda hadis kaynağı zorunludur.

## Dualar ve Esmaül Hüsna

- Kur'an kaynaklı dualar sure:ayet referanslı.
- Sünnet duaları hadis kaynaklı.
- Esmaül Hüsna listesi: Tirmizî, Deavât 82 rivayetindeki yaygın liste.

## Namaz vakitleri ve Kıble

- Hesaplama: [adhan-js](https://github.com/batoulapps/adhan-js) (MIT lisansı), cihaz üzerinde çevrimdışı.
- "Diyanet uyumlu" seçeneği adhan'ın Türkiye parametre setini kullanır; resmî Diyanet takvimiyle
  ±birkaç dakika fark olabilir. Kullanıcı dakika düzeltmesi yapabilir; kullanılan yöntem arayüzde her zaman görünür.
- Hicri takvim: tabular (civil) algoritma. Diyanet'in ilan ettiği tarihlerle ±1 gün fark olabilir;
  arayüzde bu belirsizlik açıkça belirtilir.

## Demo içerikler

- Video akışındaki bütün videolar ve konuşmacılar **kurgusaldır** ve "Demo içerik" etiketi taşır;
  ancak videolarda referans verilen ayet ve hadis kaynakları gerçektir.
- `assets/videos/` altındaki örnek videoların görüntüleri **yapay zekâ ile üretilmiştir**
  (Higgsfield / Kling 3.0 Turbo, 9:16); seslendirme Microsoft Edge nöral TTS (tr-TR-AhmetNeural),
  altyazılar ffmpeg ile videoya gömülüdür (üretim hattı: `tools/build-video.mjs`).
  Açıklamalarda bu belirtilir. Yayın sürümünde gerçek çekimler ve onaylı konuşmacı
  içerikleri kullanılacaktır.
- AI asistan demo modda çalışır: cevaplar önceden hazırlanmış, kaynaklı örneklerdir ve
  "Demo içerik" etiketiyle gösterilir. Eşleşme yoksa asistan kaynak uyduramayacağını söyler.

## Doğrulama süreci

- `verified: true` işaretli içerik: kaynak kontrolü yapılmış.
- "Uzman kontrolü bekliyor": ilahiyat danışma kurulu onayı bekleyen içerik (ör. tecvit anotasyonları).
- Kullanıcılar her içerik ekranından "Hata bildir" ile yanlış bilgi bildirebilir.
