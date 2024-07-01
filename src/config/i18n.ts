import i18n from 'i18next'
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

const DETECTION_OPTIONS = {
  caches: ['localStorage'],
  order: ['querystring', 'localStorage', 'navigator']
};

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    detection: DETECTION_OPTIONS,
    fallbackLng: 'en',
    ns: ['translation'],
    defaultNS: 'translation',
    backend: {
      loadPath: 'locales/{{lng}}/{{ns}}.json',
    },
    react: {
      bindI18n: 'languageChanged',
      transKeepBasicHtmlNodesFor: ['br', 'strong'],
      useSuspense: true,
    },
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
