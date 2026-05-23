export interface SessionState {
  signedIn: boolean
  token: string | null
  expireTime: number
  refreshToken: string | null;
}

export const initialSessionState: SessionState = {
  signedIn: false,
  token:null,
  expireTime: 0,
  refreshToken: null
}
