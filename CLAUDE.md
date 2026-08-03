# NUR — İslami Yaşam Uygulaması

Expo (React Native) + TypeScript strict. iOS ve Android hedefli, expo-router dosya tabanlı navigasyon.

## Ürün kapsamı

P0 kapsamının tam listesi: `docs/P0-SPEC.md`. Temel ilkeler:

- Bütün ana kullanıcı yolculukları demo veya gerçek verilerle çalışır; çalışmayan buton/ekran yok.
- P0 dışı özellikler arayüzde hiç görünmez ("yakında" etiketi bile yok).
- Varsayılan dil Türkçe; İngilizce ve Arapça (RTL) altyapısı hazır.
- Hesapsız (misafir) kullanım varsayılandır; ibadet verileri yalnızca cihazda ve özeldir.
- AI asistan dinî otorite değildir: fetva vermez, kaynaksız cevap göstermez (demo modda örnek cevaplar açıkça etiketlenir).
- Alt menüde tam 5 sekme: Ana Sayfa, Vakit, Kur'an, İlham, Zikir. (Asistan ana sayfa banner'ı ve kısayollardan; arama başlıktaki büyüteçten açılır.)

## Mimari

- `src/app/` — expo-router ekranları. `(tabs)/` altında 5 ana sekme; diğer ekranlar stack olarak açılır.
- `src/lib/` — saf hesaplama mantığı (namaz vakitleri `adhan` ile, kıble, hicri takvim). UI'dan bağımsız, test edilebilir.
- `src/store/` — zustand store'ları, AsyncStorage persist. Ayarlar, ilerleme, kaydedilenler, ibadet takibi, tesbih.
- `src/data/` — demo/gerçek içerik (Kur'an alt kümesi, dualar, Esmaül Hüsna, videolar, dersler, dinî günler). Her içerik kaydında `source` alanı zorunludur.
- `src/i18n/` — i18next; `tr` tam, `en`/`ar` altyapı. RTL `I18nManager` üzerinden.
- `src/components/` — paylaşılan UI (ThemedText, Card, Screen, EmptyState...).
- `src/constants/theme.ts` — renkler (açık/koyu), spacing, tipografi.

## Kurallar

- TypeScript strict; `npm run typecheck` ve `npm run lint` her değişiklikten sonra geçmeli.
- Testler `src/lib/__tests__/` altında (jest-expo). Namaz vakti ve kıble hesapları farklı şehirlerle test edilir.
- Dinî içerik eklerken kaynak zorunlu: ayet için sure:ayet, hadis için kitap+numara, dua için kaynak eser.
- API anahtarı istemcide tutulmaz; anahtar yoksa uygulama demo modunda çalışır.
- Kullanıcı verisi loglanmaz; analytics varsayılan kapalı.

## Komutlar

- `npm start` — Expo dev server
- `npm run typecheck` — `tsc --noEmit`
- `npm run lint` — expo lint
- `npm test` — jest
