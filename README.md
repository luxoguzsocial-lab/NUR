# NUR — İslami Yaşam Uygulaması

Namaz vakitleri, Kur'an-ı Kerim, dualar, öğrenme programları ve kaynaklı AI asistanı bir arada
sunan, Allah rızası gözetilerek geliştirilen mobil uygulama. Expo (React Native) + TypeScript.

## Özellikler (P0)

- **Namaz vakitleri** — Diyanet uyumlu dahil 6 hesaplama yöntemi, Hanefi/standart ikindi,
  dakika düzeltmeleri, günlük/aylık görünüm, vakit bildirimleri; tamamen çevrimdışı hesaplama
- **Kıble** — sensör destekli pusula + matematiksel açı ve Kâbe mesafesi (sensörsüz cihazlarda sayısal yön)
- **Kur'an** — okuma (Arapça/meal/transkripsiyon), tecvit renkleri (demo), sesli dinleme,
  hatim planları, ezber modu (kayıt dahil), sure dersleri
- **Zikir & Dua** — animasyonlu dijital tesbih (odak modu, zincir mod), kaynaklı dua koleksiyonu, Esmaül Hüsna (99 isim), seçme hadisler
- **İslami takvim** — hicri tarih, kandiller, bayramlar, Ramazan modu (imsakiye, sayaçlar)
- **İbadet takibi** — yalnızca cihazda, karşılaştırmasız ve puansız
- **İlham** — sesli/altyazılı video akışı (bağımlılık hedeflemeyen tasarım), kategori filtreleri; arama ve öğrenme programları ayrı ekranlarda
- **AI Asistan** — kaynaksız cevap göstermeyen, fetva vermeyen demo RAG asistanı
- **Türkçe** tam destek; İngilizce ve Arapça (RTL) altyapısı hazır

## Geliştirme

```bash
npm install
npm start          # Expo dev server (Expo Go veya dev build)
npm run typecheck  # TypeScript strict kontrolü
npm run lint       # ESLint
npm test           # Jest (namaz vakti / kıble / hicri takvim testleri)
```

## Belgeler

- [docs/P0-SPEC.md](docs/P0-SPEC.md) — P0 kapsam listesi ve kabul kriterleri
- [docs/CONTENT-SOURCES.md](docs/CONTENT-SOURCES.md) — dinî içerik kaynakları ve lisanslar
- [CLAUDE.md](CLAUDE.md) — mimari ve katkı kuralları

## İlkeler

- Bütün dinî içerik kaynaklıdır; kaynaksız içerik gösterilmez.
- İbadet verileri varsayılan olarak özeldir; sosyal karşılaştırma/puanlama yoktur.
- Temel özellikler hesap gerektirmez ve ücretsizdir.
- API anahtarı olmadan uygulama demo modunda tam çalışır.
