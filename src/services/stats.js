import { isMockMode } from './api/mockMode'
import { apiClient, getApiErrorMessage } from './api/client'

// بيانات تجريبية لوضع المحاكاة فقط — يجب استبدالها بالكامل من الباك عبر Endpoint واحد

const MOCK_STATS = {
  volunteersCount: 1240,
  organizationsCount: 86,
  opportunitiesCount: 312,
}

export async function fetchPlatformStats() {
  if (isMockMode()) {
    return { success: true, data: MOCK_STATS }
  }

  try {
    const response = await apiClient.get('/stats/summary')
    return { success: true, data: response.data }
  } catch (error) {
    return { success: false, error: getApiErrorMessage(error, 'Unable to load platform stats') }
  }
}