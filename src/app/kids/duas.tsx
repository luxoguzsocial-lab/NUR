import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { SourceBadge } from '@/components/ui-bits';
import { Radius, Spacing } from '@/constants/theme';
import { KIDS_DUA_IDS } from '@/data/elifba';
import { DUAS } from '@/data/duas';
import { BESMELE_ARABIC, BESMELE_TRANSLITERATION } from '@/data/quran-text';
import { speakArabic } from '@/lib/arabic-speech';
import { useTheme } from '@/hooks/use-theme';

export default function KidsDuasScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const duas = KIDS_DUA_IDS.map((id) => DUAS.find((d) => d.id === id)).filter(
    (d): d is (typeof DUAS)[number] => !!d,
  );

  // Dualar Arapça aslından, Arap telaffuzuyla okunur; cihazda Arapça
  // ses yoksa okunuş metnine düşer (buton sessiz kalmaz)
  const speak = (arabic: string, reading: string) => void speakArabic(arabic, reading, 0.75);

  return (
    <Screen>
      <Stack.Screen options={{ title: t('kids.sectionDuas') }} />

      {/* Besmele kartı */}
      <Card tone="primary" style={{ marginTop: Spacing.md, gap: Spacing.sm, alignItems: 'center' }}>
        <ThemedText variant="heading">{t('kids.duaBesmeleTitle')}</ThemedText>
        <ThemedText variant="arabic" style={{ fontSize: 30, lineHeight: 52, textAlign: 'center' }}>
          {BESMELE_ARABIC}
        </ThemedText>
        <View
          style={{
            backgroundColor: theme.primarySoft,
            borderRadius: Radius.md,
            padding: Spacing.md,
            alignSelf: 'stretch',
          }}
        >
          <ThemedText style={{ fontStyle: 'italic', textAlign: 'center' }}>
            {BESMELE_TRANSLITERATION}
          </ThemedText>
        </View>
        <ThemedText variant="secondary" style={{ textAlign: 'center' }}>
          {t('kids.duaBesmeleWhen')}
        </ThemedText>
        <Button
          title={t('kids.listen')}
          variant="secondary"
          onPress={() => speak(BESMELE_ARABIC, BESMELE_TRANSLITERATION)}
          style={{ alignSelf: 'stretch' }}
        />
      </Card>

      {duas.map((dua) => (
        <Card key={dua.id} style={{ marginTop: Spacing.md, gap: Spacing.sm }}>
          <ThemedText variant="heading">{dua.titleTr}</ThemedText>
          <ThemedText variant="arabic" style={{ fontSize: 26, lineHeight: 46 }}>
            {dua.arabic}
          </ThemedText>
          <View
            style={{
              backgroundColor: theme.primarySoft,
              borderRadius: Radius.md,
              padding: Spacing.md,
            }}
          >
            <ThemedText style={{ fontStyle: 'italic' }}>{dua.transliteration}</ThemedText>
          </View>
          <View style={{ gap: 2 }}>
            <ThemedText variant="caption">{t('kids.surahMeaning')}</ThemedText>
            <ThemedText variant="secondary">{dua.meaningTr}</ThemedText>
          </View>
          <Button
            title={t('kids.listen')}
            variant="secondary"
            onPress={() => speak(dua.arabic, dua.transliteration)}
          />
          <SourceBadge source={dua.source} verified={dua.verified} />
        </Card>
      ))}
    </Screen>
  );
}
