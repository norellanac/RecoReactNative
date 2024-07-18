import { I18nManager } from 'react-native';
import { I18n } from 'i18n-js';
import memoize from 'lodash.memoize';
import { findBestLanguageTag } from "react-native-localize";
const i18n = new I18n();

const translationGetters = {
  // Lazy requires.
  es: () => require('../assets/translations/es.json'),

  // Add new translations here, for example:
  en: () => require('../assets/translations/en.json'),
};

export const translate = memoize(
  (key: any, params?: Record<string, unknown>) => i18n.t(key, params),
  (key: string, config: any) => (config ? key + JSON.stringify(config) : key),
);

export const setI18nConfig = (language:string) => {
  // Fallback if no available language fits.
  const isRTL = false;
  const fallback = { languageTag: language, isRTL };

  // const { languageTag } = findBestLanguageTag(Object.keys(translationGetters)) || fallback;

  // Update layout direction.
  I18nManager.forceRTL(isRTL);

  // Set i18n-js config.
  i18n.translations = { ['es']: translationGetters.es() };
  i18n.locale = 'es';
};