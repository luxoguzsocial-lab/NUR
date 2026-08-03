// Özel giriş noktası: expo-router + Android widget görev kaydı.
// Widget yalnızca Android development build / üretim APK'sında etkindir;
// Expo Go ve web'de bu blok atlanır.
import { Platform } from 'react-native';

import 'expo-router/entry';

if (Platform.OS === 'android') {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { registerWidgetTaskHandler } = require('react-native-android-widget');
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { widgetTaskHandler } = require('./src/widgets/widget-task-handler');
  registerWidgetTaskHandler(widgetTaskHandler);
}
