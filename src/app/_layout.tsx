import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Colors } from '@/constants/theme';
import { useHydrated } from '@/hooks/use-hydrated';
import { useThemeMode } from '@/hooks/use-theme';
import i18nInstance, { applyLanguage } from '@/i18n';
import { syncPrayerNotifications } from '@/lib/notifications';
import { useProgressStore } from '@/store/progress';
import { shouldMutePrayerNotifications, usePrivateWorshipStore } from '@/store/private-worship';
import { useSettingsStore } from '@/store/settings';
import { useTasbihStore } from '@/store/tasbih';
import { useTrackerStore } from '@/store/tracker';
import { syncAndroidWidgets } from '@/widgets/android-widget-sync';
import { syncIosWidget } from '@/widgets/ios-widget-data';

void SplashScreen.preventAutoHideAsync();

let notificationSyncQueue: Promise<void> = Promise.resolve();

function syncSystemPrayerNotifications(): void {
  notificationSyncQueue = notificationSyncQueue
    .catch(() => undefined)
    .then(() => {
      const settings = useSettingsStore.getState();
      const names: Record<string, string> = {};
      for (const prayer of ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha']) {
        names[prayer] = i18nInstance.t(`prayers.${prayer}`);
      }
      return syncPrayerNotifications(settings, names, i18nInstance.t('common.appName'), {
        suppressPrayerNotifications:
          !settings.onboardingCompleted ||
          shouldMutePrayerNotifications(usePrivateWorshipStore.getState()),
      });
    })
    .catch(() => undefined);
}

export default function RootLayout() {
  const hydrated = useHydrated();
  const mode = useThemeMode();
  const language = useSettingsStore((s) => s.language);
  const { t } = useTranslation();

  useEffect(() => {
    if (hydrated) {
      applyLanguage(language);
      void SplashScreen.hideAsync();
      // Açılışta namaz bildirim planını tazele (Vakit sekmesine girilmese bile)
      const s = useSettingsStore.getState();
      syncSystemPrayerNotifications();
      // iOS ana ekran widget'ına günün/yarının vakitlerini yaz
      syncIosWidget(s);
      syncAndroidWidgets();
    }
  }, [hydrated, language]);

  // Ayar veya ibadet ilerlemesi degisince ana ekran/kilit ekrani widget'larini tazele.
  useEffect(() => {
    if (!hydrated) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const scheduleSync = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        syncIosWidget(useSettingsStore.getState());
        syncAndroidWidgets();
      }, 350);
    };
    const unsubscribers = [
      useSettingsStore.subscribe(scheduleSync),
      useProgressStore.subscribe(scheduleSync),
      useTrackerStore.subscribe(scheduleSync),
      useTasbihStore.subscribe(scheduleSync),
      usePrivateWorshipStore.subscribe(scheduleSync),
    ];
    return () => {
      if (timer) clearTimeout(timer);
      for (const unsubscribe of unsubscribers) unsubscribe();
    };
  }, [hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const scheduleSync = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(syncSystemPrayerNotifications, 250);
    };
    const unsubscribers = [
      useSettingsStore.subscribe(scheduleSync),
      usePrivateWorshipStore.subscribe(scheduleSync),
    ];
    return () => {
      if (timer) clearTimeout(timer);
      for (const unsubscribe of unsubscribers) unsubscribe();
    };
  }, [hydrated]);

  if (!hydrated) return null;

  const palette = Colors[mode];
  const navTheme = {
    ...(mode === 'dark' ? DarkTheme : DefaultTheme),
    colors: {
      ...(mode === 'dark' ? DarkTheme.colors : DefaultTheme.colors),
      background: palette.background,
      card: palette.surface,
      text: palette.text,
      primary: palette.primary,
      border: palette.border,
    },
  };

  return (
    <ThemeProvider value={navTheme}>
      <Stack
        screenOptions={{
          headerTintColor: palette.text,
          headerStyle: { backgroundColor: palette.surface },
          headerTitleStyle: { fontWeight: '600' },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="search" options={{ title: t('tabs.discover') }} />
        <Stack.Screen name="qada" options={{ title: t('qada.title') }} />
        <Stack.Screen name="hadiths" options={{ title: t('hadiths.title') }} />
        <Stack.Screen name="assistant" options={{ title: t('tabs.assistant') }} />
        <Stack.Screen name="qibla" options={{ title: t('qibla.title') }} />
        <Stack.Screen name="mosques" options={{ title: t('mosques.title') }} />
        <Stack.Screen name="calendar" options={{ title: t('calendar.title') }} />
        <Stack.Screen name="tracker" options={{ title: t('tracker.title') }} />
        <Stack.Screen name="private-worship" options={{ title: t('privateWorship.title') }} />
        <Stack.Screen name="travel" options={{ title: t('travel.title') }} />
        <Stack.Screen name="demo" options={{ headerShown: false }} />
        <Stack.Screen name="saved" options={{ title: t('saved.title') }} />
        <Stack.Screen name="notifications" options={{ title: t('notifications.title') }} />
        <Stack.Screen name="profile" options={{ title: t('profile.title') }} />
        <Stack.Screen name="settings" options={{ title: t('settings.title') }} />
        <Stack.Screen name="about" options={{ title: t('about.title') }} />
        <Stack.Screen name="ramadan" options={{ title: t('ramadan.title') }} />
      </Stack>
    </ThemeProvider>
  );
}
