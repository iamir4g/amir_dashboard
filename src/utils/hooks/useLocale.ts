import { useEffect } from 'react'
// eslint-disable-next-line import/no-named-as-default
import i18n from 'i18next'
import dayjs from 'dayjs'
import { dateLocales } from '@/locales'
import { useAppSelector } from '@/store'

const getLangKey = (locale: string) => {
  const trimmed = locale.trim()
  if (trimmed.toLowerCase().startsWith('fa')) {
    return 'fa'
  }
  return trimmed.replace(/-([a-z])/g, function (g: any) {
    return g[1].toUpperCase()
  })
}

function useLocale() {
  const locale = useAppSelector((state) => state.locale.currentLang)

  useEffect(() => {
    const langKey = getLangKey(locale)
    if (langKey !== i18n.language) {
      i18n.changeLanguage(langKey)
    }
    document.documentElement.lang = langKey
    document.documentElement.dir = langKey === 'fa' ? 'rtl' : 'ltr'

    const loader = dateLocales[langKey]
    if (loader) {
      loader().then(() => {
        dayjs.locale(langKey)
      })
    }
  }, [locale])

  return locale
}

export default useLocale
