import { createSlice } from '@reduxjs/toolkit'
import { isAccountType } from '../../constants/auth/accountTypes'

const AUTH_STORAGE_KEY = 'auth_session'

const initialState = {
  user: null,
  token: null,
  accountType: null,
  isAuthenticated: false,
  loading: false,
  error: '',
}

function persistAuthSession({ user, token, accountType }) {
  const authData = {
    user,
    token,
    accountType,
  }

  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData))
}

function clearPersistedSession() {
  localStorage.removeItem(AUTH_STORAGE_KEY)
}

function loadPersistedSession() {
  const serialized = localStorage.getItem(AUTH_STORAGE_KEY)
  if (!serialized) return initialState

  try {
    const parsed = JSON.parse(serialized)
    const accountType = isAccountType(parsed?.accountType) ? parsed.accountType : null
    const token = typeof parsed?.token === 'string' ? parsed.token : null
    const user = parsed?.user && typeof parsed.user === 'object' ? parsed.user : null
    const isAuthenticated = Boolean(user && token)

    if (!isAuthenticated || !accountType) {
      clearPersistedSession()
      return initialState
    }

    return {
      ...initialState,
      user,
      token,
      accountType,
      isAuthenticated,
    }
  } catch (error) {
    console.error('Failed to parse auth session from localStorage', error)
    clearPersistedSession()
    return initialState
  }
}

// إدارة حالة المصادقة وتخزين الجلسة (Authentication Slice)
const authSlice = createSlice({
  name: 'auth',
  initialState: loadPersistedSession(), // تحميل الجلسة المحفوظة من المتصفح عند التشغيل
  reducers: {
    // تحديث الحالة عند تسجيل الدخول بنجاح وحفظ البيانات في LocalStorage
    loginSuccess: (state, action) => {
      const payload = action.payload || {}
      // ... (existing code for setting state)
      const user = payload.user && typeof payload.user === 'object' ? payload.user : null
      const token = typeof payload.token === 'string' ? payload.token : null
      const accountType = isAccountType(payload.accountType) ? payload.accountType : null
      const isAuthenticated = Boolean(user && token && accountType)

      state.user = user
      state.token = token
      state.accountType = accountType
      state.isAuthenticated = isAuthenticated
      state.loading = false
      state.error = ''

      if (isAuthenticated) {
        persistAuthSession({ user, token, accountType })
      } else {
        clearPersistedSession()
      }
    },
    // مسح بيانات الجلسة عند تسجيل الخروج
    logout: (state) => {
      state.user = null
      state.token = null
      state.accountType = null
      state.isAuthenticated = false
      state.loading = false
      state.error = ''
      clearPersistedSession()
    },
    // تحديث بيانات المستخدم الحالية
    updateUser: (state, action) => {
      const nextUser = action.payload
      if (!nextUser || typeof nextUser !== 'object') {
        console.error('updateUser expects a user object payload')
        return
      }

      state.user = {
        ...(state.user || {}),
        ...nextUser,
      }
      persistAuthSession({
        user: state.user,
        token: state.token,
        accountType: state.accountType,
      })
    },
    // التحكم في حالة التحميل والخطأ
    setLoading: (state, action) => {
      state.loading = Boolean(action.payload)
    },
    setError: (state, action) => {
      state.error = typeof action.payload === 'string' ? action.payload : ''
    },
  },
})

export const { loginSuccess, logout, updateUser, setLoading, setError } = authSlice.actions
export default authSlice.reducer
