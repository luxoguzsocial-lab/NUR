import { FlexWidget, SvgWidget, TextWidget } from 'react-native-android-widget';

const COLORS = {
  night: {
    from: '#1B2440',
    to: '#0B1120',
    text: '#FFFFFF',
    secondary: '#B6C2D6',
    accent: '#D4AF37',
    track: '#FFFFFF22',
  },
  day: {
    from: '#FFFFFF',
    to: '#EDF0F5',
    text: '#0F172A',
    secondary: '#64748B',
    accent: '#A8821F',
    track: '#0F172A18',
  },
} as const;

/** Android 2x2: siradaki vakit + bugunun yolculugu + haftalik sakin hedef. */
export function NurBugunWidget({
  prayerName,
  prayerTime,
  remainingText,
  journeyCompleted,
  journeyTotal,
  weekCompleted,
  weekGoal,
  nextAction,
  night,
}: {
  prayerName: string;
  prayerTime: string;
  remainingText: string;
  journeyCompleted: number;
  journeyTotal: number;
  weekCompleted: number;
  weekGoal: number;
  nextAction: string;
  night: boolean;
}) {
  const c = night ? COLORS.night : COLORS.day;
  const pct = Math.round((journeyCompleted / Math.max(1, journeyTotal)) * 100);
  const progressSvg =
    '<svg viewBox="0 0 100 5" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">' +
    `<rect width="100" height="5" rx="2.5" fill="${c.track}"/>` +
    (pct > 0 ? `<rect width="${Math.max(4, pct)}" height="5" rx="2.5" fill="${c.accent}"/>` : '') +
    '</svg>';

  return (
    <FlexWidget
      clickAction="OPEN_APP"
      accessibilityLabel={`Siradaki vakit ${prayerName} ${prayerTime}. Bugunun yolculugu ${journeyCompleted}/${journeyTotal}.`}
      style={{
        width: 'match_parent',
        height: 'match_parent',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundGradient: { from: c.from, to: c.to, orientation: 'TOP_BOTTOM' },
        borderRadius: 26,
        padding: 14,
      }}
    >
      <FlexWidget style={{ width: 'match_parent', flexDirection: 'row', justifyContent: 'space-between' }}>
        <TextWidget text="NUR · BUGÜN" style={{ fontSize: 10, fontWeight: 'bold', color: c.secondary, letterSpacing: 1 }} />
        <TextWidget text={`${weekCompleted}/${weekGoal} hafta`} style={{ fontSize: 10, color: c.secondary }} />
      </FlexWidget>

      <FlexWidget style={{ width: 'match_parent', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <FlexWidget style={{ flexDirection: 'column' }}>
          <TextWidget text={prayerName} style={{ fontSize: 22, fontWeight: 'bold', color: c.text }} />
          <TextWidget text={remainingText} style={{ fontSize: 10, color: c.secondary, marginTop: 1 }} />
        </FlexWidget>
        <TextWidget text={prayerTime} style={{ fontSize: 29, fontWeight: 'bold', color: c.accent }} />
      </FlexWidget>

      <FlexWidget style={{ width: 'match_parent', flexDirection: 'column' }}>
        <FlexWidget style={{ width: 'match_parent', flexDirection: 'row', justifyContent: 'space-between' }}>
          <TextWidget text="Yolculuk" style={{ fontSize: 10, color: c.secondary }} />
          <TextWidget text={`${journeyCompleted}/${journeyTotal}`} style={{ fontSize: 10, fontWeight: 'bold', color: c.accent }} />
        </FlexWidget>
        <SvgWidget svg={progressSvg} style={{ width: 'match_parent', height: 5, marginTop: 4 }} />
        <TextWidget text={nextAction} style={{ fontSize: 11, color: c.text, marginTop: 7 }} maxLines={1} />
      </FlexWidget>
    </FlexWidget>
  );
}

