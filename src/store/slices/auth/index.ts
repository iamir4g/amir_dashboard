import { initialSessionState, SessionState } from './sessionSlice'
import { initialUserState, UserState } from './userSlice'
import { initialUserInfoState, UserInfoState } from './userInfoSlice'

export type AuthState = {
  session: SessionState
  user: UserState,
  userInfo: UserInfoState,
}

export const initialAuthState: AuthState = {
  session: initialSessionState,
  user: initialUserState,
  userInfo: initialUserInfoState,
}

export * from './sessionSlice'
export * from './userSlice'
export * from './userInfoSlice'
