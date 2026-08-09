import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import '@/i18n';

import { Colors } from '@/constants/theme';
import { useHydrated } from '@/hooks/use-hydrated';
import { useThemeMode } from '@/hooks/use-theme';
import { applyLanguage } from '@/i18n';
import { syncPrayerNotifications } from '@/lib/notifications';
import i18nInstance from '@/i18n';
import { useSettingsStore } from '@/store/settings';
import { syncIosWidget } from '@/widgets/ios-widget-data';

void SplashScreen.preventAutoHideAsync();

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
      const names: Record<string, string> = {};
      for (const p of ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha']) {
        names[p] = i18nInstance.t('prayers.' + p);
      }
      void syncPrayerNotifications(s, names, i18nInstance.t('common.appName'));
      // iOS ana ekran widget'ına günün/yarının vakitlerini yaz
      syncIosWidget(s);
    }
  }, [hydrated, language]);

  // Konum / hesap yöntemi değişince iOS widget verisini tazele
  useEffect(() => {
    if (!hydrated) return;
    return useSettingsStore.subscribe((s, prev) => {
      if (
        s.location !== prev.location ||
        s.calcMethod !== prev.calcMethod ||
        s.madhab !== prev.madhab ||
        s.adjustments !== prev.adjustments
      ) {
        syncIosWidget(s);
      }
    });
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
