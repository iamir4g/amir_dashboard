import { initialCommonState, CommonState } from './commonSlice';

export type BaseState = {
  common: CommonState;
};

export const initialBaseState: BaseState = {
  common: initialCommonState,
};

export * from './commonSlice';
