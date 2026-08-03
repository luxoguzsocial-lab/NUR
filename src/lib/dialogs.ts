import { Alert, Platform } from 'react-native';

/**
 * Platformlar-arası diyaloglar. React Native'in Alert.alert'i web'de sessizce
 * hiçbir şey yapmadığı için web'de tarayıcı diyaloglarına düşülür; iOS ve
 * Android'de yerel Alert kullanılır.
 */

export interface DialogOption {
  text: string;
  onPress?: () => void;
  destructive?: boolean;
}

/** Onaylı eylem: iptal + tek eylem butonu. */
export function confirmDialog(
  title: string,
  message: string,
  confirmText: string,
  onConfirm: () => void,
  cancelText: string,
  destructive = true,
): void {
  if (Platform.OS === 'web') {
    if (window.confirm(`${title}\n\n${message}`)) onConfirm();
    return;
  }
  Alert.alert(title, message, [
    { text: cancelText, style: 'cancel' },
    { text: confirmText, style: destructive ? 'destructive' : 'default', onPress: onConfirm },
  ]);
}

/** Bilgi mesajı (tek Tamam butonu, isteğe bağlı onPress). */
export function infoDialog(title: string, message: string, onDismiss?: () => void): void {
  if (Platform.OS === 'web') {
    window.alert(title ? `${title}\n\n${message}` : message);
    onDismiss?.();
    return;
  }
  Alert.alert(title, message, [{ text: 'Tamam', onPress: onDismiss }]);
}

/** Çok seçenekli diyalog (ör. bildirim nedeni seçimi). */
export function chooseDialog(
  title: string,
  message: string,
  options: DialogOption[],
  cancelText: string,
): void {
  if (Platform.OS === 'web') {
    const menu = options.map((o, i) => `${i + 1}) ${o.text}`).join('\n');
    const answer = window.prompt(`${title}\n${message}\n\n${menu}\n\n(1-${options.length})`);
    const index = Number(answer) - 1;
    if (Number.isInteger(index) && options[index]) options[index]!.onPress?.();
    return;
  }
  Alert.alert(title, message, [
    ...options.map((o) => ({
      text: o.text,
      style: o.destructive ? ('destructive' as const) : ('default' as const),
      onPress: o.onPress,
    })),
    { text: cancelText, style: 'cancel' as const },
  ]);
}
