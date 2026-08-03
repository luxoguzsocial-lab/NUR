import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { Card } from '@/components/card';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { ProgressBar, SectionHeader } from '@/components/ui-bits';
import { Spacing } from '@/constants/theme';
import { getDailyInspiration } from '@/data/inspiration';
import { useTheme } from '@/hooks/use-theme';
import { formatDateShort, formatRemaining, formatTime, todayISO } from '@/lib/format';
import { hijriMonthLength, hijriToGregorian, isRamadan, toHijri } from '@/lib/hijri';
import { getPrayerTimesForDate } from '@/lib/prayer-times';
import { useProgressStore } from '@/store/progress';
import { useSettingsStore } from '@/store/settings';
import { useTrackerStore } from '@/store/tracker';

export default function RamadanScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const settings = useSettingsStore();
  const tracker = useTrackerStore();
  const progress = useProgressStore();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const hijri = toHijri(now);
  const inRamadan = isRamadan(now);
  const { location, calcMethod, madhab, adjustments, language } = settings;
  const dateISO = todayISO(now);

  const todayTimes = useMemo(
    () =>
      getPrayerTimesForDate(now, location.latitude, location.longitude, calcMethod, madhab, adjustments),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [location, calcMethod, madhab, adjustments, dateISO],
  );

  // İmsakiye: Ramazan'ın tamamı (veya sonraki Ramazan)
  const ramadanYear = inRamadan || hijri.month < 9 ? hijri.year : hijri.year + 1;
  const imsakiye = useMemo(() => {
    const len = hijriMonthLength(ramadanYear, 9);
    const rows: { date: Date; fajr: Date; maghrib: Date }[] = [];
    for (let day = 1; day <= len; day++) {
      const g = hijriToGregorian({ year: ramadanYear, month: 9, day });
      const times = getPrayerTimesForDate(
        g, location.latitude, location.longitude, calcMethod, madhab, adjustments,
      ).times;
      rows.push({ date: g, fajr: times.fajr, maghrib: times.maghrib });
    }
    return rows;
  }, [ramadanYear, location, calcMethod, madhab, adjustments]);

  const eidDate = useMemo(() => hijriToGregorian({ year: ramadanYear, month: 10, day: 1 }), [ramadanYear]);
  const daysToEid = Math.max(0, Math.ceil((eidDate.getTime() - now.getTime()) / 86_400_000));
  const daily = useMemo(() => getDailyInspiration(now), [now]);
  const dayRecord = tracker.days[dateISO] ?? { prayers: {} };
  const readMinutes = progress.quranMinutesByDay[dateISO] ?? 0;
  const qadrDate = useMemo(() => hijriToGregorian({ year: ramadanYear, month: 9, day: 27 }), [ramadanYear]);

  const msToImsak = todayTimes.times.fajr.getTime() - now.getTime();
  const msToIftar = todayTimes.times.maghrib.getTime() - now.getTime();

  return (
    <Screen>
      {!inRamadan ? (
        <Card tone="accent">
          <ThemedText variant="secondary">
            {t('ramadan.title')} — {formatDateShort(imsakiye[0]?.date ?? now, language)}
          </ThemedText>
        </Card>
      ) : (
        <Card tone="primary">
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ flex: 1 }}>
              <ThemedText variant="caption">{t('ramadan.toImsak')}</ThemedText>
              <ThemedText variant="heading" color={theme.primary}>
                {msToImsak > 0 ? formatRemaining(msToImsak, t) : formatTime(todayTimes.times.fajr)}
              </ThemedText>
            </View>
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <ThemedText variant="caption">{t('ramadan.toIftar')}</ThemedText>
              <ThemedText variant="heading" color={theme.accent}>
                {msToIftar > 0 ? formatRemaining(msToIftar, t) : formatTime(todayTimes.times.maghrib)}
              </ThemedText>
            </View>
          </View>
          <ThemedText variant="caption" style={{ marginTop: Spacing.sm }}>
            {hijri.day} {t('ramadan.title')} {hijri.year} · {t('ramadan.toEid')}: {daysToEid} {t('common.day')}
          </ThemedText>
        </Card>
      )}

      {/* Oruç ve teravih takibi */}
      {inRamadan ? (
        <View style={{ flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.sm }}>
          <Card style={{ flex: 1 }} onPress={() => tracker.toggleFasting(dateISO)}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
              <Ionicons
                name={dayRecord.fasting ? 'checkmark-circle' : 'ellipse-outline'}
                size={24}
                color={dayRecord.fasting ? theme.success : theme.textSecondary}
              />
              <ThemedText>{t('ramadan.fastingToday')}</ThemedText>
            </View>
          </Card>
          <Card style={{ flex: 1 }} onPress={() => tracker.togglePrayer(dateISO, 'isha')}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
              <Ionicons name="moon-outline" size={24} color={theme.primary} />
              <View>
                <ThemedText>{t('ramadan.tarawih')}</ThemedText>
                <ThemedText variant="caption">{formatTime(todayTimes.times.isha)}</ThemedText>
              </View>
            </View>
          </Card>
        </View>
      ) : null}

      {/* Kur'an hedefi + hatim */}
      <SectionHeader title={t('ramadan.quranGoal')} />
      <Card onPress={() => router.push('/quran/khatm')}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.xs }}>
          <ThemedText variant="secondary">{t('home.dailyGoal')}</ThemedText>
          <ThemedText variant="secondary">
            {readMinutes} / {settings.dailyQuranGoalMinutes} {t('common.minuteShort')}
          </ThemedText>
        </View>
        <ProgressBar ratio={readMinutes / Math.max(1, settings.dailyQuranGoalMinutes)} />
        <ThemedText variant="caption" style={{ marginTop: Spacing.sm }} color={theme.primary}>
          {t('ramadan.khatm')} →
        </ThemedText>
      </Card>

      {/* Günün duası + Kadir gecesi */}
      <SectionHeader title={t('ramadan.dailyDua')} />
      <Card onPress={() => router.push('/daily')}>
        <ThemedText>{daily.ayah.text}</ThemedText>
        <ThemedText variant="caption" style={{ marginTop: Spacing.xs }}>
          {daily.ayah.source}
        </ThemedText>
      </Card>

      <Card tone="accent" style={{ marginTop: Spacing.sm }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
          <Ionicons name="sparkles-outline" size={24} color={theme.accent} />
          <View style={{ flex: 1 }}>
            <ThemedText variant="heading">{t('ramadan.qadrContent')}</ThemedText>
            <ThemedText variant="caption">
              {formatDateShort(qadrDate, language)} · {t('religiousDays.qadr.desc')}
            </ThemedText>
          </View>
        </View>
      </Card>

      {/* Fitre ve zekât bilgilendirme */}
      <Card style={{ marginTop: Spacing.sm }}>
        <ThemedText variant="heading">{t('ramadan.fitrTitle')}</ThemedText>
        <ThemedText variant="secondary" style={{ marginTop: Spacing.xs }}>
          {t('ramadan.fitrBody')}
        </ThemedText>
      </Card>

      {/* İmsakiye */}
      <SectionHeader title={t('ramadan.imsakiye')} />
      <Card>
        <View style={{ flexDirection: 'row', paddingBottom: Spacing.xs, borderBottomWidth: 1, borderBottomColor: theme.border }}>
          <ThemedText variant="caption" style={{ flex: 1 }}>
            {t('ramadan.title')}
          </ThemedText>
          <ThemedText variant="caption" style={{ width: 70, textAlign: 'center' }}>
            {t('prayers.fajr')}
          </ThemedText>
          <ThemedText variant="caption" style={{ width: 70, textAlign: 'center' }}>
            {t('prayers.maghrib')}
          </ThemedText>
        </View>
        {imsakiye.map((row, i) => {
          const isToday = todayISO(row.date) === dateISO;
          return (
            <View
              key={i}
              style={{
                flexDirection: 'row',
                paddingVertical: 4,
                backgroundColor: isToday ? theme.primarySoft : 'transparent',
              }}
            >
              <ThemedText variant="caption" style={{ flex: 1, fontWeight: isToday ? '700' : '400' }}>
                {i + 1} · {formatDateShort(row.date, language)}
              </ThemedText>
              <ThemedText variant="caption" style={{ width: 70, textAlign: 'center' }}>
                {formatTime(row.fajr)}
              </ThemedText>
              <ThemedText variant="caption" style={{ width: 70, textAlign: 'center' }}>
                {formatTime(row.maghrib)}
              </ThemedText>
            </View>
          );
        })}
      </Card>
    </Screen>
  );
}
