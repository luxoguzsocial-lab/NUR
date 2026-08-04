# NUR — Google Stitch Arayüz Referansı

Google Stitch'te ekranları yeniden tasarlarken kullanılacak güncel tasarım
bilgisi. Her ekran için Stitch'e doğrudan yapıştırılabilecek İngilizce prompt
hazır (Stitch İngilizce promptlarla en iyi sonucu verir). Ortak stil bloğunu
promptun başına ekleyin.

## Ortak stil bloğu (her prompta ekle)

```
Design system: Islamic lifestyle mobile app "NUR", calm and premium feel.
Light theme: background #F7F6F2 (warm off-white), cards #FFFFFF, alt surface #EFEDE6,
text #1C1B18, secondary text #6B6A64, primary teal #0E7365 (buttons, highlights),
soft teal #DCEEEA, gold accent #B08A2E, soft gold #F3EAD3, borders #E3E1DA.
Dark theme: background #12140F, cards #1C1F18, primary teal #3BA694, gold #D4AF5A.
Rounded cards (16-24px radius), 16px base padding, generous whitespace,
system font, Arabic text in larger serif-like style (26pt default).
Bottom tab bar with exactly 5 tabs: Ana Sayfa, Vakit, Kur'an, İlham, Zikir.
No gamification elements (no points, no streaks, no leaderboards).
Turkish language UI.
```

## Mevcut ekranlar ve Stitch promptları

### 1. Ana Sayfa (Home)
Mevcut: selamlama + isim, hicri/miladi tarih, mint hero kartında sonraki vakte
geri sayım (BÜYÜK saat:dakika + küçük saniye), kilitli gelecek vakitler şeridi,
Oruç/Kur'an hızlı düğmeleri, Günlük Rutin x/4, Cuma kartı (Kehf hadisi),
sabah/akşam ritim kartları, altın "günün ayeti" kartı (Arapça + meal + paylaş),
günün videosu, sıradaki ders, hatim/ezber özet kartları, 19 kısayoldan oluşan
4 sütunlu ızgara.

```
Mobile home screen for an Islamic lifestyle app. Top: greeting with user name and
Hijri + Gregorian date. Hero card in soft teal: countdown to next prayer with very
large timer digits, next prayer name, small row of remaining prayers as locked pills.
Two quick action buttons: fasting toggle, continue Quran. Daily routine progress
card (x/4). Gold-tinted "verse of the day" card with Arabic calligraphy line,
Turkish translation and share icon. Horizontal video-of-the-day card. 4-column
grid of 19 rounded shortcut tiles with icons (prayer tracking, qibla, duas, tasbih,
videos, calendar, lessons, saved, notifications, daily, qada, nearby mosques,
reading coach, kids corner, hadiths, profile, about, share).
```

### 2. Vakit (Prayer Times)
Mevcut: şehir başlığı, gün gezgini (‹ tarih ›, merkez tıklayınca bugüne döner),
noktalı yarım daire vakit yayı + güneş işareti, 6 vakit satırı (geçmiş soluk,
sıradaki vurgulu), aylık çizelge görünümü, ezan bildirim anahtarları,
kaza takibi + yakındaki camiler giriş kartları.

```
Prayer times screen. City name header with settings icon. Day navigator with
left/right chevrons and date in center. Large dotted semicircle arc showing day
progress with a small sun marker, current prayer highlighted below the arc.
List of 6 prayer times as rows (past ones dimmed, next one highlighted in teal
with countdown). Toggle chip for monthly table view. Cards below: adhan
notification toggles per prayer, missed-prayers (qada) entry card, nearby
mosques & congregation times entry card.
```

### 3. Kur'an
Mevcut: arama, Sureler/Cüzler sekmeleri, kaldığın yerden devam kartı, günlük
hedef ilerleme, hatim + ezber giriş kartları, Okuma Koçu kartı, 114 sure satırı
(no, ad, ayet sayısı, Mekkî/Medenî, cüz, Arapça ad, yeşil "Okundu" rozeti,
ders kısayolu), yer imleri/notlar bölümleri.

```
Quran index screen. Search bar. Tabs: Surahs / Juz. "Continue reading" card with
last position. Daily reading goal progress bar. Two side-by-side cards: khatm plan,
memorization. Full-width "Reading Coach" card with mic icon. Scrollable list of 114
surah rows: number in rounded square, Turkish name with small green "Read" badge,
ayah count + Mecca/Medina + juz caption, Arabic name on the right.
```

### 4. İlham (video feed)
Mevcut: tam ekran dikey video akışı (TikTok tarzı), kategori çipleri üstte,
sağda kalp/Âmin/paylaş/ses düğmeleri, altta başlık + kaynak rozeti,
video detayında konuşmacı + kaynaklar + ilgili dersler.

```
Full-screen vertical video feed (Reels style) for Islamic short videos. Category
chips overlaid at top. Right-side vertical action rail: like heart, "Âmin" hands,
share, mute. Bottom overlay: video title, creator with verified badge, source
citation chip (e.g. "Bakara 2:153"). Subtitles burned into video center.
```

### 5. Zikir (Tasbih)
Mevcut: zikir seçici (‹ Arapça + ad + anlam + kaynak ›), dev dairesel sayaç,
ipte dizili animasyonlu tesbih taneleri, odak modu + cep modu düğmeleri,
6 tane rengi seçici, günlük hedef çipleri (33/100/300), haftalık çubuk grafik,
bölüm bağlantıları (sabah/akşam, tesbihat, salavat, esma, hadisler),
dua kütüphanesi (kategori çipleri + kartlar).

```
Digital tasbih screen. Top selector card with chevrons: Arabic dhikr text large,
Turkish name and meaning, source line. Huge circular counter (tap target) showing
count / target and cycle number. Animated prayer beads on a string below. Two pill
buttons: focus mode, pocket mode. Bead color selector (6 colored dots). Daily goal
chips 33/100/300. Weekly bar chart of dhikr counts. Section link cards: morning &
evening adhkar, post-prayer tasbihat, salawat, 99 names, hadiths. Dua library with
category chips and rich dua cards (Arabic, transliteration, meaning, source badge,
save + share icon buttons).
```

### Diğer önemli ekranlar (kısa)
- **Okuma Koçu** (`/quran/coach`): 4 adımlı sihirbaz (Dinle/Oku/Karşılaştır/
  Değerlendir), adım çubuğu, ayet kartı (Arapça + okunuş bandı + meal),
  tecvit ipucu kartı, üç değerlendirme düğmesi.
- **Çocuk Yolu** (`/kids`): 4 renkli bölüm kartı (Elifba %25 ilerleme çubuklu,
  Harekeler, Kısa Sureler, Dualarım); Elifba'da dev harf kartı + 28'lik harf
  ızgarası + Dinle/Öğrendim düğmeleri.
- **Yakındaki Camiler** (`/mosques`): kamet tahmin kartı (vakit → kamet, ± ayar),
  yarıçap çipleri, mesafeli cami listesi + "Yol tarifi" düğmeleri.
- **Kaza** (`/qada`): büyük toplam sayaç, vakit satırları + "1 kıldım",
  düzenleme modu.
- **Onboarding**: 8 adım, ilerleme çubuğu, mint hero, isim adımında
  "Devam et" + "Misafir olarak devam et".

## Stitch çıktısını uygulamaya taşırken
- Renkleri `src/constants/theme.ts` içindeki `Colors` ile eşleştir
  (yeni palet istenirse önce orayı güncelle — bütün ekranlar oradan beslenir).
- Boşluk/köşe değerleri `Spacing` (4/8/16/24/32/48) ve `Radius` (8/12/16/24)
  ölçeğine yuvarlanmalı.
- 5 sekme kuralı ve "oyunlaştırma yok" ilkesi tasarımda korunmalı
  (bkz. `docs/P0-SPEC.md`).
