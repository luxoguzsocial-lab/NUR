import * as Clipboard from 'expo-clipboard';
import { Platform, Share } from 'react-native';

import i18n from '@/i18n';
import { infoDialog } from '@/lib/dialogs';

/**
 * Platformlar-arası metin paylaşımı. React Native'in Share.share'i web'de
 * yalnızca Web Share API varsa çalışır (localhost/masaüstünde çoğunlukla yok
 * ve sessizce başarısız olur); bu durumda metin panoya kopyalanır ve
 * kullanıcı bilgilendirilir. iOS/Android'de yerel paylaşım sayfası açılır.
 */
export async function shareText(message: string): Promise<void> {
  if (Platform.OS === 'web') {
    const nav = navigator as Navigator & { share?: (data: { text: string }) => Promise<void> };
    if (typeof nav.share === 'function') {
      try {
        await nav.share({ text: message });
        return;
      } catch {
        // Kullanıcı iptal etti veya API reddetti — panoya düş.
      }
    }
    await Clipboard.setStringAsync(message);
    infoDialog('', i18n.t('common.copiedToClipboard'));
    return;
  }
  try {
    await Share.share({ message });
  } catch {
    // Kullanıcı paylaşımı iptal etti — sessiz geç.
  }
}
