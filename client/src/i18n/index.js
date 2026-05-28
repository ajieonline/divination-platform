import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import zhCommon from './locales/zh/common.json';
import zhHome from './locales/zh/home.json';
import zhTarot from './locales/zh/tarot.json';
import zhZodiac from './locales/zh/zodiac.json';
import zhEightChar from './locales/zh/eight-char.json';
import zhIChing from './locales/zh/iching.json';
import zhSign from './locales/zh/sign.json';
import zhDream from './locales/zh/dream.json';
import zhDaily from './locales/zh/daily.json';
import zhProfile from './locales/zh/profile.json';
import zhVip from './locales/zh/vip.json';
import zhAdmin from './locales/zh/admin.json';
import zhName from './locales/zh/name.json';

import enCommon from './locales/en/common.json';
import enHome from './locales/en/home.json';
import enTarot from './locales/en/tarot.json';
import enZodiac from './locales/en/zodiac.json';
import enEightChar from './locales/en/eight-char.json';
import enIChing from './locales/en/iching.json';
import enSign from './locales/en/sign.json';
import enDream from './locales/en/dream.json';
import enDaily from './locales/en/daily.json';
import enProfile from './locales/en/profile.json';
import enVip from './locales/en/vip.json';
import enAdmin from './locales/en/admin.json';
import enName from './locales/en/name.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      zh: {
        common: zhCommon,
        home: zhHome,
        tarot: zhTarot,
        zodiac: zhZodiac,
        'eight-char': zhEightChar,
        iching: zhIChing,
        sign: zhSign,
        dream: zhDream,
        daily: zhDaily,
        profile: zhProfile,
        vip: zhVip,
        admin: zhAdmin,
        name: zhName,
      },
      en: {
        common: enCommon,
        home: enHome,
        tarot: enTarot,
        zodiac: enZodiac,
        'eight-char': enEightChar,
        iching: enIChing,
        sign: enSign,
        dream: enDream,
        daily: enDaily,
        profile: enProfile,
        vip: enVip,
        admin: enAdmin,
        name: enName,
      },
    },
    fallbackLng: 'zh',
    ns: ['common', 'daily', 'home', 'tarot', 'zodiac', 'eight-char', 'iching', 'sign', 'dream', 'profile', 'vip', 'admin', 'name'],
    defaultNS: 'common',
    interpolation: { escapeValue: false, prefix: '{', suffix: '}' },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
