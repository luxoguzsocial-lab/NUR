import { getSurahMeta, SURAHS, TOTAL_AYAH_COUNT } from '@/data/quran';
import { getAyahText, getSurahText, isSurahAvailable } from '@/data/quran-text';

describe('tam Kur\'an veri seti', () => {
  it('114 surenin tamamı erişilebilir', () => {
    for (let s = 1; s <= 114; s++) {
      expect(isSurahAvailable(s)).toBe(true);
      expect(getSurahText(s)).toBeDefined();
    }
  });

  it('her surenin ayet sayısı üst veriyle birebir eşleşir', () => {
    let total = 0;
    for (const meta of SURAHS) {
      const text = getSurahText(meta.number)!;
      expect(text.ayahs.length).toBe(meta.ayahCount);
      total += text.ayahs.length;
      // Ayet numaraları 1..N kesintisiz
      text.ayahs.forEach((a, i) => expect(a.number).toBe(i + 1));
    }
    expect(total).toBe(TOTAL_AYAH_COUNT);
  });

  it('bütün ayetlerde Arapça metin ve meal dolu', () => {
    for (const meta of SURAHS) {
      for (const ayah of getSurahText(meta.number)!.ayahs) {
        expect(ayah.arabic.length).toBeGreaterThan(0);
        expect(ayah.translation.length).toBeGreaterThan(0);
      }
    }
  });

  it('bilinen ayetler doğru yerde', () => {
    // Ayetel Kürsi — hareke ve özel işaretlerden arındırıp karşılaştır
    const strip = (s: string) => s.replace(/[ً-ْٰٱ]/g, '');
    expect(strip(getAyahText(2, 255)?.arabic ?? '')).toContain(strip('وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ'));
    // Yâsîn 1
    expect(getAyahText(36, 1)?.arabic.length).toBeGreaterThan(0);
    // Kevser 3 ayet
    expect(getSurahMeta(108)?.ayahCount).toBe(3);
    expect(getSurahText(108)!.ayahs).toHaveLength(3);
  });

  it('seçme paketteki zengin kayıtlar korunuyor (Fâtiha transkripsiyonlu)', () => {
    const fatiha = getSurahText(1)!;
    expect(fatiha.ayahs[0]!.transliteration.length).toBeGreaterThan(0);
    expect(fatiha.ayahs.some((a) => a.tajweed && a.tajweed.length > 0)).toBe(true);
  });
});
