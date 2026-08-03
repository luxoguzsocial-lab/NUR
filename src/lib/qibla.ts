import { Coordinates, Qibla } from 'adhan';

export const KAABA = { latitude: 21.4225, longitude: 39.8262 } as const;

/** Kıble açısı: coğrafi kuzeyden saat yönünde derece (0-360). */
export function qiblaBearing(latitude: number, longitude: number): number {
  return Qibla(new Coordinates(latitude, longitude));
}

/** Kâbe'ye büyük daire (haversine) mesafesi, km. */
export function distanceToKaabaKm(latitude: number, longitude: number): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(KAABA.latitude - latitude);
  const dLon = toRad(KAABA.longitude - longitude);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(latitude)) * Math.cos(toRad(KAABA.latitude)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

/** Pusula başlığına göre cihazın kıbleden sapması (-180..180). */
export function qiblaOffset(compassHeading: number, bearing: number): number {
  let diff = bearing - compassHeading;
  while (diff > 180) diff -= 360;
  while (diff < -180) diff += 360;
  return diff;
}
