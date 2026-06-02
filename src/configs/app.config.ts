import { LayoutTypes } from '@/types/layout';

export type AppConfig = {
  apiPrefix: string;
  authenticatedEntryPath: string;
  unAuthenticatedEntryPath: string;
  enableMock: boolean;
  locale: string;
  layoutType: LayoutTypes;
};

const getApiPrefix = (): string => {
  const raw = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '';
  return raw.replace(/\/+$/, '');
};

const appConfig: AppConfig = {
  layoutType: LayoutTypes.CollapsibleAppShell,
  apiPrefix: getApiPrefix(),
  authenticatedEntryPath: '/dashboard',
  unAuthenticatedEntryPath: '/sign-in',
  enableMock: (import.meta.env.VITE_ENABLE_MOCK as string | undefined) === 'true',
  locale: 'fa',
};

export default appConfig;
