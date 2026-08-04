import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';

import { Card } from '@/components/card';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { SourceBadge } from '@/components/ui-bits';
import { Radius, Spacing } from '@/constants/theme';
import { HADITHS } from '@/data/hadiths';
import { shareText } from '@/lib/share';
import { useTheme } from '@/hooks/use-theme';
import { useSavedStore } from '@/store/saved';

export default function HadithsScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const saved = useSavedStore();

  return (
    <Screen>
      <Stack.Screen options={{ title: t('hadiths.title') }} />
      <ThemedText variant="secondary" style={{ marginTop: Spacing.sm }}>
        {t('hadiths.subtitle')}
      </ThemedText>
      <View style={{ marginTop: Spacing.md, gap: Spacing.sm }}>
        {HADITHS.map((h, i) => {
          const isSaved = saved.isSaved('inspiration', `hadith-${h.id}`);
          return (
            <Card key={h.id}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
                <View
                  style={{
                    backgroundColor: theme.primarySoft,
                    borderRadius: Radius.full,
                    paddingHorizontal: Spacing.sm,
                    paddingVertical: 2,
                  }}
                >
                  <ThemedText variant="caption" color={theme.primary}>
                    {i + 1} · {h.topic}
                  </ThemedText>
                </View>
              </View>
              <ThemedText style={{ marginVertical: Spacing.sm, fontStyle: 'italic', lineHeight: 23 }}>
                “{h.textTr}”
              </ThemedText>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <SourceBadge source={`${h.source} · ${h.grading}`} verified />
                <View style={{ flexDirection: 'row', gap: Spacing.md }}>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={isSaved ? t('common.remove') : t('common.save')}
                    hitSlop={8}
                    onPress={() =>
                      saved.toggle({
                        type: 'inspiration',
                        refId: `hadith-${h.id}`,
                        title: h.topic,
                        preview: h.textTr,
                        offline: true,
                      })
                    }
                  >
                    <Ionicons
                      name={isSaved ? 'bookmark' : 'bookmark-outline'}
                      size={18}
                      color={theme.primary}
                    />
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={t('common.share')}
                    hitSlop={8}
                    onPress={() => void shareText(`“${h.textTr}”\n— ${h.source} · NUR`)}
                  >
                    <Ionicons name="share-outline" size={18} color={theme.primary} />
                  </Pressable>
                </View>
              </View>
            </Card>
          );
        })}
      </View>
    </Screen>
  );
}
