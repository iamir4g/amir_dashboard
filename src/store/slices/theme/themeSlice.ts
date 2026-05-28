import appConfig from '@/configs/app.config';
import { LayoutTypes } from '@/types/layout';

export type ThemeState = {
  currentLayout: LayoutTypes;
};

export const initialThemeState: ThemeState = {
  currentLayout: appConfig.layoutType,
};
