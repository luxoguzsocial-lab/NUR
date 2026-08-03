import { FlexWidget, TextWidget } from 'react-native-android-widget';

/**
 * Ana ekran widget'ı: sıradaki namaz vakti.
 * Yalnızca Android'de, development build / üretim APK'sında çalışır
 * (Expo Go ve web'de widget altyapısı yoktur).
 */
export function NurVakitWidget({
  prayerName,
  time,
  remainingText,
  cityName,
}: {
  prayerName: string;
  time: string;
  remainingText: string;
  cityName: string;
}) {
  return (
    <FlexWidget
      clickAction="OPEN_APP"
      style={{
        height: 'match_parent',
        width: 'match_parent',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#12251F',
        borderRadius: 24,
        paddingHorizontal: 20,
        paddingVertical: 12,
      }}
    >
      <FlexWidget style={{ flexDirection: 'column' }}>
        <TextWidget
          text={`☾ ${cityName}`}
          style={{ fontSize: 11, color: '#7FBFAE', letterSpacing: 0.5 }}
        />
        <TextWidget
          text={prayerName}
          style={{ fontSize: 22, fontWeight: 'bold', color: '#FFFFFF', marginTop: 2 }}
        />
        <TextWidget text={remainingText} style={{ fontSize: 12, color: '#A9C9BF', marginTop: 2 }} />
      </FlexWidget>
      <TextWidget text={time} style={{ fontSize: 34, fontWeight: 'bold', color: '#3BA694' }} />
    </FlexWidget>
  );
}
