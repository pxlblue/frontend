import { LOGIN, LOGOUT } from 'constants/actionTypes'

export const login = (session, profile) => ({
  type: LOGIN,
  payload: {
    session,
    profile,
  },
})

export const logout = () => ({
  type: LOGOUT,
})
