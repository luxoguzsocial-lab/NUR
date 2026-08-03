import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { Card } from '@/components/card';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { SectionHeader } from '@/components/ui-bits';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { formatDateLong } from '@/lib/format';
import { formatHijri, toHijri } from '@/lib/hijri';
import { upcomingReligiousDays } from '@/lib/religious-days';
import { useNotificationStore } from '@/store/notifications';
import { useSettingsStore } from '@/store/settings';

export default function CalendarScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const language = useSettingsStore((s) => s.language);
  const pushNotification = useNotificationStore((s) => s.push);
  const [reminded, setReminded] = useState<Record<string, boolean>>({});
  const now = useMemo(() => new Date(), []);
  const hijri = toHijri(now);
  const upcoming = useMemo(() => upcomingReligiousDays(now, 12), [now]);

  return (
    <Screen>
      <Card tone="primary">
        <ThemedText variant="caption">{t('calendar.hijriToday')}</ThemedText>
        <ThemedText variant="title" color={theme.primary}>
          {formatHijri(hijri, language)}
        </ThemedText>
        <ThemedText variant="secondary">{formatDateLong(now, language)}</ThemedText>
      </Card>

      <Card tone="accent" style={{ marginTop: Spacing.sm }}>
        <View style={{ flexDirection: 'row', gap: Spacing.sm, alignItems: 'flex-start' }}>
          <Ionicons name="information-circle-outline" size={18} color={theme.accent} />
          <ThemedText variant="caption" style={{ flex: 1 }}>
            {t('calendar.regionalNote')}
          </ThemedText>
        </View>
      </Card>

      <SectionHeader title={t('calendar.upcoming')} />
      {upcoming.map((o) => {
        const daysLeft = Math.ceil((o.date.getTime() - now.getTime()) / 86_400_000);
        const key = `${o.id}-${o.hijriYear}`;
        return (
          <Card key={key} style={{ marginBottom: Spacing.sm }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
              <Ionicons
                name={o.type === 'eid' ? 'sparkles-outline' : o.type === 'kandil' ? 'moon-outline' : 'star-outline'}
                size={24}
                color={theme.accent}
              />
              <View style={{ flex: 1 }}>
                <ThemedText variant="heading">{t(`religiousDays.${o.id}.name`)}</ThemedText>
                <ThemedText variant="caption">{formatDateLong(o.date, language)}</ThemedText>
                <ThemedText variant="secondary" style={{ marginTop: Spacing.xs }}>
                  {t(`religiousDays.${o.id}.desc`)}
                </ThemedText>
              </View>
              <ThemedText variant="caption" color={theme.primary}>
                {t('calendar.daysLeft', { count: daysLeft })}
              </ThemedText>
            </View>
            <View style={{ marginTop: Spacing.sm }}>
              {reminded[key] ? (
                <ThemedText variant="caption" color={theme.success}>
                  ✓ {t('calendar.reminderSet')}
                </ThemedText>
              ) : (
                <ThemedText
                  variant="secondary"
                  color={theme.primary}
                  onPress={() => {
                    pushNotification({
                      category: 'religiousDay',
                      title: t(`religiousDays.${o.id}.name`),
                      body: `${formatDateLong(o.date, language)} — ${t('calendar.daysLeft', { count: daysLeft })}`,
                    });
                    setReminded((r) => ({ ...r, [key]: true }));
                  }}
                >
                  + {t('calendar.setReminder')}
                </ThemedText>
              )}
            </View>
          </Card>
        );
      })}
    </Screen>
  );
}
