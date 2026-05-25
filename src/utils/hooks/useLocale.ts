import { useEffect } from 'react';
// eslint-disable-next-line import/no-named-as-default
import i18n from 'i18next';
import dayjs from 'dayjs';
import { dateLocales } from '@/locales';

function useLocale() {
  useEffect(() => {
    const langKey = 'fa';
    if (i18n.language !== langKey) {
      i18n.changeLanguage(langKey);
    }
    document.documentElement.lang = langKey;
    document.documentElement.dir = 'rtl';

    const loader = dateLocales[langKey];
    if (loader) {
      loader().then(() => {
        dayjs.locale(langKey);
      });
    }
  }, []);

  return 'fa';
}

export default useLocale;
