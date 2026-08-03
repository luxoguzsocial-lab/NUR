import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';

import { Card } from '@/components/card';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { ProgressBar, SectionHeader, type IconName } from '@/components/ui-bits';
import { Radius, Spacing } from '@/constants/theme';
import { getDailyInspiration } from '@/data/inspiration';
import { getProgramLessons, PROGRAMS } from '@/data/programs';
import { getSurahMeta } from '@/data/quran';
import { VIDEOS } from '@/data/videos';
import { shareText } from '@/lib/share';
import { useTheme, useThemeMode } from '@/hooks/use-theme';
import { formatDateLong, formatTime, todayISO } from '@/lib/format';
import { formatHijri, isRamadan, toHijri } from '@/lib/hijri';
import { getNextPrayer, getPrayerTimesForDate, PRAYER_ORDER } from '@/lib/prayer-times';
import { upcomingReligiousDays } from '@/lib/religious-days';
import { useProgressStore } from '@/store/progress';
import { useSettingsStore, type PrayerId } from '@/store/settings';
import { useTasbihStore } from '@/store/tasbih';
import { useTrackerStore, type TrackedPrayer } from '@/store/tracker';

const TRACKED: TrackedPrayer[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

const TRACKED_LABEL_KEY: Record<TrackedPrayer, string> = {
  fajr: 'prayers.fajr',
  dhuhr: 'prayers.dhuhr',
  asr: 'prayers.asr',
  maghrib: 'prayers.maghrib',
  isha: 'prayers.isha',
};

function greetingKey(hour: number): string {
  if (hour >= 5 && hour < 12) return 'home.greetingMorning';
  if (hour < 17) return 'home.greetingAfternoon';
  if (hour < 22) return 'home.greetingEvening';
  return 'home.greetingNight';
}

function dayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  return Math.floor((date.getTime() - start.getTime()) / 86_400_000);
}

function pad(n: number): string {
  return String(n).padStart(2, '0');
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

function ShortcutTile({ icon, label, onPress }: { icon: IconName; label: string; onPress: () => void }) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => ({
        width: '23%',
        aspectRatio: 0.95,
        borderRadius: Radius.lg,
        backgroundColor: pressed ? theme.surfaceAlt : theme.surface,
        borderWidth: 1,
        borderColor: theme.border,
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.sm,
      })}
    >
      <Ionicons name={icon} size={24} color={theme.primary} />
      <ThemedText variant="caption" style={{ textAlign: 'center' }} numberOfLines={1}>
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
  const tasbihHistory = useTasbihStore((s) => s.dailyHistory);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const { location, calcMethod, madhab, adjustments, language } = settings;
  const hijri = toHijri(now);
  const ramadan = isRamadan(now);
  const dateISO = todayISO(now);

  const todayTimes = useMemo(
    () =>
      getPrayerTimesForDate(now, location.latitude, location.longitude, calcMethod, madhab, adjustments),
    // Gün değişince (dateISO) yeniden hesapla; saniyelik tik'lerde değil
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [location, calcMethod, madhab, adjustments, dateISO],
  );
  const nextPrayer = useMemo(
    () => getNextPrayer(now, location.latitude, location.longitude, calcMethod, madhab, adjustments),
    [now, location, calcMethod, madhab, adjustments],
  );

  // Dev geri sayım: SS:DD büyük, saniye küçük
  const remaining = Math.max(0, nextPrayer.remainingMs);
  const remH = Math.floor(remaining / 3600_000);
  const remM = Math.floor((remaining % 3600_000) / 60_000);
  const remS = Math.floor((remaining % 60_000) / 1000);

  const daily = useMemo(() => getDailyInspiration(now), [now]);
  const nextEvent = useMemo(() => upcomingReligiousDays(now, 1)[0], [now]);

  const dayRecord = tracker.days[dateISO] ?? { prayers: {} };
  const prayersDone = TRACKED.filter((p) => dayRecord.prayers[p]).length;
  const readMinutes = progress.quranMinutesByDay[dateISO] ?? 0;
  const quranGoalMet = readMinutes >= settings.dailyQuranGoalMinutes;
  const dhikrToday = Object.values(tasbihHistory[dateISO] ?? {}).reduce((a, b) => a + b, 0);
  const lastReadSurah = progress.lastRead ? getSurahMeta(progress.lastRead.surah) : null;
  const activeKhatm = progress.khatmPlans.find((p) => p.active);
  const memorizedCount = Object.values(progress.memorization).reduce(
    (sum, m) => sum + m.memorizedAyahs.length,
    0,
  );

  // Günlük rutin: 5 vakit + oruç + Kur'an hedefi + zikir
  const routineItems = [prayersDone === TRACKED.length, !!dayRecord.fasting, quranGoalMet, dhikrToday > 0];
  const routineDone = routineItems.filter(Boolean).length;

  const videoOfDay = VIDEOS[dayOfYear(now) % VIDEOS.length]!;

  let nextLesson: { program: (typeof PROGRAMS)[number]; lesson: ReturnType<typeof getProgramLessons>[number] } | null =
    null;
  for (const program of PROGRAMS) {
    const lesson = getProgramLessons(program.id).find((l) => !progress.completedLessons[l.id]);
    if (lesson) {
      nextLesson = { program, lesson };
      break;
    }
  }

  const heroText = '#FFFFFF';
  const heroSub = 'rgba(255,255,255,0.8)';
  const heroBg = mode === 'dark' ? '#2E8F7C' : '#22A188';

  const shareAyah = () =>
    void shareText(`${daily.ayah.arabic ? daily.ayah.arabic + '\n\n' : ''}${daily.ayah.text}\n— ${daily.ayah.source} · NUR`,);

  return (
    <Screen padded={false}>
      <View style={{ paddingHorizontal: Spacing.md }}>
        {/* Başlık: selamlama + arama + ayarlar */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: Spacing.lg,
            gap: Spacing.sm,
          }}
        >
          <View style={{ flex: 1 }}>
            <ThemedText variant="secondary">{t(greetingKey(now.getHours()))}</ThemedText>
            <ThemedText variant="title">
              {settings.userName ? settings.userName : t('common.appName')}
            </ThemedText>
            <ThemedText variant="caption">
              {formatDateLong(now, language)} · {formatHijri(hijri, language)}
            </ThemedText>
          </View>
          <HeaderIcon icon="search-outline" label={t('common.search')} onPress={() => router.push('/search')} />
          <HeaderIcon icon="settings-outline" label={t('settings.title')} onPress={() => router.push('/settings')} />
        </View>

        {/* HERO — dev geri sayım kartı */}
        <View
          style={{
            marginTop: Spacing.md,
            borderRadius: Radius.xl,
            backgroundColor: heroBg,
            padding: Spacing.md,
            overflow: 'hidden',
          }}
        >
          {/* Dekoratif daireler */}
          <View
            style={{
              position: 'absolute',
              width: 190,
              height: 190,
              borderRadius: 95,
              backgroundColor: 'rgba(255,255,255,0.08)',
              right: -50,
              top: -60,
            }}
          />
          <View
            style={{
              position: 'absolute',
              width: 150,
              height: 150,
              borderRadius: 75,
              backgroundColor: 'rgba(0,0,0,0.06)',
              left: -40,
              bottom: 30,
            }}
          />

          {/* Üst satır: konum + kıble */}
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
              style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
            >
              <Ionicons name="compass-outline" size={16} color={heroText} />
              <ThemedText variant="label" color={heroText}>
                {t('home.qibla')}
              </ThemedText>
            </Pressable>
          </View>

          {/* Geri sayım — dokununca Vakit sekmesi */}
          <Pressable
            onPress={() => router.push('/(tabs)/prayer')}
            accessibilityRole="button"
            style={{ alignItems: 'center', marginTop: Spacing.md }}
          >
            <ThemedText variant="secondary" color={heroSub}>
              {t('home.timeToPrayer', { prayer: t(`prayers.${nextPrayer.prayer}`) })}
            </ThemedText>
            <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
              <ThemedText color={heroText} style={{ fontSize: 76, fontWeight: '800', letterSpacing: 2 }}>
                {pad(remH)}:{pad(remM)}
              </ThemedText>
              <ThemedText color={heroSub} style={{ fontSize: 34, fontWeight: '700' }}>
                :{pad(remS)}
              </ThemedText>
            </View>
            <View
              style={{
                backgroundColor: 'rgba(255,255,255,0.22)',
                borderRadius: Radius.full,
                paddingHorizontal: Spacing.md,
                paddingVertical: 4,
              }}
            >
              <ThemedText variant="label" color={heroText}>
                {t(`prayers.${nextPrayer.prayer}`)} · {formatTime(nextPrayer.time)}
              </ThemedText>
            </View>
          </Pressable>

          {/* Vakit şeridi */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: Spacing.md,
              paddingTop: Spacing.md,
              borderTopWidth: 1,
              borderTopColor: 'rgba(255,255,255,0.25)',
            }}
          >
            {PRAYER_ORDER.map((p: PrayerId) => {
              const isNext = p === nextPrayer.prayer;
              return (
                <View
                  key={p}
                  style={{
                    alignItems: 'center',
                    backgroundColor: isNext ? 'rgba(255,255,255,0.24)' : 'transparent',
                    borderRadius: Radius.md,
                    paddingHorizontal: 7,
                    paddingVertical: 5,
                  }}
                >
                  <ThemedText variant="caption" color={isNext ? heroText : heroSub}>
                    {t(`prayers.${p}`)}
                  </ThemedText>
                  <ThemedText
                    variant="secondary"
                    color={heroText}
                    style={{ fontWeight: isNext ? '800' : '500' }}
                  >
                    {formatTime(todayTimes.times[p])}
                  </ThemedText>
                </View>
              );
            })}
          </View>
        </View>

        {/* Ramazan kartı — yalnızca Ramazan'da */}
        {ramadan ? (
          <Card tone="accent" style={{ marginTop: Spacing.sm }} onPress={() => router.push('/ramadan')}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
              <Ionicons name="moon" size={26} color={theme.accent} />
              <ThemedText variant="heading" style={{ flex: 1 }}>
                {t('ramadan.title')}
              </ThemedText>
              <Ionicons name="chevron-forward" size={18} color={theme.textSecondary} />
            </View>
          </Card>
        ) : null}

        {/* Cuma modu — yalnızca Cuma günleri */}
        {now.getDay() === 5 ? (
          <View
            style={{
              marginTop: Spacing.sm,
              backgroundColor: theme.accentSoft,
              borderRadius: Radius.xl,
              borderWidth: 1,
              borderColor: 'rgba(199,155,60,0.3)',
              padding: Spacing.md,
              gap: Spacing.sm,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
              <Ionicons name="sparkles" size={20} color={theme.accent} />
              <ThemedText variant="heading">{t('home.fridayTitle')}</ThemedText>
            </View>
            <ThemedText variant="caption" style={{ fontStyle: 'italic' }}>
              {'\u201C' + t('home.fridayHadith') + '\u201D — ' + t('home.fridayHadithSource')}
            </ThemedText>
            <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
              <Pressable
                onPress={() => router.push('/quran/surah/18')}
                accessibilityRole="button"
                style={({ pressed }) => ({
                  flex: 1,
                  alignItems: 'center',
                  paddingVertical: Spacing.sm,
                  borderRadius: Radius.md,
                  backgroundColor: theme.accent,
                  opacity: pressed ? 0.85 : 1,
                })}
              >
                <ThemedText variant="label" color="#FFF">
                  {t('home.fridayKahf')}
                </ThemedText>
              </Pressable>
              <Pressable
                onPress={() => {
                  useTasbihStore.getState().setActive('salavat');
                  router.push('/(tabs)/zikir');
                }}
                accessibilityRole="button"
                style={({ pressed }) => ({
                  flex: 1,
                  alignItems: 'center',
                  paddingVertical: Spacing.sm,
                  borderRadius: Radius.md,
                  backgroundColor: theme.surface,
                  borderWidth: 1,
                  borderColor: theme.accent,
                  opacity: pressed ? 0.85 : 1,
                })}
              >
                <ThemedText variant="label" color={theme.accent}>
                  {t('home.fridaySalawat')}
                </ThemedText>
              </Pressable>
            </View>
          </View>
        ) : null}

        {/* Sabah/akşam ritmi */}
        {now.getHours() >= 5 && now.getHours() < 12 ? (
          <Card style={{ marginTop: Spacing.sm }} onPress={() => router.push('/duas/sabah')}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
              <View
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 21,
                  backgroundColor: theme.accentSoft,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Ionicons name="partly-sunny" size={20} color={theme.accent} />
              </View>
              <View style={{ flex: 1 }}>
                <ThemedText variant="heading">{t('home.rhythmMorningTitle')}</ThemedText>
                <ThemedText variant="caption">{t('home.rhythmMorningSub')}</ThemedText>
              </View>
              <Ionicons name="chevron-forward" size={16} color={theme.textSecondary} />
            </View>
          </Card>
        ) : now.getHours() >= 17 ? (
          <Card style={{ marginTop: Spacing.sm }} onPress={() => router.push('/duas/aksam')}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
              <View
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 21,
                  backgroundColor: theme.primarySoft,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Ionicons name="moon" size={20} color={theme.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <ThemedText variant="heading">{t('home.rhythmEveningTitle')}</ThemedText>
                <ThemedText variant="caption" numberOfLines={2}>
                  {t('home.rhythmEveningSub')} · {t('home.rhythmReflection')}: {daily.reflection.text}
                </ThemedText>
              </View>
              <Ionicons name="chevron-forward" size={16} color={theme.textSecondary} />
            </View>
          </Card>
        ) : null}

        {/* Bugünkü İbadetlerim */}
        {settings.trackerEnabled ? (
          <>
            <SectionHeader title={t('home.todayWorship')} onSeeAll={() => router.push('/tracker')} />
            <Card>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.sm }}>
                <ThemedText variant="label">{t('home.prayerTracking')}</ThemedText>
                <ThemedText variant="label" color={theme.primary}>
                  {prayersDone}/{TRACKED.length}
                </ThemedText>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                {TRACKED.map((p) => {
                  const done = !!dayRecord.prayers[p];
                  // Vakti henüz gelmemiş namazlar kilitli (referans tasarım)
                  const prayerTime = todayTimes.times[p === 'fajr' ? 'fajr' : p];
                  const locked = !done && prayerTime.getTime() > now.getTime();
                  return (
                    <Pressable
                      key={p}
                      disabled={locked}
                      onPress={() => tracker.togglePrayer(dateISO, p)}
                      accessibilityRole="checkbox"
                      accessibilityState={{ checked: done, disabled: locked }}
                      accessibilityLabel={`${t(TRACKED_LABEL_KEY[p])}${locked ? ` (${t('home.notYetTime')})` : ''}`}
                      style={{ alignItems: 'center', gap: Spacing.xs, flex: 1 }}
                    >
                      <View
                        style={{
                          width: 46,
                          height: 46,
                          borderRadius: 23,
                          backgroundColor: done ? theme.primary : theme.surfaceAlt,
                          alignItems: 'center',
                          justifyContent: 'center',
                          opacity: locked ? 0.55 : 1,
                        }}
                      >
                        <Ionicons
                          name={done ? 'checkmark' : locked ? 'lock-closed' : 'ellipse-outline'}
                          size={done ? 22 : 16}
                          color={done ? theme.onPrimary : theme.textSecondary}
                        />
                      </View>
                      <ThemedText variant="caption">{t(TRACKED_LABEL_KEY[p])}</ThemedText>
                    </Pressable>
                  );
                })}
              </View>

              {/* Oruç + Kur'an hızlı satırı */}
              <View style={{ flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.md }}>
                <Pressable
                  onPress={() => tracker.toggleFasting(dateISO)}
                  accessibilityRole="button"
                  style={({ pressed }) => ({
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: Spacing.sm,
                    paddingVertical: Spacing.sm + 2,
                    borderRadius: Radius.md,
                    backgroundColor: dayRecord.fasting ? theme.primarySoft : theme.surfaceAlt,
                    opacity: pressed ? 0.8 : 1,
                  })}
                >
                  <Ionicons
                    name={dayRecord.fasting ? 'checkmark-circle' : 'restaurant-outline'}
                    size={17}
                    color={dayRecord.fasting ? theme.primary : theme.text}
                  />
                  <ThemedText variant="label" color={dayRecord.fasting ? theme.primary : theme.text}>
                    {t('tracker.fasting')}
                  </ThemedText>
                </Pressable>
                <Pressable
                  onPress={() =>
                    progress.lastRead
                      ? router.push(`/quran/surah/${progress.lastRead.surah}`)
                      : router.push('/(tabs)/quran')
                  }
                  accessibilityRole="button"
                  style={({ pressed }) => ({
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: Spacing.sm,
                    paddingVertical: Spacing.sm + 2,
                    borderRadius: Radius.md,
                    backgroundColor: quranGoalMet ? theme.primarySoft : theme.surfaceAlt,
                    opacity: pressed ? 0.8 : 1,
                  })}
                >
                  <Ionicons
                    name={quranGoalMet ? 'checkmark-circle' : 'book-outline'}
                    size={17}
                    color={quranGoalMet ? theme.primary : theme.text}
                  />
                  <ThemedText variant="label" color={quranGoalMet ? theme.primary : theme.text}>
                    {t('tabs.quran')} {readMinutes}/{settings.dailyQuranGoalMinutes}
                    {t('common.minuteShort')}
                  </ThemedText>
                </Pressable>
              </View>

              {/* Günlük rutin */}
              <Pressable
                onPress={() => router.push('/tracker')}
                accessibilityRole="button"
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: Spacing.md,
                  marginTop: Spacing.md,
                  paddingTop: Spacing.sm,
                  borderTopWidth: 1,
                  borderTopColor: theme.border,
                }}
              >
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: theme.accentSoft,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Ionicons name="sunny-outline" size={18} color={theme.accent} />
                </View>
                <View style={{ flex: 1 }}>
                  <ThemedText variant="label">{t('home.dailyRoutine')}</ThemedText>
                  <ThemedText variant="caption">
                    {routineDone}/{routineItems.length}
                  </ThemedText>
                </View>
                <Ionicons name="chevron-forward" size={16} color={theme.textSecondary} />
              </Pressable>
            </Card>
          </>
        ) : null}

        {/* Asistan banner'ı */}
        <Card style={{ marginTop: Spacing.md }} onPress={() => router.push('/assistant')}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: Radius.md,
                backgroundColor: theme.primary,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="sparkles" size={22} color={theme.onPrimary} />
            </View>
            <View style={{ flex: 1 }}>
              <ThemedText variant="heading">{t('home.askAssistant')}</ThemedText>
              <ThemedText variant="caption">{t('home.askAssistantSub')}</ThemedText>
            </View>
            <View
              style={{
                width: 38,
                height: 38,
                borderRadius: 19,
                backgroundColor: theme.primary,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="arrow-forward" size={18} color={theme.onPrimary} />
            </View>
          </View>
        </Card>

        {/* Günün Ayeti — altın kart, Arapça metinli */}
        <SectionHeader title={t('home.dailyAyah')} onSeeAll={() => router.push('/daily')} />
        <View
          style={{
            borderRadius: Radius.xl,
            backgroundColor: theme.accentSoft,
            padding: Spacing.md,
            borderWidth: 1,
            borderColor: mode === 'dark' ? 'rgba(212,175,90,0.25)' : 'rgba(176,138,46,0.25)',
          }}
        >
          {daily.ayah.arabic ? (
            <ThemedText
              variant="arabic"
              style={{ textAlign: 'center', fontSize: 26, lineHeight: 46, marginBottom: Spacing.sm }}
            >
              {daily.ayah.arabic}
            </ThemedText>
          ) : null}
          <ThemedText style={{ lineHeight: 23 }}>{daily.ayah.text}</ThemedText>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: Spacing.md,
            }}
          >
            <ThemedText variant="label" color={theme.accent}>
              {daily.ayah.source}
            </ThemedText>
            <Pressable
              onPress={shareAyah}
              accessibilityRole="button"
              style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
            >
              <Ionicons name="share-social-outline" size={16} color={theme.accent} />
              <ThemedText variant="label" color={theme.accent}>
                {t('common.share')}
              </ThemedText>
            </Pressable>
          </View>
        </View>

        {/* Yaklaşan Dinî Gün — tek kart */}
        {nextEvent ? (
          <>
            <SectionHeader title={t('home.upcomingSingle')} onSeeAll={() => router.push('/calendar')} />
            <Card onPress={() => router.push('/calendar')}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: Radius.md,
                    backgroundColor: theme.accentSoft,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Ionicons
                    name={nextEvent.type === 'eid' ? 'sparkles' : 'moon'}
                    size={22}
                    color={theme.accent}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <ThemedText variant="heading">{t(`religiousDays.${nextEvent.id}.name`)}</ThemedText>
                  <ThemedText variant="caption">{formatDateLong(nextEvent.date, language)}</ThemedText>
                </View>
                <View
                  style={{
                    backgroundColor: theme.primarySoft,
                    borderRadius: Radius.full,
                    paddingHorizontal: Spacing.md,
                    paddingVertical: 5,
                  }}
                >
                  <ThemedText variant="label" color={theme.primary}>
                    {t('calendar.daysLeft', {
                      count: Math.ceil((nextEvent.date.getTime() - now.getTime()) / 86_400_000),
                    })}
                  </ThemedText>
                </View>
              </View>
            </Card>
          </>
        ) : null}

        {/* Günün videosu + sıradaki ders */}
        <SectionHeader title={t('home.videoOfDay')} onSeeAll={() => router.push('/(tabs)/ilham')} />
        <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
          <Card style={{ flex: 1, padding: 0, overflow: 'hidden' }} onPress={() => router.push(`/video/${videoOfDay.id}`)}>
            <View
              style={{
                height: 84,
                backgroundColor: `hsl(${videoOfDay.thumbnailHue}, 45%, 26%)`,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="play-circle" size={34} color="rgba(255,255,255,0.92)" />
              {videoOfDay.media ? (
                <View
                  style={{
                    position: 'absolute',
                    top: 6,
                    right: 6,
                    backgroundColor: 'rgba(0,0,0,0.55)',
                    borderRadius: Radius.full,
                    paddingHorizontal: 6,
                    paddingVertical: 1,
                  }}
                >
                  <ThemedText variant="caption" color="#FFD86B" style={{ fontSize: 10 }}>
                    ▶ {t('home.watch')}
                  </ThemedText>
                </View>
              ) : null}
            </View>
            <View style={{ padding: Spacing.sm }}>
              <ThemedText variant="label" numberOfLines={2}>
                {videoOfDay.title}
              </ThemedText>
              <ThemedText variant="caption" numberOfLines={1}>
                {videoOfDay.creator.name}
              </ThemedText>
            </View>
          </Card>
          <Card
            style={{ flex: 1 }}
            onPress={() => (nextLesson ? router.push(`/lesson/${nextLesson.lesson.id}`) : router.push('/programs'))}
          >
            <Ionicons name="school-outline" size={22} color={theme.accent} />
            <ThemedText variant="caption" style={{ marginTop: Spacing.xs }}>
              {t('home.nextLesson')}
            </ThemedText>
            {nextLesson ? (
              <>
                <ThemedText variant="label" numberOfLines={2}>
                  {nextLesson.lesson.title}
                </ThemedText>
                <ThemedText variant="caption" numberOfLines={1} style={{ marginTop: 2 }}>
                  {nextLesson.program.title}
                </ThemedText>
              </>
            ) : (
              <ThemedText variant="label">{t('home.allLessonsDone')}</ThemedText>
            )}
          </Card>
        </View>

        {/* Hatim + ezber mini ilerleme */}
        <View style={{ flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.sm }}>
          <Card style={{ flex: 1 }} onPress={() => router.push('/quran/khatm')}>
            <ThemedText variant="caption">{t('home.khatmProgress')}</ThemedText>
            {activeKhatm ? (
              <>
                <ThemedText variant="heading" style={{ marginTop: 2 }}>
                  %{Math.round((activeKhatm.completedDays.length / activeKhatm.totalDays) * 100)}
                </ThemedText>
                <ProgressBar
                  ratio={activeKhatm.completedDays.length / activeKhatm.totalDays}
                  style={{ marginTop: Spacing.xs }}
                />
              </>
            ) : (
              <ThemedText variant="label" color={theme.primary} style={{ marginTop: 2 }}>
                {t('khatm.start', { defaultValue: 'Plan başlat' })}
              </ThemedText>
            )}
          </Card>
          <Card style={{ flex: 1 }} onPress={() => router.push('/quran/memorize')}>
            <ThemedText variant="caption">{t('home.memorizationProgress')}</ThemedText>
            <ThemedText variant="heading" style={{ marginTop: 2 }}>
              {memorizedCount}
            </ThemedText>
            <ThemedText variant="caption">
              {t('memorize.ayahsMemorized', { defaultValue: 'ezberlenen ayet' })}
            </ThemedText>
          </Card>
          {progress.lastRead && lastReadSurah ? (
            <Card style={{ flex: 1 }} onPress={() => router.push(`/quran/surah/${progress.lastRead!.surah}`)}>
              <ThemedText variant="caption">{t('home.continueReading')}</ThemedText>
              <ThemedText variant="heading" numberOfLines={1} style={{ marginTop: 2 }}>
                {lastReadSurah.turkishName}
              </ThemedText>
              <ThemedText variant="caption">{progress.lastRead.ayah}. ayet</ThemedText>
            </Card>
          ) : null}
        </View>

        {/* Kısayollar */}
        <SectionHeader title={t('home.shortcuts')} />
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            rowGap: Spacing.sm,
          }}
        >
          <ShortcutTile icon="checkmark-done-outline" label={t('menu.tracker')} onPress={() => router.push('/tracker')} />
          <ShortcutTile icon="star-outline" label={t('menu.esma')} onPress={() => router.push('/esma')} />
          <ShortcutTile icon="compass-outline" label={t('home.qibla')} onPress={() => router.push('/qibla')} />
          <ShortcutTile icon="heart-outline" label={t('home.duas')} onPress={() => router.push('/duas')} />
          <ShortcutTile icon="ellipse-outline" label={t('home.tasbih')} onPress={() => router.push('/(tabs)/zikir')} />
          <ShortcutTile icon="play-circle-outline" label={t('home.videos')} onPress={() => router.push('/(tabs)/ilham')} />
          <ShortcutTile icon="calendar-outline" label={t('menu.calendar')} onPress={() => router.push('/calendar')} />
          <ShortcutTile icon="school-outline" label={t('home.lessons')} onPress={() => router.push('/programs')} />
          <ShortcutTile icon="bookmark-outline" label={t('home.savedItems')} onPress={() => router.push('/saved')} />
          <ShortcutTile icon="notifications-outline" label={t('notifications.title')} onPress={() => router.push('/notifications')} />
          <ShortcutTile icon="sunny-outline" label={t('menu.daily')} onPress={() => router.push('/daily')} />
          <ShortcutTile icon="repeat-outline" label={t('home.qadaShortcut')} onPress={() => router.push('/qada')} />
          <ShortcutTile icon="repeat-outline" label={t('home.qadaShortcut')} onPress={() => router.push('/qada')} />
          <ShortcutTile icon="chatbubbles-outline" label={t('tasbih.sectionHadiths')} onPress={() => router.push('/hadiths')} />
          <ShortcutTile icon="person-outline" label={t('menu.profile')} onPress={() => router.push('/profile')} />
          <ShortcutTile icon="information-circle-outline" label={t('menu.about')} onPress={() => router.push('/about')} />
          <ShortcutTile
            icon="share-social-outline"
            label={t('home.shareApp')}
            onPress={() => void shareText('NUR — İslami Yaşam Uygulaması 🌙')}
          />
        </View>
      </View>
    </Screen>
  );
}
