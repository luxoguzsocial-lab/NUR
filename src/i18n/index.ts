import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { I18nManager } from 'react-native';

import { ar } from '@/i18n/locales/ar';
import { en } from '@/i18n/locales/en';
import { tr } from '@/i18n/locales/tr';
import type { Language } from '@/store/settings';

void i18n.use(initReactI18next).init({
  resources: {
    tr: { translation: tr },
    en: { translation: en },
    ar: { translation: ar },
  },
  lng: 'tr',
  fallbackLng: 'tr',
  interpolation: { escapeValue: false },
  returnEmptyString: false,
});

export function applyLanguage(language: Language): void {
  void i18n.changeLanguage(language);
  const shouldRTL = language === 'ar';
  if (I18nManager.isRTL !== shouldRTL) {
    I18nManager.allowRTL(shouldRTL);
    I18nManager.forceRTL(shouldRTL);
    // Not: RTL değişikliğinin tam etkisi uygulama yeniden başlatılınca görülür.
  }
}

export default i18n;
