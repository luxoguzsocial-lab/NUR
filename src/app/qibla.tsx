import { Ionicons } from '@expo/vector-icons';
import { Magnetometer, type MagnetometerMeasurement } from 'expo-sensors';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { Card } from '@/components/card';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { distanceToKaabaKm, qiblaBearing, qiblaOffset } from '@/lib/qibla';
import { useSettingsStore } from '@/store/settings';

/** Manyetometre vektöründen pusula başlığı (derece, 0 = kuzey). */
function headingFrom({ x, y }: MagnetometerMeasurement): number {
  let angle = Math.atan2(y, x) * (180 / Math.PI);
  angle = angle - 90;
  if (angle < 0) angle += 360;
  return 360 - angle;
}

export default function QiblaScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const location = useSettingsStore((s) => s.location);
  const [heading, setHeading] = useState<number | null>(null);
  const [sensorAvailable, setSensorAvailable] = useState<boolean | null>(null);
  const [lowAccuracy, setLowAccuracy] = useState(false);
  const samples = useRef<number[]>([]);

  const bearing = useMemo(
    () => qiblaBearing(location.latitude, location.longitude),
    [location.latitude, location.longitude],
  );
  const distance = useMemo(
    () => distanceToKaabaKm(location.latitude, location.longitude),
    [location.latitude, location.longitude],
  );

  useEffect(() => {
    let sub: ReturnType<typeof Magnetometer.addListener> | null = null;
    void Magnetometer.isAvailableAsync().then((available) => {
      setSensorAvailable(available);
      if (!available) return;
      Magnetometer.setUpdateInterval(120);
      sub = Magnetometer.addListener((data) => {
        const h = headingFrom(data);
        setHeading(h);
        // Basit kalibrasyon sezgisi: alan şiddeti tipik aralık dışındaysa uyar
        const magnitude = Math.sqrt(data.x ** 2 + data.y ** 2 + data.z ** 2);
        samples.current = [...samples.current.slice(-20), magnitude];
        const avg = samples.current.reduce((a, b) => a + b, 0) / samples.current.length;
        setLowAccuracy(avg < 20 || avg > 75);
      });
    });
    return () => sub?.remove();
  }, []);

  const offset = heading !== null ? qiblaOffset(heading, bearing) : null;
  const aligned = offset !== null && Math.abs(offset) < 5;

  return (
    <Screen>
      <Card>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View>
            <ThemedText variant="caption">{t('qibla.bearing')}</ThemedText>
            <ThemedText variant="heading">{bearing.toFixed(1)}°</ThemedText>
            <ThemedText variant="caption">{t('qibla.fromNorth')}</ThemedText>
          </View>
          <View>
            <ThemedText variant="caption">{t('qibla.distance')}</ThemedText>
            <ThemedText variant="heading">{Math.round(distance).toLocaleString()} km</ThemedText>
            <ThemedText variant="caption">{location.cityName}</ThemedText>
          </View>
        </View>
      </Card>

      {lowAccuracy && sensorAvailable ? (
        <Card tone="accent" style={{ marginTop: Spacing.sm }}>
          <ThemedText variant="secondary">{t('qibla.calibrationWarning')}</ThemedText>
        </Card>
      ) : null}

      {sensorAvailable === false ? (
        <Card tone="accent" style={{ marginTop: Spacing.sm }}>
          <ThemedText variant="secondary">{t('qibla.sensorUnavailable')}</ThemedText>
        </Card>
      ) : null}

      {/* Pusula */}
      <View style={{ alignItems: 'center', marginTop: Spacing.xl }}>
        <View
          style={{
            width: 280,
            height: 280,
            borderRadius: 140,
            borderWidth: 3,
            borderColor: aligned ? theme.success : theme.border,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.surface,
          }}
        >
          {/* Kuzey işareti — pusula döndükçe döner */}
          <View
            style={{
              position: 'absolute',
              width: 280,
              height: 280,
              alignItems: 'center',
              transform: [{ rotate: `${-(heading ?? 0)}deg` }],
            }}
          >
            <ThemedText variant="label" color={theme.danger} style={{ marginTop: 8 }}>
              N
            </ThemedText>
          </View>
          {/* Kıble oku — kuzeye göre bearing kadar dönük */}
          <View
            style={{
              position: 'absolute',
              width: 280,
              height: 280,
              alignItems: 'center',
              justifyContent: 'flex-start',
              transform: [{ rotate: `${bearing - (heading ?? 0)}deg` }],
            }}
          >
            <Ionicons
              name="navigate"
              size={64}
              color={aligned ? theme.success : theme.primary}
              style={{ marginTop: 28, transform: [{ rotate: '-45deg' }] }}
            />
          </View>
          <View style={{ alignItems: 'center', marginTop: 90 }}>
            <ThemedText variant="title" color={aligned ? theme.success : theme.text}>
              {offset !== null ? `${Math.abs(Math.round(offset))}°` : `${bearing.toFixed(0)}°`}
            </ThemedText>
            <ThemedText variant="secondary" style={{ textAlign: 'center' }}>
              {offset === null
                ? t('qibla.mapAlternative')
                : aligned
                  ? t('qibla.facingQibla')
                  : offset > 0
                    ? t('qibla.turnRight')
                    : t('qibla.turnLeft')}
            </ThemedText>
          </View>
        </View>
      </View>

      {/* Sayısal gösterim — sensör olmadığında birincil yöntem */}
      <Card style={{ marginTop: Spacing.xl }}>
        <ThemedText variant="heading">{t('qibla.mapAlternative')}</ThemedText>
        <ThemedText variant="secondary" style={{ marginTop: Spacing.xs }}>
          {t('qibla.bearing')}: {bearing.toFixed(1)}° — {t('qibla.fromNorth')}
        </ThemedText>
        <ThemedText variant="caption" style={{ marginTop: Spacing.xs }}>
          {location.cityName} → Kâbe: {Math.round(distance).toLocaleString()} km
        </ThemedText>
      </Card>
    </Screen>
  );
}
