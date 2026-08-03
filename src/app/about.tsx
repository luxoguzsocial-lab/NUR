import Constants from 'expo-constants';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const SECTIONS = [
  ['purposeTitle', 'purposeBody'],
  ['freeTitle', 'freeBody'],
  ['revenueTitle', 'revenueBody'],
  ['adsTitle', 'adsBody'],
  ['sourcesTitle', 'sourcesBody'],
  ['verificationTitle', 'verificationBody'],
  ['aiTitle', 'aiBody'],
  ['boardTitle', 'boardBody'],
  ['privacyTitle', 'privacyBody'],
  ['licensesTitle', 'licensesBody'],
  ['contactTitle', 'contactBody'],
] as const;

export default function AboutScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const [reportSent, setReportSent] = useState(false);

  return (
    <Screen>
      {SECTIONS.map(([titleKey, bodyKey]) => (
        <Card key={titleKey} style={{ marginBottom: Spacing.sm }}>
          <ThemedText variant="heading">{t(`about.${titleKey}`)}</ThemedText>
          <ThemedText variant="secondary" style={{ marginTop: Spacing.xs }}>
            {t(`about.${bodyKey}`)}
          </ThemedText>
        </Card>
      ))}

      {/* Hata ve yanlış bilgi bildirimi */}
      <Card style={{ marginBottom: Spacing.sm }}>
        <ThemedText variant="heading">{t('about.reportTitle')}</ThemedText>
        <ThemedText variant="secondary" style={{ marginVertical: Spacing.xs }}>
          {t('about.reportBody')}
        </ThemedText>
        {reportSent ? (
          <ThemedText variant="caption" color={theme.success}>
            ✓ {t('common.reportReceived')}
          </ThemedText>
        ) : (
          <Button
            title={t('common.reportError')}
            variant="secondary"
            onPress={() => setReportSent(true)}
          />
        )}
      </Card>

      <View style={{ alignItems: 'center', marginTop: Spacing.md }}>
        <ThemedText variant="caption">
          {t('about.version')}: {Constants.expoConfig?.version ?? '1.0.0'}
        </ThemedText>
      </View>
    </Screen>
  );
}
