export interface UserState {
  fullName?: string
  phoneNumber?: string
  email?: string
  role?: string[]
}

export const initialUserState: UserState = {
  fullName: '',
  email: '',
  role: [],
}
