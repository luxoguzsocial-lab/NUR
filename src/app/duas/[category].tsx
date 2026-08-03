import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { DuaCard } from '@/components/content/dua-card';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { EmptyState } from '@/components/ui-bits';
import { Spacing } from '@/constants/theme';
import { DUA_CATEGORY_IDS, getDuasByCategory, type DuaCategoryId } from '@/data/duas';
import { useTheme } from '@/hooks/use-theme';

export default function DuaCategoryScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const params = useLocalSearchParams<{ category: string }>();
  const raw = typeof params.category === 'string' ? params.category : '';
  const category = (DUA_CATEGORY_IDS as readonly string[]).includes(raw)
    ? (raw as DuaCategoryId)
    : undefined;

  const duas = category ? getDuasByCategory(category) : [];
  const title = category ? t(`duas.categories.${category}`) : t('duas.title');

  return (
    <Screen>
      <Stack.Screen options={{ title }} />
      {category ? (
        <>
          {duas.map((dua) => (
            <DuaCard key={dua.id} dua={dua} />
          ))}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: Spacing.sm,
              marginTop: Spacing.sm,
            }}
          >
            <Ionicons name="cloud-offline-outline" size={16} color={theme.textSecondary} />
            <ThemedText variant="caption" style={{ flex: 1 }}>
              {t('common.offlineAvailable')}
            </ThemedText>
          </View>
        </>
      ) : (
        <EmptyState message={t('duas.categoryNotFound')} />
      )}
    </Screen>
  );
}
