import * as Location from 'expo-location';

import { buildObservedLocation } from '@/lib/travel';
import type { LocationSetting } from '@/store/settings';

export type TravelLocationResult =
  | { status: 'ok'; location: LocationSetting }
  | { status: 'permission-denied' | 'unavailable' };

/** İzin yalnızca kullanıcının açık eyleminde istenir; otomatik kontrolde tekrar sorulmaz. */
export async function observeCurrentLocation(requestPermission: boolean): Promise<TravelLocationResult> {
  try {
    const permission = requestPermission
      ? await Location.requestForegroundPermissionsAsync()
      : await Location.getForegroundPermissionsAsync();
    if (!permission.granted) return { status: 'permission-denied' };

    const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
    if (position.coords.accuracy !== null && position.coords.accuracy > 20_000) {
      return { status: 'unavailable' };
    }
    const places = await Location.reverseGeocodeAsync({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    }).catch(() => []);
    return {
      status: 'ok',
      location: buildObservedLocation(
        { latitude: position.coords.latitude, longitude: position.coords.longitude },
        places[0],
      ),
    };
  } catch {
    return { status: 'unavailable' };
  }
}
