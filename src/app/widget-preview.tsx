import { Redirect } from 'expo-router';
import { Platform, ScrollView, View } from 'react-native';
import { WidgetPreview } from 'react-native-android-widget';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { NurVakitWidget, type WidgetPrayerRow } from '@/widgets/nur-vakit-widget';

const SAMPLE_ROWS: WidgetPrayerRow[] = [
  { label: 'İmsak', time: '04:20', isNext: false },
  { label: 'Güneş', time: '06:01', isNext: false },
  { label: 'Öğle', time: '13:15', isNext: false },
  { label: 'İkindi', time: '18:10', isNext: true },
  { label: 'Akşam', time: '20:18', isNext: false },
  { label: 'Yatsı', time: '21:51', isNext: false },
];

const MOCK_PALETTES = {
  night: {
    bg: '#0B1120',
    bgTop: '#1B2440',
    header: '#94A3B8',
    title: '#FFFFFF',
    remaining: '#B6C2D6',
    time: '#D4AF37',
    fill: '#D4AF37',
    track: 'rgba(255,255,255,0.16)',
    rowLabel: '#7C8AA5',
    rowTime: '#C7D2E4',
    chip: 'rgba(255,255,255,0.13)',
    nextLabel: '#F1E4B8',
    nextTime: '#FFFFFF',
    symbol: '☾',
  },
  day: {
    bg: '#EDF0F5',
    bgTop: '#FFFFFF',
    header: '#64748B',
    title: '#0F172A',
    remaining: '#64748B',
    time: '#A8821F',
    fill: '#B7912A',
    track: 'rgba(15,23,42,0.12)',
    rowLabel: '#8A94A6',
    rowTime: '#334155',
    chip: 'rgba(15,23,42,0.08)',
    nextLabel: '#7A6415',
    nextTime: '#0F172A',
    symbol: '☀',
  },
} as const;

/** Web/iOS için birebir görsel kopya — gerçek widget bileşeni yalnızca Android'de çizilebilir. */
function WidgetMock({ variant }: { variant: 'night' | 'day' }) {
  const c = MOCK_PALETTES[variant];
  return (
    <View
      style={{
        width: 340,
        height: 170,
        borderRadius: 28,
        backgroundColor: c.bg,
        paddingHorizontal: 18,
        paddingTop: 14,
        paddingBottom: 12,
        justifyContent: 'space-between',
        overflow: 'hidden',
      }}
    >
      {/* Gradyan hissi: üst yarıya açık katman */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 60,
          backgroundColor: c.bgTop,
        }}
      />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <ThemedText style={{ fontSize: 11, color: c.header, letterSpacing: 1 }}>
          {c.symbol} İSTANBUL
        </ThemedText>
        <ThemedText style={{ fontSize: 11, color: c.header }}>24 Safer 1448</ThemedText>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
        <View>
          <ThemedText style={{ fontSize: 26, lineHeight: 30, fontWeight: '700', color: c.title }}>
            İkindi
          </ThemedText>
          <ThemedText style={{ fontSize: 12, color: c.remaining, marginTop: 2 }}>
            2 sa 14 dk kaldı
          </ThemedText>
        </View>
        <ThemedText style={{ fontSize: 40, lineHeight: 44, fontWeight: '700', color: c.time }}>
          18:10
        </ThemedText>
      </View>
      <View
        style={{
          height: 5,
          borderRadius: 3,
          backgroundColor: c.track,
          marginTop: 8,
          marginBottom: 8,
          overflow: 'hidden',
        }}
      >
        <View style={{ width: '62%', height: '100%', borderRadius: 3, backgroundColor: c.fill }} />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        {SAMPLE_ROWS.map((row) => (
          <View
            key={row.label}
            style={{
              alignItems: 'center',
              backgroundColor: row.isNext ? c.chip : 'transparent',
              borderRadius: 10,
              paddingHorizontal: 7,
              paddingVertical: 4,
            }}
          >
            <ThemedText style={{ fontSize: 10, lineHeight: 13, color: row.isNext ? c.nextLabel : c.rowLabel }}>
              {row.label}
            </ThemedText>
            <ThemedText
              style={{
                fontSize: 12,
                lineHeight: 15,
                fontWeight: row.isNext ? '700' : '400',
                color: row.isNext ? c.nextTime : c.rowTime,
                marginTop: 1,
              }}
            >
              {row.time}
            </ThemedText>
          </View>
        ))}
      </View>
    </View>
  );
}

/**
 * Geliştirme amaçlı gizli ekran: ana ekran widget'ının tasarım önizlemesi.
 * Menülerden erişilmez; yalnızca /widget-preview adresiyle ve DEV modda açılır.
 */
export default function WidgetPreviewScreen() {
  const theme = useTheme();
  if (!__DEV__) return <Redirect href="/" />;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.background }}
      contentContainerStyle={{
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.lg,
        padding: Spacing.lg,
        flexGrow: 1,
      }}
    >
      <ThemedText variant="heading">Widget önizleme (4×2)</ThemedText>
      {Platform.OS === 'android' ? (
        <>
          <WidgetPreview
            width={340}
            height={170}
            renderWidget={() => (
              <NurVakitWidget
                prayerName="İkindi"
                time="18:10"
                remainingText="2 sa 14 dk kaldı"
                cityName="İstanbul"
                hijriText="24 Safer 1448"
                progress={0.62}
                rows={SAMPLE_ROWS}
                night
              />
            )}
          />
          <WidgetPreview
            width={340}
            height={170}
            renderWidget={() => (
              <NurVakitWidget
                prayerName="İkindi"
                time="18:10"
                remainingText="2 sa 14 dk kaldı"
                cityName="İstanbul"
                hijriText="24 Safer 1448"
                progress={0.62}
                rows={SAMPLE_ROWS}
                night={false}
              />
            )}
          />
        </>
      ) : (
        <>
          <ThemedText variant="caption">Gece (Akşam → Güneş)</ThemedText>
          <WidgetMock variant="night" />
          <ThemedText variant="caption">Gündüz</ThemedText>
          <WidgetMock variant="day" />
        </>
      )}
      <ThemedText variant="caption" style={{ textAlign: 'center' }}>
        Gerçek widget yalnızca development build / APK üzerinde ana ekrana eklenebilir.
      </ThemedText>
    </ScrollView>
  );
}
