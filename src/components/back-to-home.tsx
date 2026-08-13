import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, type ViewStyle } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

/**
 * Ana sayfa dışındaki sekmelerin sol üstündeki "ana sayfaya dön" butonu.
 * Sekme geçişi yapar (sayfayı/uygulamayı kapatmaz). `overlay` koyu içerik
 * üzerinde (İlham video akışı) yarı saydam siyah zemin kullanır.
 */
export function BackToHome({ overlay, style }: { overlay?: boolean; style?: ViewStyle }) {
  const { t } = useTranslation();
  const theme = useTheme();
  return (
    <Pressable
      onPress={() => router.navigate('/(tabs)')}
      accessibilityRole="button"
      accessibilityLabel={t('tabs.home')}
      hitSlop={8}
      style={({ pressed }) => [
        {
          width: 40,
          height: 40,
          borderRadius: 20,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: overlay ? 'rgba(0,0,0,0.45)' : `${theme.surface}B3`,
          borderWidth: overlay ? 0 : 1,
          borderColor: theme.border,
          opacity: pressed ? 0.7 : 1,
        },
        style,
      ]}
    >
      <Ionicons name="arrow-back" size={20} color={overlay ? '#FFFFFF' : theme.text} />
    </Pressable>
  );
}
