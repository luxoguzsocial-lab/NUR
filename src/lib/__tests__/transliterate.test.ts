import { turkishTransliteration } from '../transliterate';

describe('turkishTransliteration', () => {
  it('Fâtiha açılışını makul okunuşla verir', () => {
    expect(turkishTransliteration('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ')).toBe(
      'Bismi allâhi errahmâni errahîm',
    );
  });

  it('lafza-i celâli gizli uzatmayla okur', () => {
    expect(turkishTransliteration('قُلْ هُوَ اللَّهُ أَحَدٌ')).toBe('Kul hüve allâhü ehad');
    expect(turkishTransliteration('الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ')).toBe(
      'Elhamdü lillâhi rabbi el\'âlemîn',
    );
  });

  it('vakıfta tenvini düşürür', () => {
    // ehadün -> ehad (dammatan vakıfta okunmaz)
    expect(turkishTransliteration('قُلْ هُوَ اللَّهُ أَحَدٌ').endsWith('ehad')).toBe(true);
  });

  it('kelime içi el- takısını uzatma sanmaz', () => {
    expect(turkishTransliteration('وَالْعَصْرِ')).toBe('Vel\'asr');
  });

  it('med harflerini â/î/û ile uzatır', () => {
    expect(turkishTransliteration('مَالِكِ يَوْمِ الدِّينِ')).toBe('Mâliki yevmi eddîn');
  });

  it('kalın harften sonra kasrayı ı okur', () => {
    expect(turkishTransliteration('اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ')).toContain('sırât');
  });

  it('boş ve işaretli metinlerde çökmez', () => {
    expect(turkishTransliteration('')).toBe('');
    expect(turkishTransliteration('ـــ ۖ')).toBe('');
  });
});
