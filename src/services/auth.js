import { ACCOUNT_TYPES } from '../constants/auth/accountTypes'
import { MOCK_USERS_STORAGE_KEY } from '../constants/auth/storage'
import { apiClient, getApiErrorMessage } from './api/client'
import { isMockMode } from './api/mockMode'
import { wait } from './api/delay'
import { normalizeUser } from '../utils/auth/normalizeUser'

const MOCK_MODE = isMockMode()

function loadMockUsers() {
  try {
    const raw = localStorage.getItem(MOCK_USERS_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveMockUsers(users) {
  localStorage.setItem(MOCK_USERS_STORAGE_KEY, JSON.stringify(users))
}

// إزالة كلمة المرور من بيانات المستخدم قبل تخزينها في الـ Context
function sanitizeUser(user) {
  if (!user || typeof user !== 'object') return null
  const safeUser = { ...user }
  delete safeUser.password
  return safeUser
}

// استخراج ملف واحد سواء وصل كـ FileList (من react-hook-form) أو كـ File مباشرة
function extractFile(value) {
  if (typeof FileList !== 'undefined' && value instanceof FileList) return value[0] || null
  return value || null
}

// تحديد نوع الحساب من استجابة الباك اند الحقيقي (roles) أو من بيانات الـ Mock (accountType)
function resolveAccountType(data) {
  const roles = data?.roles
  if (Array.isArray(roles)) {
    if (roles.includes(ACCOUNT_TYPES.ORGANIZATION)) return ACCOUNT_TYPES.ORGANIZATION
    if (roles.includes(ACCOUNT_TYPES.VOLUNTEER)) return ACCOUNT_TYPES.VOLUNTEER
  }

  if (data?.accountType === ACCOUNT_TYPES.ORGANIZATION) return ACCOUNT_TYPES.ORGANIZATION
  if (data?.accountType === ACCOUNT_TYPES.VOLUNTEER) return ACCOUNT_TYPES.VOLUNTEER

  return ACCOUNT_TYPES.VOLUNTEER
}

// بناء بيانات المصادقة (user/token/accountType) من استجابة الـ API أو الـ Mock
// ملاحظة: apiClient يفكّ تغليف Laravel تلقائيًا (راجع unwrapLaravelEnvelope
// في api/client.js)، فـ responseData هون هو { user, token } مباشرة، بدون
// أي حاجة لقراءة response.data.data يدويًا هنا
function buildAuthPayload(responseData, fallbackEmail = '') {
  const apiUser = responseData?.user
  const apiToken = responseData?.token

  // يدعم كلا الحالتين: استجابة الـ API الحقيقي (apiUser) أو كائن الـ Mock المسطّح
  // normalizeUser هي نقطة التطبيع الوحيدة: تُنتج displayName و avatarUrl جاهزين
  const user = normalizeUser(sanitizeUser(apiUser || responseData))
  const accountType = resolveAccountType(apiUser || responseData)

  const tokenFromApi = typeof apiToken === 'string' ? apiToken : null
  const token = tokenFromApi || `mock-token-${fallbackEmail || 'user'}-${Date.now()}`

  return { user, token, accountType }
}

// تحويل بيانات نموذج التسجيل (camelCase) إلى FormData بأسماء حقول Laravel (snake_case)
// نستخدم FormData دائمًا لأن حساب المنظمة يتطلب رفع ملف verification_document
function buildRegisterFormData(payload) {
  const formData = new FormData()

  formData.append('account_type', payload.accountType)
  formData.append('email', payload.email.trim().toLowerCase())
  formData.append('password', payload.password)
  formData.append('password_confirmation', payload.password)

  // الهاتف مطلوب دائمًا هون (تم التحقق منه مسبقًا بـ validation.js)، فما في
  // داعي لشرط "if" وكأنه ممكن يكون فاضي — التناقض القديم بين الفورم (يمنع
  // الإرسال بدون هاتف) والكود هون (كان يتعامل معه كاختياري) صار محلول
  formData.append('phone_number', payload.phone)

  if (payload.accountType === ACCOUNT_TYPES.VOLUNTEER) {
    formData.append('first_name', payload.firstName)
    formData.append('last_name', payload.lastName)
  } else {
    formData.append('organization_name', payload.orgName)
    formData.append('contact_person', payload.contactPerson)

    const verificationFile = extractFile(payload.verificationImage)
    if (verificationFile) formData.append('verification_document', verificationFile)
  }

  return formData
}

export async function registerUser(payload) {
  await wait()

  if (MOCK_MODE) {
    const mockUsers = loadMockUsers()
    const normalizedEmail = payload.email.trim().toLowerCase()
    const existingUser = mockUsers.find((user) => user.email === normalizedEmail)

    if (existingUser) return { success: false, error: 'Email is already registered' }

    const normalizedUser = {
      ...payload,
      accountType: payload.accountType || ACCOUNT_TYPES.VOLUNTEER,
      email: normalizedEmail,
    }

    mockUsers.push(normalizedUser)
    saveMockUsers(mockUsers)

    return { success: true, data: buildAuthPayload(normalizedUser, normalizedEmail) }
  }

  try {
    const formData = buildRegisterFormData(payload)
    const response = await apiClient.post('/register', formData)
    return { success: true, data: buildAuthPayload(response.data, payload.email.trim().toLowerCase()) }
  } catch (error) {
    return { success: false, error: getApiErrorMessage(error, 'Unable to register account') }
  }
}

export async function loginUser(payload) {
  await wait()

  if (MOCK_MODE) {
    const mockUsers = loadMockUsers()
    const normalizedEmail = payload.email.trim().toLowerCase()
    const existingUser = mockUsers.find((user) => user.email === normalizedEmail)

    if (!existingUser || existingUser.password !== payload.password) {
      return { success: false, error: 'Invalid email or password' }
    }

    return {
      success: true,
      data: buildAuthPayload(existingUser, normalizedEmail),
    }
  }

  try {
    const response = await apiClient.post('/login', payload)
    return {
      success: true,
      data: buildAuthPayload(response.data, payload.email.trim().toLowerCase()),
    }
  } catch (error) {
    return { success: false, error: getApiErrorMessage(error, 'Unable to sign in') }
  }
}