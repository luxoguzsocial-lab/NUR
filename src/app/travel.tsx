import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Pressable, Switch, View } from 'react-native';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { SearchInput } from '@/components/content/search-input';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { SectionHeader, type IconName } from '@/components/ui-bits';
import { Radius, Spacing } from '@/constants/theme';
import { TURKISH_CITIES } from '@/data/cities';
import { useTheme } from '@/hooks/use-theme';
import { findNearbyMosques } from '@/lib/mosques';
import { shouldSuggestTravel } from '@/lib/travel';
import { observeCurrentLocation } from '@/lib/travel-location';
import { useSettingsStore, type LocationSetting } from '@/store/settings';
import { useTravelStore } from '@/store/travel';

function ActionCard({
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

export default function TravelScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const settings = useSettingsStore();
  const travel = useTravelStore();
  const [locating, setLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'denied' | 'unavailable'>('idle');
  const [pickerOpen, setPickerOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [preparing, setPreparing] = useState(false);
  const [offlinePrepared, setOfflinePrepared] = useState<'idle' | 'ready' | 'error'>('idle');

  const cityResults = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('tr-TR');
    const cities = normalized
      ? TURKISH_CITIES.filter((city) => city.name.toLocaleLowerCase('tr-TR').includes(normalized))
      : TURKISH_CITIES;
    return cities.slice(0, 16);
  }, [query]);

  const activate = (destination: LocationSetting) => {
    travel.activate(settings.location, destination);
    settings.set('location', destination);
    setPickerOpen(false);
    setQuery('');
  };

  const finish = () => {
    if (travel.homeLocation) settings.set('location', travel.homeLocation);
    travel.finish();
  };

  const checkLocation = async (requestPermission: boolean) => {
    setLocating(true);
    setLocationStatus('idle');
    const result = await observeCurrentLocation(requestPermission);
    travel.markChecked(Date.now());
    if (result.status === 'ok') {
      if (shouldSuggestTravel(result.location, travel.homeLocation ?? settings.location)) {
        travel.setPendingDestination(result.location);
      } else {
        travel.setPendingDestination(null);
        travel.clearDismissed();
      }
    } else {
      setLocationStatus(result.status === 'permission-denied' ? 'denied' : 'unavailable');
    }
    setLocating(false);
  };

  const prepareOfflineMosques = async () => {
    const destination = travel.destination ?? travel.pendingDestination ?? settings.location;
    setPreparing(true);
    setOfflinePrepared('idle');
    try {
      await findNearbyMosques(destination.latitude, destination.longitude, 3);
      setOfflinePrepared('ready');
    } catch {
      setOfflinePrepared('error');
    } finally {
      setPreparing(false);
    }
  };

  return (
    <Screen>
      <Stack.Screen options={{ title: t('travel.title') }} />

      <Card tone={travel.active ? 'primary' : 'surface'}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: theme.primarySoft,
            }}
          >
            <Ionicons name={travel.active ? 'airplane' : 'airplane-outline'} size={23} color={theme.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <ThemedText variant="heading">
              {travel.active ? t('travel.activeTitle') : t('travel.inactiveTitle')}
            </ThemedText>
            <ThemedText variant="caption">
              {travel.active
                ? t('travel.activeRoute', {
                    from: travel.homeLocation?.cityName ?? '',
                    to: travel.destination?.cityName ?? settings.location.cityName,
                  })
                : t('travel.inactiveBody')}
            </ThemedText>
          </View>
        </View>
        {travel.active ? (
          <Button
            title={t('travel.finish')}
            variant="secondary"
            onPress={finish}
            style={{ marginTop: Spacing.md }}
          />
        ) : null}
      </Card>

      <SectionHeader title={t('travel.detectionTitle')} />
      <Card>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
          <View style={{ flex: 1 }}>
            <ThemedText variant="label">{t('travel.autoDetect')}</ThemedText>
            <ThemedText variant="caption">{t('travel.autoDetectInfo')}</ThemedText>
          </View>
          <Switch
            value={travel.autoDetectEnabled}
            onValueChange={(enabled) => {
              travel.setAutoDetectEnabled(enabled);
              if (enabled) void checkLocation(true);
            }}
            trackColor={{ true: theme.primary, false: theme.surfaceAlt }}
          />
        </View>
        <Button
          title={t('travel.checkLocation')}
          variant="secondary"
          loading={locating}
          onPress={() => void checkLocation(true)}
          style={{ marginTop: Spacing.md }}
        />
        {locationStatus !== 'idle' ? (
          <ThemedText variant="caption" color={theme.danger} style={{ marginTop: Spacing.sm }}>
            {t(locationStatus === 'denied' ? 'travel.permissionDenied' : 'travel.locationUnavailable')}
          </ThemedText>
        ) : null}
      </Card>

      {travel.pendingDestination ? (
        <Card tone="accent" style={{ marginTop: Spacing.sm }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
            <Ionicons name="location" size={20} color={theme.accent} />
            <View style={{ flex: 1 }}>
              <ThemedText variant="heading">{t('travel.newCityFound')}</ThemedText>
              <ThemedText variant="caption">
                {travel.pendingDestination.districtName
                  ? `${travel.pendingDestination.districtName}, ${travel.pendingDestination.cityName}`
                  : travel.pendingDestination.cityName}
              </ThemedText>
            </View>
          </View>
          <View style={{ flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.md }}>
            <Button
              title={t('travel.activate')}
              onPress={() => activate(travel.pendingDestination!)}
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

      {!travel.active ? (
        <>
          <SectionHeader title={t('travel.manualTitle')} />
          <Button
            title={pickerOpen ? t('common.close') : t('travel.chooseCity')}
            variant="secondary"
            onPress={() => setPickerOpen((value) => !value)}
          />
          {pickerOpen ? (
            <View style={{ marginTop: Spacing.sm, gap: Spacing.sm }}>
              <SearchInput value={query} onChangeText={setQuery} placeholder={t('travel.citySearch')} />
              <Card style={{ padding: 0, overflow: 'hidden' }}>
                {cityResults.map((city, index) => (
                  <Pressable
                    key={city.plate}
                    onPress={() => {
                      travel.setPendingDestination({
                        mode: 'manual',
                        latitude: city.latitude,
                        longitude: city.longitude,
                        cityName: city.name,
                      });
                      setPickerOpen(false);
                      setQuery('');
                    }}
                    accessibilityRole="button"
                    style={({ pressed }) => ({
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: Spacing.sm,
                      padding: Spacing.md,
                      backgroundColor: pressed ? theme.surfaceAlt : theme.surface,
                      borderTopWidth: index === 0 ? 0 : 1,
                      borderTopColor: theme.border,
                    })}
                  >
                    <Ionicons name="location-outline" size={17} color={theme.primary} />
                    <ThemedText style={{ flex: 1 }}>{city.name}</ThemedText>
                    <ThemedText variant="caption">{city.plate}</ThemedText>
                  </Pressable>
                ))}
              </Card>
            </View>
          ) : null}
        </>
      ) : null}

      <SectionHeader title={t('travel.toolsTitle')} />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm }}>
        <ActionCard
          icon="time-outline"
          title={t('travel.prayerTimes')}
          subtitle={t('travel.prayerTimesInfo')}
          onPress={() => router.push('/(tabs)/prayer')}
        />
        <ActionCard
          icon="compass-outline"
          title={t('qibla.title')}
          subtitle={t('travel.qiblaInfo')}
          onPress={() => router.push('/qibla')}
        />
        <ActionCard
          icon="business-outline"
          title={t('mosques.title')}
          subtitle={t('travel.mosquesInfo')}
          onPress={() => router.push('/mosques')}
        />
        <ActionCard
          icon="heart-outline"
          title={t('travel.duas')}
          subtitle={t('travel.duasInfo')}
          onPress={() => router.push('/duas/yolculuk')}
        />
      </View>

      <SectionHeader title={t('travel.offlineTitle')} />
      <Card>
        {[t('travel.offlinePrayer'), t('travel.offlineQibla'), t('travel.offlineDuas')].map((label) => (
          <View key={label} style={{ flexDirection: 'row', gap: Spacing.sm, paddingVertical: Spacing.xs }}>
            <Ionicons name="checkmark-circle" size={18} color={theme.success} />
            <ThemedText style={{ flex: 1 }}>{label}</ThemedText>
          </View>
        ))}
        <View
          style={{
            borderTopWidth: 1,
            borderTopColor: theme.border,
            marginTop: Spacing.sm,
            paddingTop: Spacing.md,
          }}
        >
          <ThemedText variant="caption">{t('travel.offlineMosquesInfo')}</ThemedText>
          <Button
            title={t('travel.prepareOffline')}
            variant="secondary"
            loading={preparing}
            onPress={() => void prepareOfflineMosques()}
            style={{ marginTop: Spacing.sm }}
          />
          {offlinePrepared !== 'idle' ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, marginTop: Spacing.sm }}>
              {offlinePrepared === 'ready' ? null : <ActivityIndicator size="small" color={theme.danger} />}
              <Ionicons
                name={offlinePrepared === 'ready' ? 'cloud-done-outline' : 'cloud-offline-outline'}
                size={17}
                color={offlinePrepared === 'ready' ? theme.success : theme.danger}
              />
              <ThemedText
                variant="caption"
                color={offlinePrepared === 'ready' ? theme.success : theme.danger}
                style={{ flex: 1 }}
              >
                {t(offlinePrepared === 'ready' ? 'travel.offlineReady' : 'travel.offlinePrepareError')}
              </ThemedText>
            </View>
          ) : null}
        </View>
      </Card>

      <View
        style={{
          flexDirection: 'row',
          gap: Spacing.sm,
          marginTop: Spacing.md,
          padding: Spacing.md,
          borderRadius: Radius.lg,
          backgroundColor: theme.surfaceAlt,
        }}
      >
        <Ionicons name="information-circle-outline" size={18} color={theme.textSecondary} />
        <ThemedText variant="caption" style={{ flex: 1 }}>{t('travel.foregroundNote')}</ThemedText>
      </View>
    </Screen>
  );
}
