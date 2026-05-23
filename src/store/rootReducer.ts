import type { AuthState } from './slices/auth'
import type { BaseState } from './slices/base'
import type { LocaleState } from './slices/locale/localeSlice'
import type { ThemeState } from './slices/theme/themeSlice'

export type RootState = {
  auth: AuthState
  base: BaseState
  locale: LocaleState
  theme: ThemeState
  /* eslint-disable @typescript-eslint/no-explicit-any */
}
