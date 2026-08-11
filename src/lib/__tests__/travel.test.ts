import { buildObservedLocation, distanceKm, findNearestTurkishCity, shouldSuggestTravel } from '../travel';

describe('travel mode helpers', () => {
  it('finds the nearest bundled city without a network request', () => {
    const result = findNearestTurkishCity({ latitude: 39.92, longitude: 32.85 });
    expect(result.city.name).toBe('Ankara');
    expect(result.distanceKm).toBeLessThan(5);
  });

  it('uses reverse geocoding when available and an offline city fallback otherwise', () => {
    expect(
      buildObservedLocation(
        { latitude: 38.4237, longitude: 27.1428 },
        { city: 'İzmir', district: 'Konak' },
      ),
    ).toMatchObject({ cityName: 'İzmir', districtName: 'Konak' });
    expect(buildObservedLocation({ latitude: 37.01, longitude: 35.33 }).cityName).toBe('Adana');
    expect(buildObservedLocation({ latitude: 51.5072, longitude: -0.1276 }).cityName).toBe('51.51, -0.13');
  });

  it('only suggests travel after a meaningful location change', () => {
    const istanbul = { mode: 'manual' as const, latitude: 41.0082, longitude: 28.9784, cityName: 'İstanbul' };
    const nearby = { ...istanbul, latitude: 41.05, longitude: 29.02 };
    const ankara = { mode: 'auto' as const, latitude: 39.9334, longitude: 32.8597, cityName: 'Ankara' };
    expect(distanceKm(istanbul, nearby)).toBeLessThan(30);
    expect(shouldSuggestTravel(nearby, istanbul)).toBe(false);
    expect(shouldSuggestTravel(ankara, istanbul)).toBe(true);
  });
});
