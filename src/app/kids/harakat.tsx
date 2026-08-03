import * as Haptics from 'expo-haptics';
import * as Speech from 'expo-speech';
import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { ProgressBar } from '@/components/ui-bits';
import { Radius, Spacing } from '@/constants/theme';
import { HARAKAT } from '@/data/elifba';
import { useTheme } from '@/hooks/use-theme';
import { useKidsStore } from '@/store/kids';

export default function HarakatScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const learned = useKidsStore((s) => s.learnedHarakat);
  const toggleHaraka = useKidsStore((s) => s.toggleHaraka);

  const speak = (text: string) => {
    Speech.stop();
    Speech.speak(text, { language: 'tr-TR', rate: 0.85 });
  };

  return (
    <Screen>
      <Stack.Screen options={{ title: t('kids.sectionHarakat') }} />

      <ProgressBar ratio={learned.length / HARAKAT.length} style={{ marginTop: Spacing.sm }} />
      <ThemedText variant="caption" style={{ marginTop: Spacing.xs }}>
        {t('kids.progressLine', { done: learned.length, total: HARAKAT.length })}
      </ThemedText>
      {learned.length >= HARAKAT.length ? (
        <Card tone="primary" style={{ marginTop: Spacing.sm }}>
          <ThemedText variant="label" color={theme.primary}>
            {t('kids.allDone')}
          </ThemedText>
        </Card>
      ) : null}

      <View style={{ marginTop: Spacing.md, gap: Spacing.md }}>
        {HARAKAT.map((h) => {
          const done = learned.includes(h.name);
          return (
            <Card key={h.name} style={{ gap: Spacing.sm }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
                <View
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: Radius.xl,
                    backgroundColor: theme.primarySoft,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ThemedText variant="arabic" style={{ fontSize: 40, lineHeight: 62 }}>
                    {h.sample}
                  </ThemedText>
                </View>
                <View style={{ flex: 1 }}>
                  <ThemedText variant="heading">
                    {h.turkishName}
                    {h.turkishName !== h.name ? ` (${h.name})` : ''}
                  </ThemedText>
                  <ThemedText variant="secondary">{h.description}</ThemedText>
                  <ThemedText variant="caption" color={theme.primary} style={{ marginTop: 2 }}>
                    {t('kids.harakaReading', { reading: h.reading })}
                  </ThemedText>
                </View>
              </View>
              <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
                <Button
                  title={t('kids.listen')}
                  variant="secondary"
                  onPress={() => speak(`${h.turkishName}. ${h.reading}`)}
                  style={{ flex: 1 }}
                />
                <Button
                  title={done ? t('kids.learnedUndo') : t('kids.learned')}
                  variant={done ? 'secondary' : 'primary'}
                  onPress={() => {
                    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                    toggleHaraka(h.name);
                  }}
                  style={{ flex: 1 }}
                />
              </View>
            </Card>
          );
        })}
      </View>
    </Screen>
  );
}
