import appConfig from '@/configs/app.config'

export type LocaleState = {
  currentLang: string
}

export const initialLocaleState: LocaleState = {
  currentLang: appConfig.locale,
}
