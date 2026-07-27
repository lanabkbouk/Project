
// إحصائيات صفحة "About" (عدد المتطوعين/المنظمات/الفرص). نفس نمط باقي

// الاستجابة المتوقعة: { volunteersCount, organizationsCount, opportunitiesCount }
//
// ملاحظة: "citiesCoveredCount" مو مؤكد إذا رح يوفرها الباك اند — لازم
// نسأل فريق الباك اند إذا في مصدر بيانات لعدد المدن المغطاة، وإلا نشيل
// هالإحصائية من الصفحة نهائيًا بدل ما نخترعها.

import { apiClient, getApiErrorMessage } from './api/client'

const MOCK_MODE = (import.meta.env.VITE_USE_MOCK_STATS || 'true') === 'true'

const MOCK_STATS = {
  volunteersCount: 1240,
  organizationsCount: 86,
  opportunitiesCount: 312,
}

function wait(duration = 300) {
  return new Promise((resolve) => setTimeout(resolve, duration))
}

export async function fetchPlatformStats() {
  if (MOCK_MODE) {
    await wait()
    return { success: true, data: MOCK_STATS }
  }

  try {
    const response = await apiClient.get('/stats/summary')
    return { success: true, data: response.data }
  } catch (error) {
    return { success: false, error: getApiErrorMessage(error, 'Unable to load platform stats') }
  }
}