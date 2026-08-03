import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Card } from '@/components/card';
import { DuaCard } from '@/components/content/dua-card';
import { SearchInput } from '@/components/content/search-input';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { EmptyState, ListRow, SectionHeader, type IconName } from '@/components/ui-bits';
import { Radius, Spacing } from '@/constants/theme';
import {
  DUA_CATEGORY_IDS,
  getDuaById,
  getDuasByCategory,
  searchDuas,
  type DuaCategoryId,
} from '@/data/duas';
import { useTheme } from '@/hooks/use-theme';
import { useSavedStore } from '@/store/saved';

const CATEGORY_ICONS: Record<DuaCategoryId, IconName> = {
  sabah: 'sunny-outline',
  aksam: 'moon-outline',
  namazSonrasi: 'sparkles-outline',
  yemek: 'restaurant-outline',
  yolculuk: 'airplane-outline',
  uyku: 'bed-outline',
  hastalik: 'medkit-outline',
  kurandan: 'book-outline',
};

export default function DuasScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();
  const [query, setQuery] = useState('');

  const savedItems = useSavedStore((s) => s.items);
  const favoriteDuas = useMemo(
    () =>
      savedItems
        .filter((item) => item.type === 'dua')
        .map((item) => getDuaById(item.refId))
        .filter((dua) => dua !== undefined),
    [savedItems],
  );

  const results = useMemo(() => searchDuas(query), [query]);
  const searching = query.trim().length > 0;

  const openCategory = (category: DuaCategoryId) => {
    router.push({ pathname: '/duas/[category]', params: { category } });
  };

  return (
    <Screen>
      <Stack.Screen options={{ title: t('duas.title') }} />
      <SearchInput
        value={query}
        onChangeText={setQuery}
        placeholder={t('duas.searchPlaceholder')}
      />

      {searching ? (
        <>
          <SectionHeader title={t('duas.searchResultsTitle')} />
          {results.length > 0 ? (
            results.map((dua) => <DuaCard key={dua.id} dua={dua} />)
          ) : (
            <EmptyState icon="search-outline" message={t('duas.noResults')} />
          )}
        </>
      ) : (
        <>
          {favoriteDuas.length > 0 ? (
            <>
              <SectionHeader title={t('duas.favoritesTitle')} />
              <Card style={{ padding: 0, overflow: 'hidden' }}>
                {favoriteDuas.map((dua) => (
                  <ListRow
                    key={dua.id}
                    icon={CATEGORY_ICONS[dua.category]}
                    title={dua.titleTr}
                    subtitle={t(`duas.categories.${dua.category}`)}
                    onPress={() => openCategory(dua.category)}
                  />
                ))}
              </Card>
            </>
          ) : null}

          <SectionHeader title={t('duas.categoriesTitle')} />
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm }}>
            {DUA_CATEGORY_IDS.map((category) => (
              <Card
                key={category}
                onPress={() => openCategory(category)}
                accessibilityLabel={t(`duas.categories.${category}`)}
                style={{ width: '48%', flexGrow: 1, gap: Spacing.sm }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: Radius.md,
                    backgroundColor: theme.primarySoft,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Ionicons name={CATEGORY_ICONS[category]} size={20} color={theme.primary} />
                </View>
                <ThemedText variant="label">{t(`duas.categories.${category}`)}</ThemedText>
                <ThemedText variant="caption">
                  {t('duas.duaCount', { count: getDuasByCategory(category).length })}
                </ThemedText>
              </Card>
            ))}
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: Spacing.sm,
              marginTop: Spacing.lg,
            }}
          >
            <Ionicons name="cloud-offline-outline" size={16} color={theme.textSecondary} />
            <ThemedText variant="caption" style={{ flex: 1 }}>
              {t('common.offlineAvailable')} — {t('duas.offlineInfo')}
            </ThemedText>
          </View>
        </>
      )}
    </Screen>
  );
}
