import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Yakındaki cami/mescit araması — OpenStreetMap Overpass API.
 * Gerçek, güncel topluluk verisi; anahtar gerektirmez. Sonuçlar 24 saat
 * cihazda önbelleklenir (çevrimdışı erişim + API'ye saygı).
 */

export interface Mosque {
  id: string;
  name: string | null;
  latitude: number;
  longitude: number;
  distanceKm: number;
}

const OVERPASS_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
];

const CACHE_KEY = 'nur-mosques-cache';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

export function haversineKm(
  lat1: number, lon1: number, lat2: number, lon2: number,
): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

interface OverpassElement {
  type: 'node' | 'way' | 'relation';
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: { name?: string; 'name:tr'?: string };
}

interface CacheEntry {
  key: string;
  savedAt: number;
  mosques: Mosque[];
}

function cacheKeyFor(lat: number, lon: number, radiusKm: number): string {
  // ~1 km hassasiyetle yuvarla ki küçük konum oynamaları önbelleği bozmasın
  return `${lat.toFixed(2)},${lon.toFixed(2)},${radiusKm}`;
}

export async function findNearbyMosques(
  latitude: number,
  longitude: number,
  radiusKm: number,
): Promise<{ mosques: Mosque[]; fromCache: boolean }> {
  const key = cacheKeyFor(latitude, longitude, radiusKm);

  // Taze önbellek varsa ağa hiç çıkma (veri güncel sayılır, rozet gösterilmez)
  let staleCache: CacheEntry | null = null;
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEY);
    if (raw) {
      const entry = JSON.parse(raw) as CacheEntry;
      if (entry.key === key) {
        if (Date.now() - entry.savedAt < CACHE_TTL_MS) {
          return { mosques: entry.mosques, fromCache: false };
        }
        staleCache = entry;
      }
    }
  } catch {
    // önbellek okunamadı — ağdan devam
  }

  const radiusM = Math.round(radiusKm * 1000);
  const query = `[out:json][timeout:20];
(
  node["amenity"="place_of_worship"]["religion"="muslim"](around:${radiusM},${latitude},${longitude});
  way["amenity"="place_of_worship"]["religion"="muslim"](around:${radiusM},${latitude},${longitude});
  relation["amenity"="place_of_worship"]["religion"="muslim"](around:${radiusM},${latitude},${longitude});
);
out center tags;`;

  let lastError: unknown = null;
  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `data=${encodeURIComponent(query)}`,
      });
      if (!res.ok) throw new Error(`Overpass ${res.status}`);
      const json = (await res.json()) as { elements: OverpassElement[] };
      const mosques: Mosque[] = json.elements
        .map((el) => {
          const lat = el.lat ?? el.center?.lat;
          const lon = el.lon ?? el.center?.lon;
          if (lat === undefined || lon === undefined) return null;
          return {
            id: `${el.type}-${el.id}`,
            name: el.tags?.['name:tr'] ?? el.tags?.name ?? null,
            latitude: lat,
            longitude: lon,
            distanceKm: haversineKm(latitude, longitude, lat, lon),
          };
        })
        .filter((m): m is Mosque => m !== null)
        .sort((a, b) => a.distanceKm - b.distanceKm)
        .slice(0, 50);

      try {
        const entry: CacheEntry = { key, savedAt: Date.now(), mosques };
        await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(entry));
      } catch {
        // önbelleğe yazılamadı — önemsiz
      }
      return { mosques, fromCache: false };
    } catch (e) {
      lastError = e;
      // sıradaki yansıyı dene
    }
  }
  // Ağ tamamen başarısız: süresi geçmiş de olsa elde kayıt varsa onu göster
  if (staleCache) return { mosques: staleCache.mosques, fromCache: true };
  throw lastError instanceof Error ? lastError : new Error('Overpass erişilemedi');
}

/** Harita uygulamasında yol tarifi bağlantısı (platforma göre). */
export function mapsUrl(
  latitude: number,
  longitude: number,
  name: string | null,
  platform: string,
): string {
  const label = encodeURIComponent(name ?? 'Cami');
  if (platform === 'ios') return `http://maps.apple.com/?daddr=${latitude},${longitude}&q=${label}`;
  if (platform === 'android') return `geo:${latitude},${longitude}?q=${latitude},${longitude}(${label})`;
  return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
}
