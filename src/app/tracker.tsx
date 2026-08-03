import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Chip, ProgressBar } from '@/components/ui-bits';
import { Spacing } from '@/constants/theme';
import { confirmDialog } from '@/lib/dialogs';
import { useTheme } from '@/hooks/use-theme';
import { formatDateShort, todayISO } from '@/lib/format';
import { useProgressStore } from '@/store/progress';
import { useSettingsStore } from '@/store/settings';
import { useTrackerStore, type TrackedPrayer } from '@/store/tracker';

const TRACKED: TrackedPrayer[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

export default function TrackerScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const settings = useSettingsStore();
  const tracker = useTrackerStore();
  const progress = useProgressStore();
  const [view, setView] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const now = useMemo(() => new Date(), []);
  const dateISO = todayISO(now);

  if (!settings.trackerEnabled) {
    return (
      <Screen>
        <Card>
          <ThemedText variant="heading">{t('tracker.disabled')}</ThemedText>
          <ThemedText variant="secondary" style={{ marginVertical: Spacing.sm }}>
            {t('tracker.subtitle')}
          </ThemedText>
          <Button title={t('tracker.enable')} onPress={() => settings.set('trackerEnabled', true)} />
        </Card>
      </Screen>
    );
  }

  const dayRecord = tracker.days[dateISO] ?? { prayers: {} };
  const doneCount = TRACKED.filter((p) => dayRecord.prayers[p]).length;

  const rangeDays = (count: number) => {
    const days: string[] = [];
    for (let i = count - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      days.push(todayISO(d));
    }
    return days;
  };

  const renderRange = (count: number) => {
    const days = rangeDays(count);
    return (
      <Card style={{ marginTop: Spacing.md }}>
        {days.map((iso) => {
          const rec = tracker.days[iso] ?? { prayers: {} };
          const done = TRACKED.filter((p) => rec.prayers[p]).length;
          const d = new Date(iso);
          return (
            <View
              key={iso}
              style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingVertical: Spacing.xs }}
            >
              <ThemedText variant="caption" style={{ width: 64 }}>
                {formatDateShort(d, settings.language)}
              </ThemedText>
              <ProgressBar ratio={done / TRACKED.length} style={{ flex: 1 }} />
              <ThemedText variant="caption" style={{ width: 40, textAlign: 'right' }}>
                {done}/{TRACKED.length}
              </ThemedText>
              {rec.fasting ? <Ionicons name="moon-outline" size={14} color={theme.accent} /> : null}
            </View>
          );
        })}
      </Card>
    );
  };

  return (
    <Screen>
      <ThemedText variant="secondary">{t('tracker.subtitle')}</ThemedText>

      <View style={{ flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.md }}>
        <Chip label={t('tracker.daily')} selected={view === 'daily'} onPress={() => setView('daily')} />
        <Chip label={t('tracker.weekly')} selected={view === 'weekly'} onPress={() => setView('weekly')} />
        <Chip label={t('tracker.monthly')} selected={view === 'monthly'} onPress={() => setView('monthly')} />
      </View>

      {view === 'daily' ? (
        <>
          {/* Namaz */}
          <Card style={{ marginTop: Spacing.md }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.sm }}>
              <ThemedText variant="heading">{t('home.prayerTracking')}</ThemedText>
              <ThemedText variant="secondary">
                {t('tracker.prayersDone', { done: doneCount, total: TRACKED.length })}
              </ThemedText>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              {TRACKED.map((p) => {
                const done = !!dayRecord.prayers[p];
                return (
                  <Pressable
                    key={p}
                    onPress={() => tracker.togglePrayer(dateISO, p)}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: done }}
                    style={{ alignItems: 'center', gap: Spacing.xs, flex: 1 }}
                  >
                    <Ionicons
                      name={done ? 'checkmark-circle' : 'ellipse-outline'}
                      size={30}
                      color={done ? theme.success : theme.textSecondary}
                    />
                    <ThemedText variant="caption">{t(`prayers.${p}`)}</ThemedText>
                  </Pressable>
                );
              })}
            </View>
          </Card>

          {/* Oruç */}
          <Card style={{ marginTop: Spacing.sm }} onPress={() => tracker.toggleFasting(dateISO)}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
              <Ionicons
                name={dayRecord.fasting ? 'checkmark-circle' : 'ellipse-outline'}
                size={26}
                color={dayRecord.fasting ? theme.success : theme.textSecondary}
              />
              <ThemedText variant="heading">{t('tracker.fasting')}</ThemedText>
            </View>
          </Card>

          {/* Kur'an + zikir özeti */}
          <View style={{ flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.sm }}>
            <Card style={{ flex: 1 }}>
              <ThemedText variant="caption">{t('tracker.quranReading')}</ThemedText>
              <ThemedText variant="heading">
                {progress.quranMinutesByDay[dateISO] ?? 0} {t('common.minuteShort')}
              </ThemedText>
              <ProgressBar
                ratio={(progress.quranMinutesByDay[dateISO] ?? 0) / Math.max(1, settings.dailyQuranGoalMinutes)}
                style={{ marginTop: Spacing.xs }}
              />
            </Card>
            <Card style={{ flex: 1 }}>
              <ThemedText variant="caption">{t('tracker.dhikr')}</ThemedText>
              <ThemedText variant="heading">{dayRecord.dhikrCount ?? 0}</ThemedText>
            </Card>
          </View>
        </>
      ) : (
        renderRange(view === 'weekly' ? 7 : 30)
      )}

      {/* Yönetim */}
      <View style={{ marginTop: Spacing.xl, gap: Spacing.sm }}>
        <Button
          title={t('tracker.resetData')}
          variant="danger"
          onPress={() =>
            confirmDialog(t('common.confirmDeleteTitle'), t('tracker.resetConfirm'), t('common.delete'), () => tracker.resetAll(), t('common.cancel'))
          }
        />
        <Button
          title={t('tracker.disable')}
          variant="secondary"
          onPress={() => settings.set('trackerEnabled', false)}
        />
      </View>
    </Screen>
  );
}
