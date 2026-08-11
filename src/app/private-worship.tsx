import { Ionicons } from '@expo/vector-icons';
import { Redirect, router, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Switch, View } from 'react-native';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { SectionHeader, type IconName } from '@/components/ui-bits';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { confirmDialog } from '@/lib/dialogs';
import { formatDateLong, todayISO } from '@/lib/format';
import {
  getActiveExemptionPeriod,
  isPrivateWorshipActive,
  usePrivateWorshipStore,
} from '@/store/private-worship';
import { useSettingsStore } from '@/store/settings';

function SuggestionCard({
  icon,
  title,
  subtitle,
  onPress,
}: {
  icon: IconName;
  title: string;
  subtitle: string;
  onPress: () => void;
}) {
  const theme = useTheme();
  return (
    <Card onPress={onPress} style={{ flex: 1, minWidth: '47%', gap: Spacing.xs }}>
      <Ionicons name={icon} size={22} color={theme.primary} />
      <ThemedText variant="label">{title}</ThemedText>
      <ThemedText variant="caption">{subtitle}</ThemedText>
    </Card>
  );
}

export default function PrivateWorshipScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const language = useSettingsStore((state) => state.language);
  const gender = useSettingsStore((state) => state.gender);
  const privateWorship = usePrivateWorshipStore();
  const active = isPrivateWorshipActive(privateWorship);
  const activePeriod = getActiveExemptionPeriod(privateWorship);
  const now = new Date();
  const today = todayISO(now);
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  const currentWeekStart = todayISO(monday);

  const startDateLabel = activePeriod
    ? formatDateLong(new Date(`${activePeriod.startDate}T12:00:00`), language)
    : '';

  // Onboarding'de erkek seçildiyse bu ekran arayüzde hiç sunulmaz
  if (gender === 'male') return <Redirect href="/settings" />;

  const resetHistory = () => {
    confirmDialog(
      t('common.confirmDeleteTitle'),
      t('privateWorship.resetConfirm'),
      t('common.delete'),
      () => privateWorship.clearClosedPeriods(currentWeekStart),
      t('common.cancel'),
    );
  };

  return (
    <Screen>
      <Stack.Screen options={{ title: t('privateWorship.title') }} />

      <Card tone={active ? 'accent' : 'surface'}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: active ? theme.accentSoft : theme.primarySoft,
            }}
          >
            <Ionicons
              name={active ? 'pause' : 'shield-checkmark-outline'}
              size={23}
              color={active ? theme.accent : theme.primary}
            />
          </View>
          <View style={{ flex: 1 }}>
            <ThemedText variant="heading">
              {active ? t('privateWorship.activeTitle') : t('privateWorship.inactiveTitle')}
            </ThemedText>
            <ThemedText variant="caption">
              {active
                ? t('privateWorship.activeSince', { date: startDateLabel })
                : t('privateWorship.inactiveBody')}
            </ThemedText>
          </View>
        </View>
        <Button
          title={active ? t('privateWorship.finish') : t('privateWorship.start')}
          variant={active ? 'secondary' : 'primary'}
          onPress={() =>
            active
              ? privateWorship.endExemption(today)
              : privateWorship.startExemption(today)
          }
          style={{ marginTop: Spacing.md }}
        />
      </Card>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, marginTop: Spacing.sm }}>
        <Ionicons name="lock-closed-outline" size={14} color={theme.success} />
        <ThemedText variant="caption" color={theme.success} style={{ flex: 1 }}>
          {t('privateWorship.localOnly')}
        </ThemedText>
      </View>

      <SectionHeader title={t('privateWorship.automaticTitle')} />
      <Card>
        {[
          t('privateWorship.pauseTracking'),
          t('privateWorship.protectConsistency'),
          t('privateWorship.hidePrayerTask'),
        ].map((label) => (
          <View key={label} style={{ flexDirection: 'row', gap: Spacing.sm, paddingVertical: Spacing.xs }}>
            <Ionicons name="checkmark-circle" size={18} color={theme.success} />
            <ThemedText style={{ flex: 1 }}>{label}</ThemedText>
          </View>
        ))}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: Spacing.md,
            borderTopWidth: 1,
            borderTopColor: theme.border,
            marginTop: Spacing.sm,
            paddingTop: Spacing.md,
          }}
        >
          <View style={{ flex: 1 }}>
            <ThemedText variant="label">{t('privateWorship.muteNotifications')}</ThemedText>
            <ThemedText variant="caption">{t('privateWorship.muteNotificationsInfo')}</ThemedText>
          </View>
          <Switch
            value={privateWorship.mutePrayerNotifications}
            onValueChange={privateWorship.setMutePrayerNotifications}
            trackColor={{ true: theme.primary, false: theme.surfaceAlt }}
          />
        </View>
      </Card>

      <SectionHeader title={t('privateWorship.suggestionsTitle')} />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm }}>
        <SuggestionCard
          icon="heart-outline"
          title={t('privateWorship.duaSuggestion')}
          subtitle={t('privateWorship.duaSuggestionInfo')}
          onPress={() => router.push('/duas/kurandan')}
        />
        <SuggestionCard
          icon="ellipse-outline"
          title={t('privateWorship.dhikrSuggestion')}
          subtitle={t('privateWorship.dhikrSuggestionInfo')}
          onPress={() => router.push('/(tabs)/zikir')}
        />
        <SuggestionCard
          icon="headset-outline"
          title={t('privateWorship.listenSuggestion')}
          subtitle={t('privateWorship.listenSuggestionInfo')}
          onPress={() => router.push('/quran/surah/1')}
        />
        <SuggestionCard
          icon="book-outline"
          title={t('privateWorship.quranSuggestion')}
          subtitle={t('privateWorship.quranSuggestionInfo')}
          onPress={() => router.push('/(tabs)/quran')}
        />
      </View>

      <Card tone="primary" style={{ marginTop: Spacing.lg }}>
        <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
          <Ionicons name="information-circle-outline" size={20} color={theme.primary} />
          <ThemedText variant="caption" style={{ flex: 1 }}>
            {t('privateWorship.religiousNote')}
          </ThemedText>
        </View>
      </Card>

      {privateWorship.periods.some((period) => period.endDate !== null) ? (
        <Button
          title={t('privateWorship.clearHistory')}
          variant="ghost"
          onPress={resetHistory}
          style={{ marginTop: Spacing.md }}
        />
      ) : null}
    </Screen>
  );
}
