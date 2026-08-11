import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { ProgressBar, SectionHeader, type IconName } from '@/components/ui-bits';
import { Radius, Spacing } from '@/constants/theme';
import { getDailyInspiration } from '@/data/inspiration';
import { LATEST_KHUTBAH } from '@/data/khutbah';
import { useTheme, useThemeMode } from '@/hooks/use-theme';
import { buildDailyJourney, buildGentleWeek, type JourneyTaskId } from '@/lib/daily-journey';
import { formatDateLong, formatTime, todayISO } from '@/lib/format';
import { formatHijri, isRamadan, toHijri } from '@/lib/hijri';
import { getNextPrayer, getPrayerTimesForDate } from '@/lib/prayer-times';
import { shareText } from '@/lib/share';
import { shouldSuggestTravel } from '@/lib/travel';
import { observeCurrentLocation } from '@/lib/travel-location';
import {
  isPrivateWorshipActive,
  isPrivateWorshipExemptDate,
  usePrivateWorshipStore,
} from '@/store/private-worship';
import { useProgressStore } from '@/store/progress';
import { useSettingsStore } from '@/store/settings';
import { useTasbihStore } from '@/store/tasbih';
import { useTrackerStore } from '@/store/tracker';
import { useTravelStore } from '@/store/travel';

const LOCALES = { tr: 'tr-TR', en: 'en-US', ar: 'ar' } as const;

function greetingKey(hour: number): string {
  if (hour >= 5 && hour < 12) return 'home.greetingMorning';
  if (hour < 17) return 'home.greetingAfternoon';
  if (hour < 22) return 'home.greetingEvening';
  return 'home.greetingNight';
}

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

function HeaderIcon({ icon, onPress, label }: { icon: IconName; onPress: () => void; label: string }) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => ({
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: pressed ? theme.surfaceAlt : theme.surface,
        borderWidth: 1,
        borderColor: theme.border,
        alignItems: 'center',
        justifyContent: 'center',
      })}
    >
      <Ionicons name={icon} size={19} color={theme.text} />
    </Pressable>
  );
}

function JourneyRow({
  icon,
  title,
  subtitle,
  completed,
  onPress,
}: {
  icon: IconName;
  title: string;
  subtitle: string;
  completed: boolean;
  onPress: () => void;
}) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ checked: completed }}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
        paddingVertical: Spacing.sm + 2,
        opacity: pressed ? 0.75 : 1,
      })}
    >
      <View
        style={{
          width: 42,
          height: 42,
          borderRadius: 21,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: completed ? theme.primary : theme.primarySoft,
        }}
      >
        <Ionicons name={completed ? 'checkmark' : icon} size={20} color={completed ? theme.onPrimary : theme.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <ThemedText variant="label" style={completed ? { textDecorationLine: 'line-through' } : undefined}>
          {title}
        </ThemedText>
        <ThemedText variant="caption">{subtitle}</ThemedText>
      </View>
      <Ionicons name="chevron-forward" size={17} color={theme.textSecondary} />
    </Pressable>
  );
}

function QuickAction({ icon, label, onPress }: { icon: IconName; label: string; onPress: () => void }) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => ({
        width: '31.5%',
        minHeight: 92,
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.sm,
        borderRadius: Radius.lg,
        borderWidth: 1,
        borderColor: theme.border,
        backgroundColor: pressed ? theme.surfaceAlt : theme.surface,
      })}
    >
      <View
        style={{
          width: 38,
          height: 38,
          borderRadius: 19,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.primarySoft,
        }}
      >
        <Ionicons name={icon} size={20} color={theme.primary} />
      </View>
      <ThemedText variant="caption" style={{ textAlign: 'center' }} numberOfLines={2}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

export default function HomeScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const mode = useThemeMode();
  const settings = useSettingsStore();
  const progress = useProgressStore();
  const tracker = useTrackerStore();
  const privateWorship = usePrivateWorshipStore();
  const travel = useTravelStore();
  const tasbihHistory = useTasbihStore((state) => state.dailyHistory);
  const [now, setNow] = useState(() => new Date());
  const [showAllFeatures, setShowAllFeatures] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const { location, calcMethod, madhab, adjustments, language } = settings;
  const dateISO = todayISO(now);
  const privateModeActive = isPrivateWorshipActive(privateWorship);
  const todayExempt = isPrivateWorshipExemptDate(privateWorship, dateISO, dateISO);
  const travelAutoDetectEnabled = travel.autoDetectEnabled;
  const travelActive = travel.active;
  const travelLastCheckedAt = travel.lastCheckedAt;
  const travelDetectionDue =
    travelLastCheckedAt === null || now.getTime() - travelLastCheckedAt >= 6 * 60 * 60 * 1000;
  const todayTimes = useMemo(
    () => getPrayerTimesForDate(now, location.latitude, location.longitude, calcMethod, madhab, adjustments),
    // Saniyelik tik yerine gun veya ayarlar degistiginde yeniden hesapla.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [location, calcMethod, madhab, adjustments, dateISO],
  );
  const nextPrayer = useMemo(
    () => getNextPrayer(now, location.latitude, location.longitude, calcMethod, madhab, adjustments),
    [now, location, calcMethod, madhab, adjustments],
  );
  const remaining = Math.max(0, nextPrayer.remainingMs);
  const remainingText = `${pad(Math.floor(remaining / 3_600_000))}:${pad(Math.floor((remaining % 3_600_000) / 60_000))}:${pad(Math.floor((remaining % 60_000) / 1000))}`;

  const dayRecord = tracker.days[dateISO] ?? { prayers: {} };
  const quranMinutes = progress.quranMinutesByDay[dateISO] ?? 0;
  const dhikrByDay = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(tasbihHistory).map(([date, counts]) => [
          date,
          Object.values(counts).reduce((sum, count) => sum + count, 0),
        ]),
      ),
    [tasbihHistory],
  );
  const dhikrToday = dhikrByDay[dateISO] ?? 0;
  const journey = buildDailyJourney({
    now,
    prayerTimes: todayTimes.times,
    dayRecord,
    quranMinutes,
    quranGoalMinutes: settings.dailyQuranGoalMinutes,
    dhikrCount: dhikrToday,
    prayerExempt: todayExempt,
  });
  const exemptDatesThisWeek = useMemo(() => {
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const mondayOffset = (today.getDay() + 6) % 7;
    return Array.from({ length: mondayOffset + 1 }, (_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - mondayOffset + index);
      return todayISO(date);
    }).filter((iso) => isPrivateWorshipExemptDate(privateWorship, iso, dateISO));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateISO, privateWorship.periods]);
  const gentleWeek = useMemo(
    () =>
      buildGentleWeek({
        now,
        trackerDays: tracker.days,
        quranMinutesByDay: progress.quranMinutesByDay,
        dhikrByDay,
        goalDays: settings.weeklyJourneyGoalDays,
        exemptDates: exemptDatesThisWeek,
      }),
    // now her saniye degisir; haftalik ozet gun degisiminde yenilenir.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dateISO, tracker.days, progress.quranMinutesByDay, dhikrByDay, settings.weeklyJourneyGoalDays, exemptDatesThisWeek],
  );

  useEffect(() => {
    if (
      !travelAutoDetectEnabled ||
      travelActive ||
      !travelDetectionDue
    ) {
      return;
    }
    useTravelStore.getState().markChecked(Date.now());
    void observeCurrentLocation(false).then((result) => {
      if (result.status !== 'ok') return;
      const baseLocation = useTravelStore.getState().homeLocation ?? useSettingsStore.getState().location;
      const latestTravel = useTravelStore.getState();
      const dismissedRecently =
        result.location.cityName === latestTravel.dismissedCityName &&
        latestTravel.dismissedAt !== null &&
        Date.now() - latestTravel.dismissedAt < 24 * 60 * 60 * 1000;
      const awayFromBase = shouldSuggestTravel(result.location, baseLocation);
      if (awayFromBase && !dismissedRecently) {
        useTravelStore.getState().setPendingDestination(result.location);
      } else if (!awayFromBase) {
        useTravelStore.getState().clearDismissed();
      }
    });
  }, [travelActive, travelAutoDetectEnabled, travelDetectionDue]);

  const daily = getDailyInspiration(new Date(`${dateISO}T12:00:00`));
  const hijri = toHijri(now);
  // Vakit kartı: gece lacivert + altın; gündüz beyaz + koyu altın (gündüzde
  // koyu kart "gece teması" izlenimi veriyordu)
  // Vakit kartı: gece lacivert + altın; gündüz klasik yeşil (eski tema)
  const heroDark = mode === 'dark';
  const heroBg = heroDark ? '#1B2440' : '#22A188';
  const heroGold = heroDark ? '#D4AF37' : '#FFFFFF';
  const heroText = '#FFFFFF';
  const heroSub = heroDark ? 'rgba(226,232,240,0.75)' : 'rgba(255,255,255,0.8)';
  const heroDeco = 'rgba(255,255,255,0.08)';
  const journeyRatio = journey.completed / Math.max(1, journey.total);

  const openJourneyTask = (taskId: JourneyTaskId) => {
    if (taskId === 'prayer') {
      router.push('/(tabs)/prayer');
      return;
    }
    if (taskId === 'quran') {
      router.push(progress.lastRead ? `/quran/surah/${progress.lastRead.surah}` : '/(tabs)/quran');
      return;
    }
    router.push('/(tabs)/zikir');
  };

  const taskPresentation = (taskId: JourneyTaskId) => {
    if (taskId === 'prayer') {
      return {
        icon: 'moon-outline' as IconName,
        title: t('home.journey.prayerTask', {
          prayer: t(`prayers.${journey.duePrayer}`),
          defaultValue: `${t(`prayers.${journey.duePrayer}`)} namazını kaydet`,
        }),
      };
    }
    if (taskId === 'quran') {
      return {
        icon: 'book-outline' as IconName,
        title: t('home.journey.quranTask', { minutes: 5, defaultValue: "5 dk Kur'an oku" }),
      };
    }
    const periodKey = journey.period === 'morning' ? 'morningDhikr' : journey.period === 'evening' || journey.period === 'night' ? 'eveningDhikr' : 'calmDhikr';
    return {
      icon: 'ellipse-outline' as IconName,
      title: t(`home.journey.${periodKey}`, { defaultValue: '33 zikir ile kısa bir mola ver' }),
    };
  };

  const activatePendingTravel = () => {
    const destination = travel.pendingDestination;
    if (!destination) return;
    travel.activate(settings.location, destination);
    settings.set('location', destination);
  };

  return (
    <Screen padded={false}>
      <View style={{ paddingHorizontal: Spacing.md }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: Spacing.lg, gap: Spacing.sm }}>
          <View style={{ flex: 1 }}>
            <ThemedText variant="secondary">{t(greetingKey(now.getHours()))}</ThemedText>
            <ThemedText variant="title">{settings.userName || t('common.appName')}</ThemedText>
            <ThemedText variant="caption">
              {formatDateLong(now, language)} · {formatHijri(hijri, language)}
            </ThemedText>
          </View>
          <HeaderIcon icon="search-outline" label={t('common.search')} onPress={() => router.push('/search')} />
          <HeaderIcon icon="settings-outline" label={t('settings.title')} onPress={() => router.push('/settings')} />
        </View>

        <View
          style={{
            marginTop: Spacing.md,
            borderRadius: Radius.xl,
            backgroundColor: heroBg,
            padding: Spacing.md,
            overflow: 'hidden',
            borderWidth: 0,
          }}
        >
          <View
            style={{
              position: 'absolute',
              width: 180,
              height: 180,
              borderRadius: 90,
              right: -55,
              top: -75,
              backgroundColor: heroDeco,
            }}
          />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Ionicons name="location-sharp" size={14} color={heroText} />
              <ThemedText variant="label" color={heroText} style={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                {location.districtName ?? location.cityName}
              </ThemedText>
            </View>
            <Pressable
              onPress={() => router.push('/qibla')}
              accessibilityRole="button"
              accessibilityLabel={t('home.qibla')}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
            >
              <Ionicons name="compass-outline" size={16} color={heroText} />
              <ThemedText variant="label" color={heroText}>{t('home.qibla')}</ThemedText>
            </Pressable>
          </View>
          <Pressable
            onPress={() => router.push('/(tabs)/prayer')}
            accessibilityRole="button"
            accessibilityLabel={t('home.timeToPrayer', { prayer: t(`prayers.${nextPrayer.prayer}`) })}
            style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
          >
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', marginTop: Spacing.md }}>
            <View style={{ flex: 1 }}>
              <ThemedText variant="caption" color={heroSub}>
                {t('home.timeToPrayer', { prayer: t(`prayers.${nextPrayer.prayer}`) })}
              </ThemedText>
              <ThemedText color={heroGold} style={{ fontSize: 43, lineHeight: 50, fontWeight: '800', letterSpacing: 1 }}>
                {remainingText}
              </ThemedText>
            </View>
            <View style={{ alignItems: 'flex-end', paddingBottom: 4 }}>
              <ThemedText variant="heading" color={heroText}>{t(`prayers.${nextPrayer.prayer}`)}</ThemedText>
              <ThemedText variant="secondary" color={heroSub}>{formatTime(nextPrayer.time)}</ThemedText>
            </View>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: Spacing.sm }}>
            {(['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as const).map((prayer) => (
              <View key={prayer} style={{ alignItems: 'center' }}>
                <ThemedText variant="caption" color={prayer === nextPrayer.prayer ? heroGold : heroSub}>
                  {t(`prayers.${prayer}`)}
                </ThemedText>
                <ThemedText variant="caption" color={heroText}>{formatTime(todayTimes.times[prayer])}</ThemedText>
              </View>
            ))}
          </View>
          </Pressable>
        </View>

        {isRamadan(now) || now.getDay() === 5 ? (
          <Card
            tone="accent"
            style={{ marginTop: Spacing.sm }}
            onPress={() => router.push(isRamadan(now) ? '/ramadan' : '/quran/surah/18')}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
              <Ionicons name={isRamadan(now) ? 'moon' : 'sparkles'} size={20} color={theme.accent} />
              <ThemedText variant="label" style={{ flex: 1 }}>
                {isRamadan(now) ? t('ramadan.title') : t('home.fridayKahf')}
              </ThemedText>
              <Ionicons name="chevron-forward" size={16} color={theme.textSecondary} />
            </View>
          </Card>
        ) : null}

        {travel.pendingDestination && !travel.active ? (
          <Card tone="accent" style={{ marginTop: Spacing.sm }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
              <Ionicons name="airplane-outline" size={20} color={theme.accent} />
              <View style={{ flex: 1 }}>
                <ThemedText variant="label">{t('travel.newCityFound')}</ThemedText>
                <ThemedText variant="caption">
                  {t('travel.homeSuggestion', { city: travel.pendingDestination.cityName })}
                </ThemedText>
              </View>
            </View>
            <View style={{ flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.sm }}>
              <Button
                title={t('travel.activate')}
                onPress={activatePendingTravel}
                style={{ flex: 1 }}
              />
              <Button
                title={t('travel.notNow')}
                variant="ghost"
                onPress={travel.dismissPending}
                style={{ flex: 1 }}
              />
            </View>
          </Card>
        ) : null}

        {travel.active ? (
          <Card tone="primary" style={{ marginTop: Spacing.sm }} onPress={() => router.push('/travel')}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
              <Ionicons name="airplane" size={20} color={theme.primary} />
              <View style={{ flex: 1 }}>
                <ThemedText variant="label">{t('travel.activeTitle')}</ThemedText>
                <ThemedText variant="caption">
                  {t('travel.activeHomeBody', { city: travel.destination?.cityName ?? location.cityName })}
                </ThemedText>
              </View>
              <Ionicons name="chevron-forward" size={17} color={theme.textSecondary} />
            </View>
          </Card>
        ) : null}

        {privateModeActive ? (
          <Card tone="accent" style={{ marginTop: Spacing.sm }} onPress={() => router.push('/private-worship')}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
              <Ionicons name="shield-checkmark-outline" size={20} color={theme.accent} />
              <View style={{ flex: 1 }}>
                <ThemedText variant="label">{t('privateWorship.activeTitle')}</ThemedText>
                <ThemedText variant="caption">{t('privateWorship.homeBody')}</ThemedText>
              </View>
              <Ionicons name="chevron-forward" size={17} color={theme.textSecondary} />
            </View>
          </Card>
        ) : null}

        <SectionHeader title={t('home.journey.title', { defaultValue: "Bugünün Yolculuğu" })} />
        <Card>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.sm }}>
            <View style={{ flex: 1 }}>
              <ThemedText variant="heading">
                {t(`home.journey.period.${journey.period}`, { defaultValue: 'Bugün için küçük adımlar' })}
              </ThemedText>
              <ThemedText variant="caption">
                {journey.completed}/{journey.total} {t('home.journey.completed', { defaultValue: 'tamamlandı' })}
              </ThemedText>
            </View>
            <View
              style={{
                minWidth: 54,
                height: 34,
                borderRadius: 17,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: journey.completed === journey.total ? theme.primary : theme.primarySoft,
              }}
            >
              <ThemedText variant="label" color={journey.completed === journey.total ? theme.onPrimary : theme.primary}>
                %{Math.round(journeyRatio * 100)}
              </ThemedText>
            </View>
          </View>
          <ProgressBar ratio={journeyRatio} style={{ marginBottom: Spacing.sm }} />
          {journey.tasks.map((task, index) => {
            const presentation = taskPresentation(task.id);
            const subtitle = task.completed
              ? t('home.journey.doneSoft', { defaultValue: 'Güzel, bugünkü adım tamam' })
              : task.id === 'prayer'
                ? t('home.journey.prayerHint', { defaultValue: 'Kıldığında tek dokunuşla kaydet' })
                : `${task.current}/${task.target}`;
            return (
              <View key={task.id}>
                {index > 0 ? <View style={{ height: 1, backgroundColor: theme.border }} /> : null}
                <JourneyRow
                  icon={presentation.icon}
                  title={presentation.title}
                  subtitle={subtitle}
                  completed={task.completed}
                  onPress={() => openJourneyTask(task.id)}
                />
              </View>
            );
          })}
          <View style={{ flexDirection: 'row', gap: Spacing.xs, alignItems: 'center', marginTop: Spacing.xs }}>
            <Ionicons name="leaf-outline" size={14} color={theme.success} />
            <ThemedText variant="caption" color={theme.success} style={{ flex: 1 }}>
              {t('home.journey.gentleNote', { defaultValue: 'Az ama düzenli; kaçırılan bir gün ilerlemeni silmez.' })}
            </ThemedText>
          </View>
        </Card>

        <SectionHeader title={t('home.consistency.title', { defaultValue: 'Yumuşak Devamlılık' })} />
        <Card>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <ThemedText variant="heading">
                {gentleWeek.goalDays === 0
                  ? t('home.consistency.protectedWeekTitle', {
                      count: gentleWeek.days.filter((day) => day.isExempt).length,
                    })
                  : `${gentleWeek.completedDays}/${gentleWeek.goalDays} ${t('home.consistency.days', { defaultValue: 'gün' })}`}
              </ThemedText>
              <ThemedText variant="caption">
                {gentleWeek.goalDays === 0
                  ? t('home.consistency.protectedWeek')
                  : gentleWeek.goalMet
                  ? t('home.consistency.goalMet', { defaultValue: 'Bu haftaki niyetin tamamlandı.' })
                  : t('home.consistency.remaining', {
                      count: gentleWeek.remainingDays,
                      defaultValue: `Bu hafta ${gentleWeek.remainingDays} sakin gün daha`,
                    })}
              </ThemedText>
            </View>
            <Pressable onPress={() => router.push('/settings')} accessibilityRole="button">
              <ThemedText variant="label" color={theme.primary}>
                {t('home.consistency.editGoal', { defaultValue: 'Hedefi düzenle' })}
              </ThemedText>
            </Pressable>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: Spacing.md }}>
            {gentleWeek.days.map((day) => (
              <View key={day.dateISO} style={{ alignItems: 'center', gap: 5 }}>
                <View
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 17,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: day.completed
                      ? theme.primary
                      : day.isExempt
                        ? theme.accentSoft
                        : day.isToday
                          ? theme.primarySoft
                          : theme.surfaceAlt,
                    borderWidth: day.isToday ? 2 : 0,
                    borderColor: theme.primary,
                    opacity: day.isFuture ? 0.55 : 1,
                  }}
                >
                  <Ionicons
                    name={day.completed ? 'checkmark' : day.isExempt ? 'shield-checkmark-outline' : day.isToday ? 'leaf-outline' : 'ellipse-outline'}
                    size={16}
                    color={day.completed ? theme.onPrimary : day.isExempt ? theme.accent : theme.textSecondary}
                  />
                </View>
                <ThemedText variant="caption">
                  {day.date
                    .toLocaleDateString(LOCALES[language], { weekday: 'short' })
                    .replace('.', '')
                    .slice(0, 3)}
                </ThemedText>
              </View>
            ))}
          </View>
          <ThemedText variant="caption" style={{ marginTop: Spacing.md }}>
            {t(todayExempt ? 'home.consistency.exemptExplanation' : 'home.consistency.explanation', {
              defaultValue: todayExempt
                ? 'Muaf günün korunur; istersen dua, Kur’an ve zikirle yumuşakça devam edebilirsin.'
                : "Namaz, Kur'an ve zikir alanlarından ikisine dokunduğun gün yeterlidir; seri baskısı yoktur.",
            })}
          </ThemedText>
        </Card>

        <SectionHeader title={t(mode === 'dark' ? 'home.nightAyah' : 'home.dailyAyah')} onSeeAll={() => router.push('/daily')} />
        <Card tone="accent">
          {daily.ayah.arabic ? (
            <ThemedText variant="arabic" style={{ textAlign: 'center', fontSize: 25, lineHeight: 44, marginBottom: Spacing.sm }}>
              {daily.ayah.arabic}
            </ThemedText>
          ) : null}
          <ThemedText style={{ lineHeight: 23 }}>{daily.ayah.text}</ThemedText>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: Spacing.md }}>
            <ThemedText variant="label" color={theme.accent} style={{ flex: 1 }}>{daily.ayah.source}</ThemedText>
            <Pressable
              onPress={() => void shareText(`${daily.ayah.arabic ? `${daily.ayah.arabic}\n\n` : ''}${daily.ayah.text}\n— ${daily.ayah.source} · NUR`)}
              accessibilityRole="button"
              accessibilityLabel={t('common.share')}
            >
              <Ionicons name="share-social-outline" size={19} color={theme.accent} />
            </Pressable>
          </View>
        </Card>

        {/* Diyanet'in geçen cumaki hutbesi */}
        <SectionHeader title={t('khutbah.title')} onSeeAll={() => router.push('/khutbah')} />
        <Card onPress={() => router.push('/khutbah')}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
            <View
              style={{
                width: 46,
                height: 46,
                borderRadius: 23,
                backgroundColor: theme.primarySoft,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="megaphone-outline" size={21} color={theme.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <ThemedText variant="heading">{LATEST_KHUTBAH.title}</ThemedText>
              <ThemedText variant="caption" numberOfLines={2}>
                “{LATEST_KHUTBAH.ayah.meal}” ({LATEST_KHUTBAH.ayah.reference})
              </ThemedText>
              <ThemedText variant="caption" color={theme.primary} style={{ marginTop: 2 }}>
                {formatDateLong(new Date(`${LATEST_KHUTBAH.dateISO}T12:00:00`), language)} · Diyanet İşleri Başkanlığı
              </ThemedText>
            </View>
            <Ionicons name="chevron-forward" size={16} color={theme.textSecondary} />
          </View>
        </Card>

        <SectionHeader title={t('home.shortcuts')} />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: '2.75%' }}>
          <QuickAction icon="book-outline" label={t('tabs.quran')} onPress={() => router.push('/(tabs)/quran')} />
          <QuickAction icon="ellipse-outline" label={t('home.tasbih')} onPress={() => router.push('/(tabs)/zikir')} />
          <QuickAction icon="checkmark-done-outline" label={t('menu.tracker')} onPress={() => router.push('/tracker')} />
          <QuickAction icon="compass-outline" label={t('home.qibla')} onPress={() => router.push('/qibla')} />
          <QuickAction icon="heart-outline" label={t('home.duas')} onPress={() => router.push('/duas')} />
          <QuickAction icon="sparkles-outline" label={t('home.askAssistant')} onPress={() => router.push('/assistant')} />
        </View>

        <Pressable
          onPress={() => setShowAllFeatures((value) => !value)}
          accessibilityRole="button"
          accessibilityState={{ expanded: showAllFeatures }}
          style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: Spacing.xs, paddingVertical: Spacing.md }}
        >
          <ThemedText variant="label" color={theme.primary}>
            {showAllFeatures
              ? t('home.hideFeatures', { defaultValue: 'Daha az göster' })
              : t('home.allFeatures', { defaultValue: 'Tüm özellikler' })}
          </ThemedText>
          <Ionicons name={showAllFeatures ? 'chevron-up' : 'chevron-down'} size={16} color={theme.primary} />
        </Pressable>

        {showAllFeatures ? (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: '2.75%', marginBottom: Spacing.md }}>
            <QuickAction icon="calendar-outline" label={t('menu.calendar')} onPress={() => router.push('/calendar')} />
            <QuickAction icon="school-outline" label={t('home.lessons')} onPress={() => router.push('/programs')} />
            <QuickAction icon="business-outline" label={t('mosques.title')} onPress={() => router.push('/mosques')} />
            <QuickAction icon="star-outline" label={t('menu.esma')} onPress={() => router.push('/esma')} />
            <QuickAction icon="happy-outline" label={t('kids.title')} onPress={() => router.push('/kids')} />
            <QuickAction icon="bookmark-outline" label={t('home.savedItems')} onPress={() => router.push('/saved')} />
            <QuickAction icon="repeat-outline" label={t('home.qadaShortcut')} onPress={() => router.push('/qada')} />
            <QuickAction icon="mic-outline" label={t('coach.title')} onPress={() => router.push('/quran/coach')} />
            <QuickAction icon="chatbubbles-outline" label={t('tasbih.sectionHadiths')} onPress={() => router.push('/hadiths')} />
            {settings.gender !== 'male' ? (
              <QuickAction icon="shield-checkmark-outline" label={t('privateWorship.shortTitle')} onPress={() => router.push('/private-worship')} />
            ) : null}
            <QuickAction icon="airplane-outline" label={t('travel.title')} onPress={() => router.push('/travel')} />
          </View>
        ) : null}
      </View>
    </Screen>
  );
}
