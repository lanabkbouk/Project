import { ACCOUNT_TYPES } from '../constants/auth/accountTypes'
import { apiClient, getApiErrorMessage } from './api/client'

const MOCK_MODE = (import.meta.env.VITE_USE_MOCK_AUTH || 'true') === 'true'
const mockUsers = []

function wait(duration = 300) {
  return new Promise((resolve) => {
    setTimeout(resolve, duration)
  })
}

export async function registerUser(payload) {
  await wait()

  if (MOCK_MODE) {
    const normalizedEmail = payload.email.trim().toLowerCase()
    const existingUser = mockUsers.find((user) => user.email === normalizedEmail)

    if (existingUser) return { success: false, error: 'Email is already registered' }

    const normalizedUser = {
      ...payload,
      type: payload.type || ACCOUNT_TYPES.VOLUNTEER,
      email: normalizedEmail,
    }

    mockUsers.push(normalizedUser)
    return { success: true, data: normalizedUser }
  }

  try {
    const response = await apiClient.post('/auth/register', payload)
    return { success: true, data: response.data }
  } catch (error) {
    return { success: false, error: getApiErrorMessage(error, 'Unable to register account') }
  }
}

export async function loginUser(payload) {
  await wait()

  if (MOCK_MODE) {
    const normalizedEmail = payload.email.trim().toLowerCase()
    const existingUser = mockUsers.find((user) => user.email === normalizedEmail)

    if (!existingUser || existingUser.password !== payload.password) {
      return { success: false, error: 'Invalid email or password' }
    }

    return { success: true, data: existingUser }
  }

  try {
    const response = await apiClient.post('/auth/login', payload)
    return { success: true, data: response.data }
  } catch (error) {
    return { success: false, error: getApiErrorMessage(error, 'Unable to sign in') }
  }
}
