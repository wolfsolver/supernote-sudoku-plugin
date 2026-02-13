// i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './i18n/en.json';
import it from './i18n/it.json';
import cn from './i18n/cn.json';
import jp from './i18n/jp.json';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    it: { translation: it },
    cn: { translation: cn },
    jp: { translation: jp },
  },
  lng: 'en', // default language
  fallbackLng: 'en',
  interpolation: { escapeValue: false }
});

export default i18n;