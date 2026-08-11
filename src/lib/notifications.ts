import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

import { getPrayerTimesForDate, PRAYER_ORDER } from '@/lib/prayer-times';
import type { SettingsState } from '@/store/settings';

// expo-notifications web'de desteklenmez; web'de bütün bildirim işlemleri
// sessizce atlanır (uygulama tarayıcıda bildirimsiz çalışır).
const NOTIFICATIONS_SUPPORTED = Platform.OS !== 'web';

if (NOTIFICATIONS_SUPPORTED) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!NOTIFICATIONS_SUPPORTED) return false;
  const settings = await Notifications.getPermissionsAsync();
  if (settings.granted) return true;
  const req = await Notifications.requestPermissionsAsync();
  return req.granted;
}

/**
 * Önümüzdeki 48 saatin namaz bildirimlerini yeniden planlar.
 * Uygulama her açılışta ve ayar değişiminde çağrılır; eski planlar temizlenir.
 */
export async function syncPrayerNotifications(
  s: Pick<
    SettingsState,
    'notifications' | 'location' | 'calcMethod' | 'madhab' | 'adjustments' | 'language'
  >,
  prayerNames: Record<string, string>,
  reminderTitle: string,
  options?: { suppressPrayerNotifications?: boolean },
): Promise<void> {
  if (!NOTIFICATIONS_SUPPORTED) return;
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  await Promise.all(
    scheduled
      .filter(
        (request) =>
          request.content.data?.category === 'prayer' ||
          // Eski sürümlerde kategori etiketi yoktu; dil değişmiş olsa da NUR başlıklı
          // etiketsiz planları bir defalık namaz hatırlatıcısı kabul edip temizle.
          (request.content.data?.category === undefined &&
            request.content.title === reminderTitle),
      )
      .map((request) => Notifications.cancelScheduledNotificationAsync(request.identifier)),
  );
  if (!s.notifications.prayersEnabled || options?.suppressPrayerNotifications) return;

  const now = new Date();
  for (const dayOffset of [0, 1]) {
    const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() + dayOffset);
    const { times } = getPrayerTimesForDate(
      day,
      s.location.latitude,
      s.location.longitude,
      s.calcMethod,
      s.madhab,
      s.adjustments,
    );
    for (const prayer of PRAYER_ORDER) {
      if (!s.notifications.perPrayer[prayer]) continue;
      const fireAt = new Date(
        times[prayer].getTime() - s.notifications.reminderMinutesBefore * 60_000,
      );
      if (fireAt.getTime() <= now.getTime()) continue;
      await Notifications.scheduleNotificationAsync({
        content: {
          title: reminderTitle,
          body: prayerNames[prayer] ?? prayer,
          sound: s.notifications.adhanSound !== 'silent',
          data: { category: 'prayer', prayer },
        },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: fireAt },
      });
    }
  }
}
