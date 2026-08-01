import axios from 'axios'
import { AUTH_STORAGE_KEY } from '../../constants/auth/storage'
import { ROUTES } from '../../constants/paths'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

// لا نضبط Content-Type بشكل ثابت هنا: axios يحدده تلقائيًا
// (application/json للكائنات العادية، أو multipart/form-data مع الـ boundary الصحيح عند إرسال FormData)
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
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

// Laravel API Resources تلف كل استجابة (عنصر واحد أو قائمة) بمفتاح "data"،
// وأحيانًا تضيف "meta"/"links" مع الـ Pagination. كنا نفكّ هالتغليف يدويًا
// وبأشكال مختلفة داخل كل ملف خدمة على حدة:
//   Array.isArray(response.data) ? response.data : response.data?.data || []
// نفكّه هون مرة وحدة بس، فيصير كود كل خدمة يتعامل مع response.data مباشرة
// وكأنه البيانات النهائية فعلاً، بغض النظر إذا كانت قائمة أو كائن واحد.
function unwrapLaravelEnvelope(response) {
  const body = response.data

  if (body && typeof body === 'object' && !Array.isArray(body) && 'data' in body) {
    response.meta = body.meta
    response.links = body.links
    response.data = body.data
  }

  return response
}

// عند انتهاء صلاحية التوكن أو رفضه (401)، الجلسة القديمة صارت عديمة الفائدة:
// نمسحها فورًا ونرجّع المستخدم لصفحة تسجيل الدخول، بدل ما يضل "مسجل دخول"
// شكليًا وهو فعليًا مرفوض من كل استدعاء API لاحق.
apiClient.interceptors.response.use(
  (response) => unwrapLaravelEnvelope(response),
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      localStorage.removeItem(AUTH_STORAGE_KEY)

      // تجنّب حلقة تحويل لا نهائية لو الـ 401 صار أصلًا من صفحة تسجيل الدخول نفسها
      if (window.location.pathname !== ROUTES.LOGIN) {
        window.location.assign(ROUTES.LOGIN)
      }
    }

    return Promise.reject(error)
  },
)

export function getApiErrorMessage(error, fallbackMessage = 'Something went wrong') {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.response?.data?.error || error.message || fallbackMessage
  }

  if (error instanceof Error) return error.message

  return fallbackMessage
}