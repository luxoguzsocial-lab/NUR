import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Switch, View } from 'react-native';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Chip, SectionHeader } from '@/components/ui-bits';
import { FontSize, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { confirmDialog } from '@/lib/dialogs';
import { applyLanguage } from '@/i18n';
import { useAiStore, useMediaStore } from '@/store/media';
import { useNotificationStore } from '@/store/notifications';
import { isPrivateWorshipActive, usePrivateWorshipStore } from '@/store/private-worship';
import { useProgressStore } from '@/store/progress';
import { useSavedStore } from '@/store/saved';
import {
  useSettingsStore,
  type CalcMethodId,
  type Language,
  type MadhabId,
  type ThemePref,
} from '@/store/settings';
import { useTasbihStore } from '@/store/tasbih';
import { useTrackerStore } from '@/store/tracker';
import { useTravelStore } from '@/store/travel';

const METHODS: CalcMethodId[] = ['diyanet', 'mwl', 'ummalqura', 'isna'];

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: Spacing.sm,
        gap: Spacing.md,
      }}
    >
      <ThemedText style={{ flex: 1 }}>{label}</ThemedText>
      {children}
    </View>
  );
}

export default function SettingsScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const settings = useSettingsStore();
  const privateWorship = usePrivateWorshipStore();
  const travel = useTravelStore();
  const ai = useAiStore();
  const [exported, setExported] = useState(false);
  const [aiCleared, setAiCleared] = useState(false);

  const exportData = async () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      settings: {
        language: settings.language,
        theme: settings.theme,
        location: settings.location,
        calcMethod: settings.calcMethod,
        madhab: settings.madhab,
      },
      progress: useProgressStore.getState(),
      saved: useSavedStore.getState().items,
      tracker: useTrackerStore.getState().days,
      tasbih: useTasbihStore.getState().dailyHistory,
    };
    await Clipboard.setStringAsync(JSON.stringify(payload, null, 2));
    setExported(true);
  };

  const deleteAllData = () => {
    confirmDialog(t('common.confirmDeleteTitle'), t('settings.deleteAllConfirm'), t('common.delete'), () => {
          useProgressStore.getState().resetAll();
          useSavedStore.getState().resetAll();
          useTrackerStore.getState().resetAll();
          useAiStore.getState().clearHistory();
          useMediaStore.getState().clearHistory();
          useNotificationStore.getState().clearAll();
          usePrivateWorshipStore.getState().resetAll();
          useTravelStore.getState().resetAll();
          settings.resetAll();
          void AsyncStorage.clear().then(() => router.replace('/onboarding'));
        }, t('common.cancel'));
  };

  return (
    <Screen>
      {/* Dil ve tema */}
      <SectionHeader title={t('settings.language')} />
      <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
        {(['tr', 'en', 'ar'] as Language[]).map((lang) => (
          <Chip
            key={lang}
            label={t(`settings.languageNames.${lang}`)}
            selected={settings.language === lang}
            onPress={() => {
              settings.set('language', lang);
              applyLanguage(lang);
            }}
          />
        ))}
      </View>
      {settings.language === 'ar' ? (
        <ThemedText variant="caption" style={{ marginTop: Spacing.xs }}>
          {t('settings.rtlNote')}
        </ThemedText>
      ) : null}

      <SectionHeader title={t('settings.smartModes')} />
      <View style={{ gap: Spacing.sm }}>
        {/* Cinsiyet onboarding'de sorulur; erkek seçildiyse bu giriş görünmez */}
        {settings.gender !== 'male' ? (
        <Card onPress={() => router.push('/private-worship')}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
            <Ionicons name="shield-checkmark-outline" size={21} color={theme.primary} />
            <View style={{ flex: 1 }}>
              <ThemedText variant="label">{t('privateWorship.title')}</ThemedText>
              <ThemedText variant="caption">
                {t(isPrivateWorshipActive(privateWorship) ? 'privateWorship.activeTitle' : 'privateWorship.localOnly')}
              </ThemedText>
            </View>
            <Ionicons name="chevron-forward" size={17} color={theme.textSecondary} />
          </View>
        </Card>
        ) : null}
        <Card onPress={() => router.push('/travel')}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
            <Ionicons name="airplane-outline" size={21} color={theme.primary} />
            <View style={{ flex: 1 }}>
              <ThemedText variant="label">{t('travel.title')}</ThemedText>
              <ThemedText variant="caption">
                {t(travel.active ? 'travel.activeTitle' : 'travel.inactiveBody')}
              </ThemedText>
            </View>
            <Ionicons name="chevron-forward" size={17} color={theme.textSecondary} />
          </View>
        </Card>
      </View>

      <SectionHeader title={t('settings.theme')} />
      <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
        {(
          [
            ['system', t('settings.themeSystem')],
            ['light', t('settings.themeLight')],
            ['dark', t('settings.themeDark')],
          ] as [ThemePref, string][]
        ).map(([value, label]) => (
          <Chip
            key={value}
            label={label}
            selected={settings.theme === value}
            onPress={() => settings.set('theme', value)}
          />
        ))}
      </View>

      {/* Konum ve namaz */}
      <SectionHeader title={t('settings.location')} />
      <Card onPress={() => router.push('/(tabs)/prayer')}>
        <ThemedText>
          {settings.location.cityName}
          {settings.location.districtName ? ` / ${settings.location.districtName}` : ''}
        </ThemedText>
        <ThemedText variant="caption">{t('prayerTimes.changeLocation')} →</ThemedText>
      </Card>

      <SectionHeader title={t('settings.prayerCalc')} />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm }}>
        {METHODS.map((m) => (
          <Chip
            key={m}
            label={t(`prayerTimes.methodNames.${m}`)}
            selected={settings.calcMethod === m}
            onPress={() => settings.set('calcMethod', m)}
          />
        ))}
      </View>
      <View style={{ flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.sm }}>
        {(['hanafi', 'shafi'] as MadhabId[]).map((m) => (
          <Chip
            key={m}
            label={m === 'hanafi' ? t('onboarding.madhhabHanafi') : t('onboarding.madhhabStandard')}
            selected={settings.madhab === m}
            onPress={() => settings.set('madhab', m)}
          />
        ))}
      </View>

      {/* Dakika düzeltmeleri */}
      <SectionHeader title={t('prayerTimes.adjustments')} />
      <Card>
        <ThemedText variant="caption" style={{ marginBottom: Spacing.sm }}>
          {t('prayerTimes.adjustmentInfo')}
        </ThemedText>
        {(['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'] as const).map((p) => (
          <Row key={p} label={t(`prayers.${p}`)}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
              <Chip label="−1" onPress={() => settings.setAdjustment(p, settings.adjustments[p] - 1)} />
              <ThemedText style={{ width: 40, textAlign: 'center' }}>
                {settings.adjustments[p] > 0 ? '+' : ''}
                {settings.adjustments[p]}
              </ThemedText>
              <Chip label="+1" onPress={() => settings.setAdjustment(p, settings.adjustments[p] + 1)} />
            </View>
          </Row>
        ))}
      </Card>

      {/* Bildirimler */}
      <SectionHeader title={t('settings.prayerNotifications')} />
      <Card>
        <Row label={t('settings.prayerNotifications')}>
          <Switch
            value={settings.notifications.prayersEnabled}
            onValueChange={(v) => settings.setNotification('prayersEnabled', v)}
            trackColor={{ true: theme.primary, false: theme.surfaceAlt }}
          />
        </Row>
        <Row label={t('settings.reminderBefore')}>
          <View style={{ flexDirection: 'row', gap: Spacing.xs }}>
            {[0, 5, 10, 15].map((m) => (
              <Chip
                key={m}
                label={`${m} ${t('common.minuteShort')}`}
                selected={settings.notifications.reminderMinutesBefore === m}
                onPress={() => settings.setNotification('reminderMinutesBefore', m)}
              />
            ))}
          </View>
        </Row>
        <Row label={t('settings.adhanSound')}>
          <View style={{ flexDirection: 'row', gap: Spacing.xs }}>
            {(
              [
                ['default', t('settings.adhanDefault')],
                ['silent', t('settings.adhanSilent')],
                ['beep', t('settings.adhanBeep')],
              ] as ['default' | 'silent' | 'beep', string][]
            ).map(([value, label]) => (
              <Chip
                key={value}
                label={label}
                selected={settings.notifications.adhanSound === value}
                onPress={() => settings.setNotification('adhanSound', value)}
              />
            ))}
          </View>
        </Row>
      </Card>

      {/* Yumuşak devamlılık */}
      <SectionHeader title={t('settings.gentleJourney')} />
      <Card>
        <Row label={t('settings.weeklyJourneyGoal')}>
          <View style={{ flexDirection: 'row', gap: Spacing.xs }}>
            {[3, 4, 5].map((days) => (
              <Chip
                key={days}
                label={`${days} ${t('home.consistency.days')}`}
                selected={settings.weeklyJourneyGoalDays === days}
                onPress={() => settings.set('weeklyJourneyGoalDays', days)}
              />
            ))}
          </View>
        </Row>
        <ThemedText variant="caption">{t('settings.weeklyJourneyInfo')}</ThemedText>
      </Card>

      {/* Kur'an görünümü */}
      <SectionHeader title={t('settings.quranDisplay')} />
      <Card>
        <Row label={`${t('settings.fontSize')} (${settings.quran.fontSize})`}>
          <View style={{ flexDirection: 'row', gap: Spacing.xs }}>
            {[FontSize.arabicMin, FontSize.arabicDefault, 32, FontSize.arabicMax].map((size) => (
              <Chip
                key={size}
                label={String(size)}
                selected={settings.quran.fontSize === size}
                onPress={() => settings.setQuranPref('fontSize', size)}
              />
            ))}
          </View>
        </Row>
        <Row label={t('settings.lineHeight')}>
          <View style={{ flexDirection: 'row', gap: Spacing.xs }}>
            {[1.5, 1.8, 2.2].map((lh) => (
              <Chip
                key={lh}
                label={`${lh}×`}
                selected={settings.quran.lineHeightMultiplier === lh}
                onPress={() => settings.setQuranPref('lineHeightMultiplier', lh)}
              />
            ))}
          </View>
        </Row>
        <Row label={t('settings.arabicFont')}>
          <View style={{ flexDirection: 'row', gap: Spacing.xs }}>
            {(['system', 'serif'] as const).map((f) => (
              <Chip
                key={f}
                label={f === 'system' ? 'Sistem' : 'Serif'}
                selected={settings.quran.arabicFont === f}
                onPress={() => settings.setQuranPref('arabicFont', f)}
              />
            ))}
          </View>
        </Row>
        <Row label={t('settings.showTranslation')}>
          <Switch
            value={settings.quran.showTranslation}
            onValueChange={(v) => settings.setQuranPref('showTranslation', v)}
            trackColor={{ true: theme.primary, false: theme.surfaceAlt }}
          />
        </Row>
        <Row label={t('settings.showTransliteration')}>
          <Switch
            value={settings.quran.showTransliteration}
            onValueChange={(v) => settings.setQuranPref('showTransliteration', v)}
            trackColor={{ true: theme.primary, false: theme.surfaceAlt }}
          />
        </Row>
      </Card>

      {/* Medya */}
      <SectionHeader title={t('settings.videoAutoplay')} />
      <Card>
        <Row label={t('settings.videoAutoplay')}>
          <Switch
            value={settings.videoAutoplay}
            onValueChange={(v) => settings.set('videoAutoplay', v)}
            trackColor={{ true: theme.primary, false: theme.surfaceAlt }}
          />
        </Row>
        <Row label={t('settings.playbackSpeed')}>
          <View style={{ flexDirection: 'row', gap: Spacing.xs }}>
            {[0.75, 1, 1.25, 1.5].map((speed) => (
              <Chip
                key={speed}
                label={`${speed}×`}
                selected={settings.playbackSpeed === speed}
                onPress={() => settings.set('playbackSpeed', speed)}
              />
            ))}
          </View>
        </Row>
        <Row label={t('settings.dataSaver')}>
          <Switch
            value={settings.dataSaver}
            onValueChange={(v) => settings.set('dataSaver', v)}
            trackColor={{ true: theme.primary, false: theme.surfaceAlt }}
          />
        </Row>
      </Card>
      <ThemedText variant="caption" style={{ marginTop: Spacing.xs }}>
        {t('settings.downloadsInfo')}
      </ThemedText>

      {/* AI ve gizlilik */}
      <SectionHeader title={t('settings.aiHistory')} />
      <Card>
        <Row label={t('settings.aiHistoryKeep')}>
          <Switch
            value={settings.aiHistoryEnabled}
            onValueChange={(v) => settings.set('aiHistoryEnabled', v)}
            trackColor={{ true: theme.primary, false: theme.surfaceAlt }}
          />
        </Row>
        <Button
          title={t('settings.aiHistoryClear')}
          variant="secondary"
          onPress={() => {
            ai.clearHistory();
            setAiCleared(true);
          }}
        />
        {aiCleared ? (
          <ThemedText variant="caption" color={theme.success} style={{ marginTop: Spacing.xs }}>
            ✓ {t('settings.aiHistoryCleared')}
          </ThemedText>
        ) : null}
      </Card>

      <SectionHeader title={t('settings.analytics')} />
      <Card>
        <Row label={t('settings.analytics')}>
          <Switch
            value={settings.analyticsEnabled}
            onValueChange={(v) => settings.set('analyticsEnabled', v)}
            trackColor={{ true: theme.primary, false: theme.surfaceAlt }}
          />
        </Row>
        <ThemedText variant="caption">{t('settings.analyticsInfo')}</ThemedText>
      </Card>

      {/* Veri yönetimi */}
      <SectionHeader title={t('settings.exportData')} />
      <View style={{ gap: Spacing.sm }}>
        <Button title={t('settings.exportData')} variant="secondary" onPress={() => void exportData()} />
        {exported ? (
          <ThemedText variant="caption" color={theme.success}>
            ✓ {t('settings.exportDone')}
          </ThemedText>
        ) : null}
        <Button title={t('settings.deleteAllData')} variant="danger" onPress={deleteAllData} />
        <ThemedText variant="caption">{t('settings.noAccountInfo')}</ThemedText>
      </View>
    </Screen>
  );
}
