import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { StateStorage } from 'zustand/middleware';
import { PERSIST_STORE_NAME } from '@/constants/app.constant';
import type { RootState } from './rootReducer';
import { initialAuthState } from './slices/auth';
import type { UserState } from './slices/auth/userSlice';
import type { UserInfoState } from './slices/auth/userInfoSlice';
import { initialBaseState } from './slices/base';
import { initialLocaleState } from './slices/locale/localeSlice';
import { initialThemeState } from './slices/theme/themeSlice';
import type { LayoutTypes } from '@/@types/layout';

const deepParseJson = (value: unknown): unknown => {
  if (typeof value !== 'string') {
    return value;
  }
  try {
    const parsed = JSON.parse(value) as unknown;
    return deepParseJson(parsed);
  } catch {
    return value;
  }
};

const reduxPersistCompatibleStorage: StateStorage = {
  getItem: (name) => {
    const raw = localStorage.getItem(name);
    if (!raw) {
      return null;
    }

    try {
      const parsed = JSON.parse(raw) as any;

      if (parsed && typeof parsed === 'object' && 'state' in parsed) {
        return raw;
      }

      if (parsed && typeof parsed === 'object' && ('auth' in parsed || 'locale' in parsed)) {
        const auth = deepParseJson(parsed.auth) as RootState['auth'] | undefined;
        const locale = deepParseJson(parsed.locale) as RootState['locale'] | undefined;

        const migrated = {
          state: {
            auth: auth ?? initialAuthState,
            base: initialBaseState,
            locale: locale ?? initialLocaleState,
            theme: initialThemeState,
          },
          version: 1,
        };

        return JSON.stringify(migrated);
      }

      return null;
    } catch {
      return null;
    }
  },
  setItem: (name, value) => {
    localStorage.setItem(name, value);
  },
  removeItem: (name) => {
    localStorage.removeItem(name);
  },
};

export const useAppStore = create<RootState>()(
  persist(
    () => ({
      auth: initialAuthState,
      base: initialBaseState,
      locale: initialLocaleState,
      theme: initialThemeState,
    }),
    {
      name: PERSIST_STORE_NAME,
      version: 1,
      partialize: (state) => ({
        auth: state.auth,
        locale: state.locale,
      }),
      storage: createJSONStorage(() => reduxPersistCompatibleStorage),
    }
  )
);

export type SignInSuccessPayload = {
  token: string;
  expireTime: number;
  refreshToken: string;
};

export const signInSuccess = (payload: SignInSuccessPayload) => {
  useAppStore.setState((state) => ({
    auth: {
      ...state.auth,
      session: {
        ...state.auth.session,
        signedIn: true,
        token: payload.token,
        expireTime: payload.expireTime,
        refreshToken: payload.refreshToken,
      },
    },
  }));
};

export const signOutSuccess = () => {
  useAppStore.setState((state) => ({
    auth: {
      ...state.auth,
      session: {
        ...state.auth.session,
        signedIn: false,
        token: null,
        refreshToken: null,
        expireTime: -1,
      },
    },
  }));
};

export const updateSession = (payload: SignInSuccessPayload) => {
  useAppStore.setState((state) => ({
    auth: {
      ...state.auth,
      session: {
        ...state.auth.session,
        token: payload.token,
        expireTime: payload.expireTime,
        refreshToken: payload.refreshToken,
      },
    },
  }));
};

export const setUser = (payload: UserState) => {
  useAppStore.setState((state) => ({
    auth: {
      ...state.auth,
      user: {
        ...state.auth.user,
        email: payload?.email,
        fullName: payload?.fullName,
        role: payload?.role,
        phoneNumber: payload?.phoneNumber,
      },
    },
  }));
};

export const setUserRole = (role: string[]) => {
  useAppStore.setState((state) => ({
    auth: {
      ...state.auth,
      user: {
        ...state.auth.user,
        role,
      },
    },
  }));
};

export const setUserName = (fullName: string) => {
  useAppStore.setState((state) => ({
    auth: {
      ...state.auth,
      user: {
        ...state.auth.user,
        fullName,
      },
    },
  }));
};

export const setUserInfo = (payload: UserInfoState) => {
  useAppStore.setState((state) => ({
    auth: {
      ...state.auth,
      userInfo: {
        ...state.auth.userInfo,
        userId: payload?.userId,
        email: payload?.email,
        language: payload?.language,
        role: payload?.role,
        walletAddress: payload?.walletAddress,
        name: payload?.name,
        googleLogin: payload.googleLogin,
        notificationCount: payload?.notificationCount,
        isTwoFaEnabled: payload?.isTwoFaEnabled,
      },
    },
  }));
};

export const setLanguage = (language: string) => {
  useAppStore.setState((state) => ({
    auth: {
      ...state.auth,
      userInfo: {
        ...state.auth.userInfo,
        language,
      },
    },
  }));
};

export const setUserInfoRole = (role: string) => {
  useAppStore.setState((state) => ({
    auth: {
      ...state.auth,
      userInfo: {
        ...state.auth.userInfo,
        role,
      },
    },
  }));
};

export const setDisplayName = (name: string) => {
  useAppStore.setState((state) => ({
    auth: {
      ...state.auth,
      userInfo: {
        ...state.auth.userInfo,
        name,
      },
    },
  }));
};

export const setWalletAddress = (walletAddress: string) => {
  useAppStore.setState((state) => ({
    auth: {
      ...state.auth,
      userInfo: {
        ...state.auth.userInfo,
        walletAddress,
      },
    },
  }));
};

export const setUserId = (userId: string) => {
  useAppStore.setState((state) => ({
    auth: {
      ...state.auth,
      userInfo: {
        ...state.auth.userInfo,
        userId,
      },
    },
  }));
};

export const setNotificationCount = (notificationCount: number) => {
  useAppStore.setState((state) => ({
    auth: {
      ...state.auth,
      userInfo: {
        ...state.auth.userInfo,
        notificationCount,
      },
    },
  }));
};

export const setTwoFactorAuth = (isTwoFaEnabled: boolean) => {
  useAppStore.setState((state) => ({
    auth: {
      ...state.auth,
      userInfo: {
        ...state.auth.userInfo,
        isTwoFaEnabled,
      },
    },
  }));
};

export const setCurrentRouteKey = (currentRouteKey: string) => {
  useAppStore.setState((state) => ({
    base: {
      ...state.base,
      common: {
        ...state.base.common,
        currentRouteKey,
      },
    },
  }));
};

export const setLang = (currentLang: string) => {
  useAppStore.setState((state) => ({
    locale: {
      ...state.locale,
      currentLang,
    },
  }));
};

export const setLayout = (currentLayout: LayoutTypes) => {
  useAppStore.setState((state) => ({
    theme: {
      ...state.theme,
      currentLayout,
    },
  }));
};

export default useAppStore;
