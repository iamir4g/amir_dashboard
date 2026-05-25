import type { RootState } from './rootReducer';
import { useAppStore } from './storeSetup';

export const useAppSelector = <TSelected>(selector: (state: RootState) => TSelected) =>
  useAppStore(selector);
