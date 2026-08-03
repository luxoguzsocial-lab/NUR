import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TextInput, View } from 'react-native';

import { Card } from '@/components/card';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Chip, EmptyState } from '@/components/ui-bits';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { formatDateShort } from '@/lib/format';
import { useSavedStore, type SavedType } from '@/store/saved';
import { useSettingsStore } from '@/store/settings';

const TYPES: SavedType[] = ['ayah', 'dua', 'video', 'aiAnswer', 'lesson', 'inspiration', 'esma'];

const TYPE_ICONS: Record<SavedType, keyof typeof Ionicons.glyphMap> = {
  ayah: 'book-outline',
  dua: 'heart-outline',
  video: 'play-circle-outline',
  aiAnswer: 'chatbubble-ellipses-outline',
  lesson: 'school-outline',
  inspiration: 'sunny-outline',
  esma: 'star-outline',
};

export default function SavedScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const saved = useSavedStore();
  const language = useSettingsStore((s) => s.language);
  const [filter, setFilter] = useState<SavedType | null>(null);
  const [query, setQuery] = useState('');

  const items = useMemo(
    () =>
      saved.items.filter(
        (i) =>
          (!filter || i.type === filter) &&
          (!query.trim() ||
            i.title.toLowerCase().includes(query.trim().toLowerCase()) ||
            (i.preview ?? '').toLowerCase().includes(query.trim().toLowerCase())),
      ),
    [saved.items, filter, query],
  );

  return (
    <Screen>
      <TextInput
        placeholder={t('common.search')}
        placeholderTextColor={theme.textSecondary}
        value={query}
        onChangeText={setQuery}
        style={{
          backgroundColor: theme.surface,
          borderRadius: Radius.md,
          borderWidth: 1,
          borderColor: theme.border,
          padding: Spacing.sm + 2,
          color: theme.text,
        }}
      />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginTop: Spacing.md }}>
        <Chip label={t('common.all')} selected={filter === null} onPress={() => setFilter(null)} />
        {TYPES.map((type) => (
          <Chip
            key={type}
            label={t(`saved.types.${type}`)}
            selected={filter === type}
            onPress={() => setFilter(filter === type ? null : type)}
          />
        ))}
      </View>

      {items.length === 0 ? (
        <EmptyState icon="bookmark-outline" message={t('saved.emptyState')} />
      ) : (
        <View style={{ marginTop: Spacing.md, gap: Spacing.sm }}>
          {items.map((item) => (
            <Card key={item.id}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md }}>
                <Ionicons name={TYPE_ICONS[item.type]} size={22} color={theme.primary} />
                <View style={{ flex: 1 }}>
                  <ThemedText variant="heading">{item.title}</ThemedText>
                  {item.preview ? (
                    <ThemedText variant="secondary" numberOfLines={3}>
                      {item.preview}
                    </ThemedText>
                  ) : null}
                  <View style={{ flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.xs, alignItems: 'center' }}>
                    <ThemedText variant="caption">
                      {t(`saved.types.${item.type}`)} · {formatDateShort(new Date(item.savedAt), language)}
                    </ThemedText>
                    {item.offline ? (
                      <ThemedText variant="caption" color={theme.success}>
                        ✓ {t('common.offlineAvailable')}
                      </ThemedText>
                    ) : null}
                  </View>
                </View>
                <Ionicons
                  name="trash-outline"
                  size={18}
                  color={theme.textSecondary}
                  onPress={() => saved.remove(item.id)}
                />
              </View>
            </Card>
          ))}
        </View>
      )}
    </Screen>
  );
}
