import { hijriMonthLength, hijriToGregorian, toHijri } from '@/lib/hijri';
import { upcomingReligiousDays } from '@/lib/religious-days';

describe('hicri takvim dönüşümü (tabular/civil)', () => {
  it('gidiş-dönüş tutarlı (200 gün örneklemi)', () => {
    for (let i = 0; i < 200; i++) {
      const g = new Date(2024, 0, 1 + i * 7);
      const h = toHijri(g);
      const back = hijriToGregorian(h);
      // Tabular dönüşüm gün hassasiyetinde birebir geri dönmeli
      expect(back.getFullYear()).toBe(g.getFullYear());
      expect(back.getMonth()).toBe(g.getMonth());
      expect(back.getDate()).toBe(g.getDate());
    }
  });

  it('Ramazan 1447 başlangıcı Şubat 2026 civarı (±2 gün)', () => {
    const start = hijriToGregorian({ year: 1447, month: 9, day: 1 });
    const expected = new Date(2026, 1, 18); // 18 Şubat 2026 (Diyanet)
    const diffDays = Math.abs(start.getTime() - expected.getTime()) / 86_400_000;
    expect(diffDays).toBeLessThanOrEqual(2);
  });

  it('1 Muharrem 1443 ≈ 9-10 Ağustos 2021', () => {
    const start = hijriToGregorian({ year: 1443, month: 1, day: 1 });
    expect(start.getFullYear()).toBe(2021);
    expect(start.getMonth()).toBe(7);
    expect([8, 9, 10, 11]).toContain(start.getDate());
  });

  it('ay uzunlukları 29 veya 30', () => {
    for (let m = 1; m <= 12; m++) {
      const len = hijriMonthLength(1447, m);
      expect(len === 29 || len === 30).toBe(true);
    }
    // Tek aylar 30 gün
    expect(hijriMonthLength(1447, 1)).toBe(30);
    expect(hijriMonthLength(1447, 2)).toBe(29);
  });

  it('hicri gün/ay geçerli aralıkta', () => {
    const h = toHijri(new Date(2026, 7, 2));
    expect(h.month).toBeGreaterThanOrEqual(1);
    expect(h.month).toBeLessThanOrEqual(12);
    expect(h.day).toBeGreaterThanOrEqual(1);
    expect(h.day).toBeLessThanOrEqual(30);
    expect(h.year).toBe(1448);
  });
});

describe('dinî günler', () => {
  it('yaklaşan günler gelecekte ve sıralı', () => {
    const from = new Date(2026, 7, 2);
    const days = upcomingReligiousDays(from, 8);
    expect(days.length).toBe(8);
    for (let i = 0; i < days.length; i++) {
      expect(days[i]!.date.getTime()).toBeGreaterThanOrEqual(
        new Date(2026, 7, 2).getTime(),
      );
      if (i > 0) {
        expect(days[i]!.date.getTime()).toBeGreaterThanOrEqual(days[i - 1]!.date.getTime());
      }
    }
  });

  it('Regaib Kandili her zaman perşembe gününe denk gelir', () => {
    const days = upcomingReligiousDays(new Date(2026, 0, 1), 30);
    const ragaib = days.filter((d) => d.id === 'ragaib');
    expect(ragaib.length).toBeGreaterThan(0);
    for (const r of ragaib) {
      expect(r.date.getDay()).toBe(4); // Perşembe
    }
  });

  it('Ramazan Bayramı arefesi bayramdan bir gün önce', () => {
    const days = upcomingReligiousDays(new Date(2026, 0, 1), 40);
    const eve = days.find((d) => d.id === 'eidFitrEve');
    const eid = days.find((d) => d.id === 'eidFitr');
    expect(eve && eid).toBeTruthy();
    if (eve && eid) {
      const diff = (eid.date.getTime() - eve.date.getTime()) / 86_400_000;
      expect(diff).toBe(1);
    }
  });
});
