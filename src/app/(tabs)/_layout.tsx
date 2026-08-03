import { Ionicons } from '@expo/vector-icons';
import { Redirect, Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { useTheme } from '@/hooks/use-theme';
import { useSettingsStore } from '@/store/settings';

export default function TabsLayout() {
  const { t } = useTranslation();
  const theme = useTheme();
  const onboardingCompleted = useSettingsStore((s) => s.onboardingCompleted);

  if (!onboardingCompleted) return <Redirect href="/onboarding" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarStyle: { backgroundColor: theme.surface, borderTopColor: theme.border },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.home'),
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="prayer"
        options={{
          title: t('tabs.prayer'),
          tabBarIcon: ({ color, size }) => <Ionicons name="time-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="quran"
        options={{
          title: t('tabs.quran'),
          tabBarIcon: ({ color, size }) => <Ionicons name="book-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="ilham"
        options={{
          title: t('tabs.ilham'),
          tabBarIcon: ({ color, size }) => <Ionicons name="play-circle-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="zikir"
        options={{
          title: t('tabs.zikir'),
          tabBarIcon: ({ color, size }) => <Ionicons name="ellipse-outline" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
