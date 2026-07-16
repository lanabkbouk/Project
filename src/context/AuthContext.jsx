import { createContext, useContext, useState } from 'react'
import { isAccountType } from '../constants/auth/accountTypes'
import { AUTH_STORAGE_KEY } from '../constants/auth/storage'

const AuthContext = createContext(null)

const emptySession = {
  user: null,
  token: null,
  accountType: null,
  isAuthenticated: false,
}

function loadPersistedSession() {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY)
  if (!raw) return emptySession

  try {
    const parsed = JSON.parse(raw)
    const accountType = isAccountType(parsed?.accountType) ? parsed.accountType : null
    const token = typeof parsed?.token === 'string' ? parsed.token : null
    const user = parsed?.user && typeof parsed.user === 'object' ? parsed.user : null

    if (!user || !token || !accountType) {
      localStorage.removeItem(AUTH_STORAGE_KEY)
      return emptySession
    }

    return { user, token, accountType, isAuthenticated: true }
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    return emptySession
  }
}

function persistSession({ user, token, accountType }) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user, token, accountType }))
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(loadPersistedSession)

  const login = (payload = {}) => {
    const user = payload.user && typeof payload.user === 'object' ? payload.user : null
    const token = typeof payload.token === 'string' ? payload.token : null
    const accountType = isAccountType(payload.accountType) ? payload.accountType : null

    if (!user || !token || !accountType) {
      setSession(emptySession)
      localStorage.removeItem(AUTH_STORAGE_KEY)
      return false
    }

    const next = { user, token, accountType, isAuthenticated: true }
    setSession(next)
    persistSession(next)
    return true
  }

  const logout = () => {
    setSession(emptySession)
    localStorage.removeItem(AUTH_STORAGE_KEY)
  }

  const updateUser = (nextUser) => {
    if (!nextUser || typeof nextUser !== 'object') return

    setSession((current) => {
      if (!current.isAuthenticated) return current

      const user = { ...(current.user || {}), ...nextUser }
      const next = { ...current, user }
      persistSession(next)
      return next
    })
  }

  return (
    <AuthContext.Provider value={{ ...session, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
