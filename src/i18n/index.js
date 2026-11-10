import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import bn from './locales/bn.js';
import en from './locales/en.js';

const storedLanguage = localStorage.getItem('notes_api_language');
const browserLanguage = navigator.language?.toLowerCase().startsWith('bn') ? 'bn' : 'en';
const language = storedLanguage === 'bn' || storedLanguage === 'en' ? storedLanguage : browserLanguage;

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    bn: { translation: bn },
  },
  lng: language,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  returnNull: false,
});

i18n.on('languageChanged', (nextLanguage) => {
  localStorage.setItem('notes_api_language', nextLanguage);
  document.documentElement.lang = nextLanguage;
});

document.documentElement.lang = language;

export default i18n;
