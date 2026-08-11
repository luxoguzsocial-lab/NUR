import { TURKISH_CITIES, type City } from '@/data/cities';
import type { LocationSetting } from '@/store/settings';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export function distanceKm(a: Coordinates, b: Coordinates): number {
  const radiusKm = 6371;
  const toRad = (value: number) => (value * Math.PI) / 180;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.latitude)) *
      Math.cos(toRad(b.latitude)) *
      Math.sin(dLon / 2) ** 2;
  return 2 * radiusKm * Math.asin(Math.sqrt(x));
}

export function findNearestTurkishCity(coordinates: Coordinates): {
  city: City;
  distanceKm: number;
} {
  let city = TURKISH_CITIES[0];
  let nearestDistance = distanceKm(coordinates, city);
  for (const candidate of TURKISH_CITIES.slice(1)) {
    const candidateDistance = distanceKm(coordinates, candidate);
    if (candidateDistance < nearestDistance) {
      city = candidate;
      nearestDistance = candidateDistance;
    }
  }
  return { city, distanceKm: nearestDistance };
}

export function buildObservedLocation(
  coordinates: Coordinates,
  place?: { city?: string | null; region?: string | null; district?: string | null; subregion?: string | null },
): LocationSetting {
  const nearest = findNearestTurkishCity(coordinates);
  const geocodedName = place?.city ?? place?.region;
  const fallbackName =
    nearest.distanceKm <= 140
      ? nearest.city.name
      : `${coordinates.latitude.toFixed(2)}, ${coordinates.longitude.toFixed(2)}`;
  return {
    mode: 'auto',
    latitude: coordinates.latitude,
    longitude: coordinates.longitude,
    cityName: geocodedName || fallbackName,
    districtName: place?.district ?? place?.subregion ?? undefined,
  };
}

export function shouldSuggestTravel(
  observed: LocationSetting,
  configured: LocationSetting,
  minimumDistanceKm = 30,
): boolean {
  return distanceKm(observed, configured) >= minimumDistanceKm;
}
