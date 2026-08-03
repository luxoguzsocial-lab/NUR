import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Card } from '@/components/card';
import { ThemedText } from '@/components/themed-text';
import { SourceBadge } from '@/components/ui-bits';
import { Radius, Spacing } from '@/constants/theme';
import { TAJWEED_RULES, TAJWEED_SOURCE, TAJWEED_VERIFIED } from '@/data/tajweed-guide';
import { useTheme, useThemeMode } from '@/hooks/use-theme';

interface Props {
  /** Renk körlüğü modu: renk örneği yerine alt çizgi + kısaltma göster */
  accessibleMarks: boolean;
}

/** Tecvit rehberi kartı — her kuralın rengi/işareti, adı ve kısa açıklaması. */
export function TajweedLegend({ accessibleMarks }: Props) {
  const { t } = useTranslation();
  const theme = useTheme();
  const mode = useThemeMode();

  return (
    <Card style={{ gap: Spacing.sm }}>
      <ThemedText variant="heading">{t('quran.reader.tajweedGuide')}</ThemedText>
      <ThemedText variant="caption">{t('quran.reader.tajweedGuideHint')}</ThemedText>
      {TAJWEED_RULES.map((rule) => (
        <View
          key={rule.rule}
          style={{ flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm }}
        >
          {accessibleMarks ? (
            <View
              style={{
                minWidth: 40,
                borderRadius: Radius.sm,
                backgroundColor: theme.surfaceAlt,
                paddingHorizontal: Spacing.xs,
                paddingVertical: 2,
                alignItems: 'center',
              }}
            >
              <ThemedText variant="caption" style={{ textDecorationLine: 'underline' }}>
                {rule.shortCode}
              </ThemedText>
            </View>
          ) : (
            <View
              style={{
                width: 16,
                height: 16,
                borderRadius: Radius.full,
                backgroundColor: rule.color[mode],
                marginTop: 2,
              }}
            />
          )}
          <View style={{ flex: 1 }}>
            <ThemedText variant="label">{rule.name}</ThemedText>
            <ThemedText variant="caption">{rule.description}</ThemedText>
          </View>
        </View>
      ))}
      <SourceBadge source={TAJWEED_SOURCE} verified={TAJWEED_VERIFIED} />
    </Card>
  );
}
