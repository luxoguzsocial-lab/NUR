import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { Stack } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Linking, Platform, Pressable, View } from 'react-native';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Chip, EmptyState } from '@/components/ui-bits';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { formatTime } from '@/lib/format';
import { findNearbyMosques, mapsUrl, type Mosque } from '@/lib/mosques';
import { getPrayerTimesForDate } from '@/lib/prayer-times';
import { useSettingsStore, type PrayerId } from '@/store/settings';
import { useTravelStore } from '@/store/travel';

const CONGREGATION_PRAYERS: PrayerId[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
const RADII = [1, 3, 5, 10];

export default function MosquesScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const location = useSettingsStore((s) => s.location);
  const calcMethod = useSettingsStore((s) => s.calcMethod);
  const madhab = useSettingsStore((s) => s.madhab);
  const adjustments = useSettingsStore((s) => s.adjustments);
  const congregationOffsets = useSettingsStore((s) => s.congregationOffsets);
  const setCongregationOffset = useSettingsStore((s) => s.setCongregationOffset);
  const setSetting = useSettingsStore((s) => s.set);

  const [radiusKm, setRadiusKm] = useState(3);
  const [mosques, setMosques] = useState<Mosque[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [fromCache, setFromCache] = useState(false);
  const [editOffsets, setEditOffsets] = useState(false);
  const [locating, setLocating] = useState(false);

  const load = useCallback(
    async (lat: number, lon: number, radius: number) => {
      setLoading(true);
      setError(false);
      try {
        const result = await findNearbyMosques(lat, lon, radius);
        setMosques(result.mosques);
        setFromCache(result.fromCache);
      } catch {
        setError(true);
        setMosques(null);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    // setState'i effect gövdesinden çıkarmak için bir sonraki tick'e ertele
    const id = setTimeout(() => void load(location.latitude, location.longitude, radiusKm), 0);
    return () => clearTimeout(id);
  }, [load, location.latitude, location.longitude, radiusKm]);

  const locateMe = async () => {
    setLocating(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const places = await Location.reverseGeocodeAsync({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      }).catch(() => []);
      const place = places[0];
      const observedLocation = {
        mode: 'auto',
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        cityName: place?.city ?? place?.region ?? location.cityName,
        districtName: place?.district ?? place?.subregion ?? undefined,
      } as const;
      if (useTravelStore.getState().active) {
        useTravelStore.getState().activate(location, observedLocation);
      }
      setSetting('location', observedLocation);
    } catch {
      // konum alınamadı — mevcut ayar konumuyla devam
    } finally {
      setLocating(false);
    }
  };

  const today = getPrayerTimesForDate(
    new Date(),
    location.latitude,
    location.longitude,
    calcMethod,
    madhab,
    adjustments,
  );

  const openDirections = (m: Mosque) => {
    void Linking.openURL(mapsUrl(m.latitude, m.longitude, m.name, Platform.OS));
  };

  const distanceLabel = (km: number) =>
    km < 1
      ? t('mosques.mAway', { m: Math.round(km * 1000) })
      : t('mosques.kmAway', { km: km.toFixed(1) });

  return (
    <Screen>
      <Stack.Screen options={{ title: t('mosques.title') }} />
      <ThemedText variant="secondary" style={{ marginTop: Spacing.sm }}>
        {t('mosques.subtitle')} · {t('mosques.locationBasis', { city: location.districtName ? `${location.districtName}, ${location.cityName}` : location.cityName })}
      </ThemedText>

      {/* Kamet (cemaat) saatleri */}
      <Card tone="primary" style={{ marginTop: Spacing.md }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
          <Ionicons name="people-outline" size={18} color={theme.primary} />
          <ThemedText variant="heading" style={{ flex: 1 }}>
            {t('mosques.congregationTitle')}
          </ThemedText>
        </View>
        <View style={{ marginTop: Spacing.sm, gap: Spacing.xs }}>
          {CONGREGATION_PRAYERS.map((p) => {
            const adhan = today.times[p];
            const offset = congregationOffsets[p] ?? 0;
            const iqamah = new Date(adhan.getTime() + offset * 60_000);
            return (
              <View
                key={p}
                style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}
              >
                <ThemedText style={{ flex: 1 }}>{t(`prayers.${p}`)}</ThemedText>
                <ThemedText variant="caption">{formatTime(adhan)}</ThemedText>
                <Ionicons name="arrow-forward" size={12} color={theme.textSecondary} />
                <ThemedText variant="label" color={theme.primary}>
                  {formatTime(iqamah)}
                </ThemedText>
                {editOffsets ? (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.xs }}>
                    {([-1, 1] as const).map((delta) => (
                      <Pressable
                        key={delta}
                        onPress={() =>
                          setCongregationOffset(p, Math.max(0, Math.min(60, offset + delta)))
                        }
                        accessibilityRole="button"
                        style={({ pressed }) => ({
                          width: 28,
                          height: 28,
                          borderRadius: 14,
                          backgroundColor: pressed ? theme.primary : theme.surfaceAlt,
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderWidth: 1,
                          borderColor: theme.border,
                        })}
                      >
                        <Ionicons
                          name={delta > 0 ? 'add' : 'remove'}
                          size={16}
                          color={theme.text}
                        />
                      </Pressable>
                    ))}
                    <ThemedText variant="caption" style={{ width: 44, textAlign: 'right' }}>
                      +{offset} {t('common.minuteShort')}
                    </ThemedText>
                  </View>
                ) : (
                  <ThemedText variant="caption" style={{ width: 84, textAlign: 'right' }}>
                    {t('mosques.afterAdhan', { min: offset })}
                  </ThemedText>
                )}
              </View>
            );
          })}
        </View>
        <Button
          title={editOffsets ? t('mosques.doneEditing') : t('mosques.editOffsets')}
          variant={editOffsets ? 'primary' : 'secondary'}
          onPress={() => setEditOffsets((v) => !v)}
          style={{ marginTop: Spacing.sm }}
        />
        <ThemedText variant="caption" style={{ marginTop: Spacing.sm }}>
          {t('mosques.congregationNote')}
        </ThemedText>
      </Card>

      {/* Yakındaki camiler */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: Spacing.lg,
          marginBottom: Spacing.sm,
          gap: Spacing.sm,
        }}
      >
        <ThemedText variant="heading" style={{ flex: 1 }}>
          {t('mosques.nearbyTitle')}
        </ThemedText>
        <Pressable
          onPress={() => void locateMe()}
          accessibilityRole="button"
          disabled={locating}
          style={({ pressed }) => ({
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
            opacity: pressed || locating ? 0.6 : 1,
          })}
        >
          {locating ? (
            <ActivityIndicator size="small" color={theme.primary} />
          ) : (
            <Ionicons name="locate-outline" size={16} color={theme.primary} />
          )}
          <ThemedText variant="secondary" color={theme.primary}>
            {t('mosques.useMyLocation')}
          </ThemedText>
        </Pressable>
      </View>

      <View style={{ flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap' }}>
        {RADII.map((r) => (
          <Chip
            key={r}
            label={`${r} km`}
            selected={radiusKm === r}
            onPress={() => setRadiusKm(r)}
          />
        ))}
      </View>

      {fromCache && !loading ? (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: Spacing.xs,
            marginTop: Spacing.sm,
          }}
        >
          <Ionicons name="cloud-offline-outline" size={14} color={theme.textSecondary} />
          <ThemedText variant="caption">{t('mosques.fromCache')}</ThemedText>
        </View>
      ) : null}

      <View style={{ marginTop: Spacing.md, gap: Spacing.sm }}>
        {loading ? (
          <View style={{ alignItems: 'center', padding: Spacing.xl, gap: Spacing.sm }}>
            <ActivityIndicator color={theme.primary} />
            <ThemedText variant="secondary">{t('mosques.searching')}</ThemedText>
          </View>
        ) : error ? (
          <View style={{ alignItems: 'center', gap: Spacing.sm }}>
            <EmptyState icon="cloud-offline-outline" message={t('mosques.errorBody')} />
            <Button
              title={t('common.retry')}
              variant="secondary"
              onPress={() => void load(location.latitude, location.longitude, radiusKm)}
            />
          </View>
        ) : mosques && mosques.length === 0 ? (
          <EmptyState
            icon="business-outline"
            message={`${t('mosques.emptyTitle')}. ${t('mosques.emptyBody')}`}
          />
        ) : (
          mosques?.map((m) => (
            <View
              key={m.id}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: Spacing.md,
                backgroundColor: theme.surface,
                borderRadius: Radius.xl,
                borderWidth: 1,
                borderColor: theme.border,
                padding: Spacing.md,
              }}
            >
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
                <Ionicons name="moon-outline" size={20} color={theme.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <ThemedText variant="heading" numberOfLines={2}>
                  {m.name ?? t('mosques.unnamed')}
                </ThemedText>
                <ThemedText variant="caption">{distanceLabel(m.distanceKm)}</ThemedText>
              </View>
              <Pressable
                onPress={() => openDirections(m)}
                accessibilityRole="button"
                style={({ pressed }) => ({
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 4,
                  backgroundColor: theme.primary,
                  borderRadius: Radius.full,
                  paddingHorizontal: Spacing.md,
                  paddingVertical: Spacing.sm,
                  opacity: pressed ? 0.8 : 1,
                })}
              >
                <Ionicons name="navigate-outline" size={14} color={theme.onPrimary} />
                <ThemedText variant="label" color={theme.onPrimary}>
                  {t('mosques.directions')}
                </ThemedText>
              </Pressable>
            </View>
          ))
        )}
      </View>

      <ThemedText variant="caption" style={{ marginTop: Spacing.md }}>
        {t('mosques.dataSource')}
      </ThemedText>
    </Screen>
  );
}
