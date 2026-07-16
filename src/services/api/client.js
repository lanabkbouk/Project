import axios from 'axios'
import { AUTH_STORAGE_KEY } from '../../constants/auth/storage'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!raw) return config

    const { token } = JSON.parse(raw)
    if (typeof token === 'string' && token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  } catch {
    // ignore invalid session payload
  }

  return config
})

export function getApiErrorMessage(error, fallbackMessage = 'Something went wrong') {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.response?.data?.error || error.message || fallbackMessage
  }

  if (error instanceof Error) return error.message

  return fallbackMessage
}
