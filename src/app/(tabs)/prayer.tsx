import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Switch, View, useWindowDimensions } from 'react-native';

import { Card } from '@/components/card';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { type IconName } from '@/components/ui-bits';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { formatDateShort, formatTime, todayISO } from '@/lib/format';
import { formatHijri, toHijri } from '@/lib/hijri';
import { syncPrayerNotifications } from '@/lib/notifications';
import { getMonthlyPrayerTimes, getNextPrayer, getPrayerTimesForDate, PRAYER_ORDER } from '@/lib/prayer-times';
import { useSettingsStore, type PrayerId } from '@/store/settings';
import { useTrackerStore, type TrackedPrayer } from '@/store/tracker';

const PRAYER_ICONS: Record<PrayerId, IconName> = {
  fajr: 'cloudy-night-outline',
  sunrise: 'partly-sunny-outline',
  dhuhr: 'sunny-outline',
  asr: 'sunny',
  maghrib: 'cloudy-outline',
  isha: 'moon-outline',
};

const TRACKED: TrackedPrayer[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

/** Nokta dizisiyle çizilen yarım daire gün göstergesi (İmsak → Yatsı). */
function DayArc({
  fraction,
  label,
  countdown,
}: {
  fraction: number;
  label: string;
  countdown: string;
}) {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const size = Math.min(width - Spacing.md * 4, 330);
  const r = size / 2 - 12;
  const cx = size / 2;
  const cy = size / 2;
  const DOTS = 36;
  const clamped = Math.min(1, Math.max(0, fraction));

  const dots = Array.from({ length: DOTS + 1 }, (_, i) => {
    const t = i / DOTS;
    const angle = Math.PI * (1 - t);
    return {
      x: cx + r * Math.cos(angle),
      y: cy - r * Math.sin(angle),
      filled: t <= clamped,
    };
  });
  const markerAngle = Math.PI * (1 - clamped);
  const marker = { x: cx + r * Math.cos(markerAngle), y: cy - r * Math.sin(markerAngle) };

  return (
    <View style={{ alignItems: 'center' }}>
      <View style={{ width: size, height: size / 2 + 26 }}>
        {dots.map((d, i) => (
          <View
            key={i}
            style={{
              position: 'absolute',
              left: d.x - 3,
              top: d.y - 3,
              width: 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: d.filled ? theme.primary : theme.surfaceAlt,
            }}
          />
        ))}
        {/* Uç halkaları */}
        <View
          style={{
            position: 'absolute',
            left: cx - r - 6,
            top: cy - 6,
            width: 12,
            height: 12,
            borderRadius: 6,
            backgroundColor: theme.primary,
          }}
        />
        <View
          style={{
            position: 'absolute',
            left: cx + r - 6,
            top: cy - 6,
            width: 12,
            height: 12,
            borderRadius: 6,
            borderWidth: 2,
            borderColor: theme.textSecondary,
            backgroundColor: 'transparent',
          }}
        />
        {/* Güneş konumu işareti */}
        <View
          style={{
            position: 'absolute',
            left: marker.x - 11,
            top: marker.y - 11,
            width: 22,
            height: 22,
            borderRadius: 11,
            backgroundColor: '#F0A32E',
            borderWidth: 3,
            borderColor: 'rgba(240,163,46,0.35)',
          }}
        />
        {/* Merkez: geri sayım */}
        <View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: size / 6,
            alignItems: 'center',
            gap: 2,
          }}
        >
          <ThemedText variant="secondary">{label}</ThemedText>
          <ThemedText style={{ fontSize: 44, fontWeight: '800', color: theme.text, letterSpacing: 1 }}>
            {countdown}
          </ThemedText>
        </View>
      </View>
    </View>
  );
}

export default function PrayerTabScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const settings = useSettingsStore();
  const tracker = useTrackerStore();
  const [now, setNow] = useState(() => new Date());
  const [dayOffset, setDayOffset] = useState(0);
  const [showMonthly, setShowMonthly] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const { location, calcMethod, madhab, adjustments, language, notifications } = settings;

  // Ayarlar değişince OS bildirim planını tazele
  useEffect(() => {
    const names: Record<string, string> = {};
    for (const p of PRAYER_ORDER) names[p] = t(`prayers.${p}`);
    void syncPrayerNotifications(settings, names, t('common.appName'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, calcMethod, madhab, adjustments, notifications]);

  const selectedDate = useMemo(
    () => new Date(now.getFullYear(), now.getMonth(), now.getDate() + dayOffset),
    [now, dayOffset],
  );
  const isToday = dayOffset === 0;
  const selectedISO = todayISO(selectedDate);
  const hijri = toHijri(selectedDate);

  const dayTimes = useMemo(
    () =>
      getPrayerTimesForDate(
        selectedDate, location.latitude, location.longitude, calcMethod, madhab, adjustments,
      ),
    [selectedDate, location, calcMethod, madhab, adjustments],
  );
  const nextPrayer = useMemo(
    () => getNextPrayer(now, location.latitude, location.longitude, calcMethod, madhab, adjustments),
    [now, location, calcMethod, madhab, adjustments],
  );

  const remaining = Math.max(0, nextPrayer.remainingMs);
  const countdown = `${pad(Math.floor(remaining / 3600_000))}:${pad(Math.floor((remaining % 3600_000) / 60_000))}:${pad(Math.floor((remaining % 60_000) / 1000))}`;

  // Yay: imsak → yatsı arası gün ilerlemesi
  const dayFraction =
    (now.getTime() - dayTimes.times.fajr.getTime()) /
    Math.max(1, dayTimes.times.isha.getTime() - dayTimes.times.fajr.getTime());

  const dayRecord = tracker.days[selectedISO] ?? { prayers: {} };
  const prayersDone = TRACKED.filter((p) => dayRecord.prayers[p]).length;

  const monthly = useMemo(
    () =>
      showMonthly
        ? getMonthlyPrayerTimes(
            now.getFullYear(), now.getMonth(),
            location.latitude, location.longitude,
            calcMethod, madhab, adjustments,
          )
        : [],
    [showMonthly, now, location, calcMethod, madhab, adjustments],
  );

  return (
    <Screen>
      {/* Başlık */}
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginTop: Spacing.lg }}>
        <View style={{ flex: 1 }}>
          <ThemedText variant="title">{t('prayerTimes.title')}</ThemedText>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 }}>
            <Ionicons name="checkmark-circle" size={14} color={theme.primary} />
            <ThemedText variant="caption" color={theme.primary}>
              {t(`prayerTimes.methodNames.${calcMethod}`)}
            </ThemedText>
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
            <Ionicons name="location-sharp" size={14} color={theme.primary} />
            <ThemedText variant="label" color={theme.primary} style={{ textTransform: 'uppercase' }}>
              {location.districtName ?? location.cityName}
            </ThemedText>
          </View>
          <Pressable
            onPress={() => setShowMonthly((v) => !v)}
            accessibilityRole="button"
            accessibilityLabel={t('prayerTimes.monthly')}
            accessibilityState={{ selected: showMonthly }}
            style={{
              padding: 6,
              borderRadius: Radius.md,
              backgroundColor: showMonthly ? theme.primarySoft : 'transparent',
            }}
          >
            <Ionicons name="calendar-outline" size={20} color={showMonthly ? theme.primary : theme.text} />
          </Pressable>
        </View>
      </View>

      {/* Gün gezgini */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: Spacing.md,
        }}
      >
        <Pressable
          onPress={() => setDayOffset((d) => d - 1)}
          accessibilityRole="button"
          accessibilityLabel="←"
          style={{
            width: 42,
            height: 42,
            borderRadius: 21,
            backgroundColor: theme.surface,
            borderWidth: 1,
            borderColor: theme.border,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="chevron-back" size={18} color={theme.text} />
        </Pressable>
        <Pressable onPress={() => setDayOffset(0)} accessibilityRole="button" style={{ alignItems: 'center' }}>
          <ThemedText variant="heading">
            {isToday ? t('common.today') : formatDateShort(selectedDate, language)}
          </ThemedText>
          <ThemedText variant="caption">{formatHijri(hijri, language)}</ThemedText>
        </Pressable>
        <Pressable
          onPress={() => setDayOffset((d) => d + 1)}
          accessibilityRole="button"
          accessibilityLabel="→"
          style={{
            width: 42,
            height: 42,
            borderRadius: 21,
            backgroundColor: theme.surface,
            borderWidth: 1,
            borderColor: theme.border,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="chevron-forward" size={18} color={theme.text} />
        </Pressable>
      </View>

      {showMonthly ? (
        /* Aylık görünüm */
        <Card style={{ marginTop: Spacing.md }}>
          <View style={{ flexDirection: 'row', paddingBottom: Spacing.xs, borderBottomWidth: 1, borderBottomColor: theme.border }}>
            <ThemedText variant="caption" style={{ width: 52 }} />
            {PRAYER_ORDER.map((p) => (
              <ThemedText key={p} variant="caption" style={{ flex: 1, textAlign: 'center' }}>
                {t(`prayers.${p}`)}
              </ThemedText>
            ))}
          </View>
          {monthly.map((d) => {
            const rowIsToday = todayISO(d.date) === todayISO(now);
            return (
              <View
                key={d.date.getDate()}
                style={{
                  flexDirection: 'row',
                  paddingVertical: 5,
                  backgroundColor: rowIsToday ? theme.primarySoft : 'transparent',
                  borderRadius: Radius.sm,
                }}
              >
                <ThemedText variant="caption" style={{ width: 52, fontWeight: rowIsToday ? '700' : '400' }}>
                  {formatDateShort(d.date, language)}
                </ThemedText>
                {PRAYER_ORDER.map((p) => (
                  <ThemedText key={p} variant="caption" style={{ flex: 1, textAlign: 'center' }}>
                    {formatTime(d.times[p])}
                  </ThemedText>
                ))}
              </View>
            );
          })}
        </Card>
      ) : (
        <>
          {/* Yay göstergesi — yalnızca bugün */}
          {isToday ? (
            <Card style={{ marginTop: Spacing.md, paddingVertical: Spacing.lg }}>
              <DayArc
                fraction={dayFraction}
                label={t('home.timeToPrayer', { prayer: t(`prayers.${nextPrayer.prayer}`) })}
                countdown={countdown}
              />
            </Card>
          ) : null}

          {/* Bugünkü namaz özeti */}
          {isToday && settings.trackerEnabled ? (
            <Card style={{ marginTop: Spacing.sm }} onPress={() => router.push('/tracker')}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
                <View
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 26,
                    backgroundColor: theme.primarySoft,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ThemedText variant="label" color={theme.primary}>
                    {prayersDone}
                    <ThemedText variant="caption" color={theme.primary}>
                      /5
                    </ThemedText>
                  </ThemedText>
                </View>
                <View style={{ flex: 1 }}>
                  <ThemedText variant="label">{t('prayerTimes.todayPrayerLabel')}</ThemedText>
                  <ThemedText variant="caption">
                    {prayersDone === TRACKED.length
                      ? t('prayerTimes.todayAllDone')
                      : t('prayerTimes.todayPrayerHint')}
                  </ThemedText>
                </View>
              </View>
            </Card>
          ) : null}

          {/* Vakit satırları */}
          <View style={{ marginTop: Spacing.sm, gap: Spacing.sm }}>
            {PRAYER_ORDER.map((p: PrayerId) => {
              const time = dayTimes.times[p];
              const isNext = isToday && p === nextPrayer.prayer;
              const isPast = isToday && time.getTime() < now.getTime();
              const trackable =
                settings.trackerEnabled && p !== 'sunrise' && (isPast || isNext) && isToday;
              const done = p !== 'sunrise' && !!dayRecord.prayers[p as TrackedPrayer];
              return (
                <Pressable
                  key={p}
                  disabled={!trackable}
                  onPress={() => tracker.togglePrayer(selectedISO, p as TrackedPrayer)}
                  accessibilityRole={trackable ? 'checkbox' : undefined}
                  accessibilityState={trackable ? { checked: done } : undefined}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: Spacing.md,
                    backgroundColor: isNext ? theme.primarySoft : theme.surface,
                    borderRadius: Radius.xl,
                    borderWidth: 1,
                    borderColor: isNext ? theme.primary : theme.border,
                    padding: Spacing.md,
                    opacity: isPast && !isNext ? 0.75 : 1,
                  }}
                >
                  <View
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: 23,
                      backgroundColor: isNext ? theme.primary : theme.surfaceAlt,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Ionicons
                      name={PRAYER_ICONS[p]}
                      size={20}
                      color={isNext ? theme.onPrimary : theme.textSecondary}
                    />
                  </View>
                  <ThemedText
                    variant="heading"
                    color={isNext ? theme.primary : theme.text}
                    style={{ flex: 1 }}
                  >
                    {t(`prayers.${p}`)}
                  </ThemedText>
                  <ThemedText variant="heading" color={isNext ? theme.primary : theme.text}>
                    {formatTime(time)}
                  </ThemedText>
                  {p !== 'sunrise' && settings.trackerEnabled && isToday ? (
                    <View
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 15,
                        backgroundColor: done ? theme.primary : 'transparent',
                        borderWidth: done ? 0 : 2,
                        borderColor: theme.border,
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: trackable || done ? 1 : 0.4,
                      }}
                    >
                      <Ionicons
                        name="checkmark"
                        size={16}
                        color={done ? theme.onPrimary : theme.textSecondary}
                      />
                    </View>
                  ) : null}
                </Pressable>
              );
            })}
          </View>

          {/* Kaza takibi girişi */}
          <Card style={{ marginTop: Spacing.md }} onPress={() => router.push('/qada')}>
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
                <Ionicons name="repeat-outline" size={20} color={theme.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <ThemedText variant="label">{t('qada.title')}</ThemedText>
                <ThemedText variant="caption" numberOfLines={1}>{t('qada.intro')}</ThemedText>
              </View>
              <Ionicons name="chevron-forward" size={16} color={theme.textSecondary} />
            </View>
          </Card>

          {/* Yakındaki camiler girişi */}
          <Card style={{ marginTop: Spacing.md }} onPress={() => router.push('/mosques')}>
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
                <Ionicons name="business-outline" size={20} color={theme.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <ThemedText variant="label">{t('mosques.title')}</ThemedText>
                <ThemedText variant="caption" numberOfLines={1}>{t('mosques.subtitle')}</ThemedText>
              </View>
              <Ionicons name="chevron-forward" size={16} color={theme.textSecondary} />
            </View>
          </Card>

          {/* Ezan bildirimleri */}
          <Card style={{ marginTop: Spacing.md }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
              <Ionicons name="notifications-outline" size={22} color={theme.text} />
              <View style={{ flex: 1 }}>
                <ThemedText variant="label">{t('prayerTimes.adhanNotifications')}</ThemedText>
                <ThemedText variant="caption">{t('prayerTimes.adhanNotificationsSub')}</ThemedText>
              </View>
              <Switch
                value={notifications.prayersEnabled}
                onValueChange={(v) => settings.setNotification('prayersEnabled', v)}
                trackColor={{ true: theme.primary, false: theme.surfaceAlt }}
              />
            </View>
            {notifications.prayersEnabled ? (
              <View style={{ marginTop: Spacing.md }}>
                <ThemedText variant="secondary" style={{ marginBottom: Spacing.sm }}>
                  {t('prayerTimes.whichPrayers')}
                </ThemedText>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm }}>
                  {PRAYER_ORDER.filter((p) => p !== 'sunrise').map((p) => {
                    const on = notifications.perPrayer[p];
                    return (
                      <Pressable
                        key={p}
                        onPress={() =>
                          settings.setNotification('perPrayer', {
                            ...notifications.perPrayer,
                            [p]: !on,
                          })
                        }
                        accessibilityRole="switch"
                        accessibilityState={{ checked: on }}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 4,
                          backgroundColor: on ? theme.primary : theme.surfaceAlt,
                          borderRadius: Radius.full,
                          paddingHorizontal: Spacing.md,
                          paddingVertical: Spacing.sm,
                        }}
                      >
                        <Ionicons
                          name={on ? 'notifications' : 'notifications-off-outline'}
                          size={13}
                          color={on ? theme.onPrimary : theme.textSecondary}
                        />
                        <ThemedText variant="label" color={on ? theme.onPrimary : theme.textSecondary}>
                          {t(`prayers.${p}`)}
                        </ThemedText>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            ) : null}
            <Pressable
              onPress={() => router.push('/settings')}
              accessibilityRole="button"
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: Spacing.md,
                marginTop: Spacing.md,
                paddingTop: Spacing.md,
                borderTopWidth: 1,
                borderTopColor: theme.border,
              }}
            >
              <Ionicons name="options-outline" size={20} color={theme.text} />
              <View style={{ flex: 1 }}>
                <ThemedText variant="label">{t('prayerTimes.allNotificationSettings')}</ThemedText>
                <ThemedText variant="caption">{t('prayerTimes.allNotificationSettingsSub')}</ThemedText>
              </View>
              <Ionicons name="chevron-forward" size={16} color={theme.textSecondary} />
            </Pressable>
          </Card>

          <ThemedText variant="caption" style={{ marginTop: Spacing.sm, textAlign: 'center' }}>
            {t('prayerTimes.offlineNote')}
          </ThemedText>
        </>
      )}
    </Screen>
  );
}
