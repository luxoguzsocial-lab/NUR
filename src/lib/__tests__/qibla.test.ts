import { distanceToKaabaKm, qiblaBearing, qiblaOffset } from '@/lib/qibla';

// Beklenen açılar bilinen referans değerlerdir (coğrafi kuzeyden, saat yönünde).
describe('qiblaBearing — farklı şehirlerde doğrulama', () => {
  const cases: [string, number, number, number][] = [
    ['İstanbul', 41.0082, 28.9784, 151.6],
    ['Ankara', 39.9334, 32.8597, 160.2],
    ['Londra', 51.5074, -0.1278, 119.0],
    ['New York', 40.7128, -74.006, 58.5],
    ['Cakarta', -6.2088, 106.8456, 295.1],
    ['Tokyo', 35.6762, 139.6503, 293.0],
  ];

  it.each(cases)('%s için kıble açısı', (_city, lat, lon, expected) => {
    expect(qiblaBearing(lat, lon)).toBeCloseTo(expected, 0);
  });

  it('Mekke yakınında açı tanımlı ve sonlu', () => {
    const bearing = qiblaBearing(21.5, 39.9);
    expect(Number.isFinite(bearing)).toBe(true);
  });
});

describe('distanceToKaabaKm', () => {
  it('İstanbul-Kâbe mesafesi ~2400 km', () => {
    const d = distanceToKaabaKm(41.0082, 28.9784);
    expect(d).toBeGreaterThan(2300);
    expect(d).toBeLessThan(2500);
  });

  it('Kâbe üzerinde mesafe ~0', () => {
    expect(distanceToKaabaKm(21.4225, 39.8262)).toBeLessThan(1);
  });
});

describe('qiblaOffset', () => {
  it('başlık kıbleyle aynıysa fark 0', () => {
    expect(qiblaOffset(151, 151)).toBe(0);
  });
  it('fark her zaman -180..180 aralığında', () => {
    expect(qiblaOffset(350, 10)).toBe(20);
    expect(qiblaOffset(10, 350)).toBe(-20);
  });
});
