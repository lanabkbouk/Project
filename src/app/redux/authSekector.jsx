import { useSelector } from 'react-redux'

export const selectAuthState = (state) => state.auth
export const selectAuthUser = (state) => state.auth.user
export const selectAuthToken = (state) => state.auth.token
export const selectAuthLoading = (state) => state.auth.loading
export const selectAuthError = (state) => state.auth.error
export const selectAccountType = (state) => state.auth.accountType
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated

export function useAuth() {
  return useSelector((state) => ({
    user: selectAuthUser(state),
    token: selectAuthToken(state),
    accountType: selectAccountType(state),
    isAuthenticated: selectIsAuthenticated(state),
    loading: selectAuthLoading(state),
    error: selectAuthError(state),
  }))
}