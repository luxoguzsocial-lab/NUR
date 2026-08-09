import { FlexWidget, SvgWidget, TextWidget } from 'react-native-android-widget';

export interface WidgetPrayerRow {
  label: string;
  time: string;
  isNext: boolean;
}

/** Uygulamadaki lacivert+altın temanın widget karşılığı (gece/gündüz). */
const PALETTES = {
  night: {
    gradientFrom: '#1B2440',
    gradientTo: '#0B1120',
    header: '#94A3B8',
    title: '#FFFFFF',
    remaining: '#B6C2D6',
    time: '#D4AF37',
    progressFill: '#D4AF37',
    progressTrack: 'rgba(255,255,255,0.16)',
    rowLabel: '#7C8AA5',
    rowTime: '#C7D2E4',
    nextChipBg: '#FFFFFF22',
    nextLabel: '#F1E4B8',
    nextTime: '#FFFFFF',
    symbol: '☾',
  },
  day: {
    gradientFrom: '#FFFFFF',
    gradientTo: '#EDF0F5',
    header: '#64748B',
    title: '#0F172A',
    remaining: '#64748B',
    time: '#A8821F',
    progressFill: '#B7912A',
    progressTrack: 'rgba(15,23,42,0.12)',
    rowLabel: '#8A94A6',
    rowTime: '#334155',
    nextChipBg: '#0F172A14',
    nextLabel: '#7A6415',
    nextTime: '#0F172A',
    symbol: '☀',
  },
} as const;

/**
 * Ana ekran widget'ı (4×2): sıradaki namaz vakti paneli.
 * Gece penceresinde (Akşam→Güneş) lacivert+altın, gündüz açık tema.
 * Yalnızca Android'de, development build / üretim APK'sında çalışır
 * (Expo Go ve web'de widget altyapısı yoktur).
 */
export function NurVakitWidget({
  prayerName,
  time,
  remainingText,
  cityName,
  hijriText,
  progress,
  rows,
  night,
}: {
  prayerName: string;
  time: string;
  remainingText: string;
  cityName: string;
  hijriText: string;
  /** Önceki vakitten sıradaki vakte ilerleme (0..1). */
  progress: number;
  rows: WidgetPrayerRow[];
  night: boolean;
}) {
  const c = night ? PALETTES.night : PALETTES.day;
  const pct = Math.round(Math.min(1, Math.max(0, progress)) * 100);
  const progressSvg =
    `<svg viewBox="0 0 100 4" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">` +
    `<rect x="0" y="0" width="100" height="4" rx="2" fill="${c.progressTrack}"/>` +
    (pct > 0 ? `<rect x="0" y="0" width="${Math.max(pct, 3)}" height="4" rx="2" fill="${c.progressFill}"/>` : '') +
    `</svg>`;

  return (
    <FlexWidget
      clickAction="OPEN_APP"
      style={{
        height: 'match_parent',
        width: 'match_parent',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundGradient: { from: c.gradientFrom, to: c.gradientTo, orientation: 'TOP_BOTTOM' },
        borderRadius: 28,
        paddingHorizontal: 18,
        paddingTop: 14,
        paddingBottom: 12,
      }}
    >
      {/* Üst satır: şehir + hicri tarih */}
      <FlexWidget
        style={{
          width: 'match_parent',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <TextWidget
          text={`${c.symbol} ${cityName.toLocaleUpperCase('tr')}`}
          style={{ fontSize: 11, color: c.header, letterSpacing: 1 }}
        />
        <TextWidget text={hijriText} style={{ fontSize: 11, color: c.header }} />
      </FlexWidget>

      {/* Orta: sıradaki vakit + saat */}
      <FlexWidget
        style={{
          width: 'match_parent',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 4,
        }}
      >
        <FlexWidget style={{ flexDirection: 'column' }}>
          <TextWidget
            text={prayerName}
            style={{ fontSize: 26, fontWeight: 'bold', color: c.title }}
          />
          <TextWidget
            text={remainingText}
            style={{ fontSize: 12, color: c.remaining, marginTop: 2 }}
          />
        </FlexWidget>
        <TextWidget
          text={time}
          style={{ fontSize: 40, fontWeight: 'bold', color: c.time }}
        />
      </FlexWidget>

      {/* İlerleme çubuğu */}
      <SvgWidget
        svg={progressSvg}
        style={{ width: 'match_parent', height: 5, marginTop: 8, marginBottom: 8 }}
      />

      {/* Alt satır: günün 6 vakti */}
      <FlexWidget
        style={{
          width: 'match_parent',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {rows.map((row) => (
          <FlexWidget
            key={row.label}
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: row.isNext ? c.nextChipBg : '#FFFFFF00',
              borderRadius: 10,
              paddingHorizontal: 7,
              paddingVertical: 4,
            }}
          >
            <TextWidget
              text={row.label}
              style={{ fontSize: 10, color: row.isNext ? c.nextLabel : c.rowLabel }}
            />
            <TextWidget
              text={row.time}
              style={{
                fontSize: 12,
                fontWeight: row.isNext ? 'bold' : 'normal',
                color: row.isNext ? c.nextTime : c.rowTime,
                marginTop: 1,
              }}
            />
          </FlexWidget>
        ))}
      </FlexWidget>
    </FlexWidget>
  );
}
