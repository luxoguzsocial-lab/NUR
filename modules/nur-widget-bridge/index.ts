import { requireNativeModule } from 'expo-modules-core';
import { Platform } from 'react-native';

interface NurWidgetBridgeModule {
  setWidgetData(json: string): void;
}

/**
 * iOS ana ekran widget'ına veri yazar (App Group + WidgetKit yenileme).
 * Yalnızca iOS development build / üretim IPA'sında etkilidir;
 * Expo Go, Android ve web'de sessizce atlanır.
 */
export function setWidgetData(json: string): void {
  if (Platform.OS !== 'ios') return;
  try {
    const mod = requireNativeModule<NurWidgetBridgeModule>('NurWidgetBridge');
    mod.setWidgetData(json);
  } catch {
    // Modül derlemede yoksa (Expo Go) widget güncellemesi atlanır.
  }
}
