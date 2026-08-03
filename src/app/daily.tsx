import { Stack } from 'expo-router';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { InspirationCard } from '@/components/content/inspiration-card';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { ESMA_SOURCE } from '@/data/esma';
import { getDailyInspiration } from '@/data/inspiration';
import { formatDateLong } from '@/lib/format';
import { useSettingsStore } from '@/store/settings';

export default function DailyScreen() {
  const { t } = useTranslation();
  const language = useSettingsStore((s) => s.language);
  const daily = useMemo(() => getDailyInspiration(new Date()), []);
  const day = daily.dayOfYear;

  return (
    <Screen>
      <Stack.Screen options={{ title: t('daily.title') }} />
      <ThemedText variant="secondary" style={{ marginBottom: Spacing.md }}>
        {formatDateLong(new Date(), language)}
      </ThemedText>

      <InspirationCard
        icon="book-outline"
        title={t('daily.ayah')}
        text={daily.ayah.text}
        source={daily.ayah.source}
        verified
        refId={`ayah-${day}`}
      />

      <InspirationCard
        icon="chatbox-ellipses-outline"
        title={t('daily.hadith')}
        text={daily.hadith.text}
        source={daily.hadith.source}
        verified
        refId={`hadith-${day}`}
      />

      <InspirationCard
        icon="flower-outline"
        title={t('daily.dua')}
        arabic={daily.dua.arabic}
        subtitle={daily.dua.transliteration}
        text={`${daily.dua.titleTr}: ${daily.dua.meaningTr}`}
        source={daily.dua.source}
        verified={daily.dua.verified}
        refId={`dua-${day}`}
      />

      <InspirationCard
        icon="star-outline"
        title={t('daily.esma')}
        arabic={daily.esma.arabic}
        subtitle={`${daily.esma.transliteration} — ${daily.esma.meaningTr}`}
        text={daily.esma.description}
        source={ESMA_SOURCE}
        verified
        refId={`esma-${day}`}
      />

      <InspirationCard
        icon="chatbubbles-outline"
        title={t('daily.quote')}
        subtitle={daily.quote.author}
        text={daily.quote.text}
        source={daily.quote.source}
        refId={`quote-${day}`}
      />

      <InspirationCard
        icon="help-circle-outline"
        title={t('daily.reflection')}
        text={daily.reflection.text}
        source={daily.reflection.source}
        refId={`reflection-${day}`}
      />

      <InspirationCard
        icon="bulb-outline"
        title={t('daily.fact')}
        text={daily.fact.text}
        source={daily.fact.source}
        verified
        refId={`fact-${day}`}
      />
    </Screen>
  );
}
