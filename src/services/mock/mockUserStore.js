import { MOCK_USERS_STORAGE_KEY } from '../../constants/auth/storage'

// قراءة قائمة المستخدمين الوهميين من التخزين المحلي
export function loadMockUsers() {
  try {
    const raw = localStorage.getItem(MOCK_USERS_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

// حفظ قائمة المستخدمين الوهميين كاملة
export function saveMockUsers(users) {
  localStorage.setItem(MOCK_USERS_STORAGE_KEY, JSON.stringify(users))
}

// تحديث حقول مستخدم وهمي محدد عبر البريد الإلكتروني، وإرجاع النسخة المحدَّثة
export function updateMockUser(email, updates) {
  const users = loadMockUsers()
  const normalizedEmail = String(email || '').trim().toLowerCase()
  const index = users.findIndex((user) => user.email === normalizedEmail)

  if (index === -1) return null

  const updatedUser = { ...users[index], ...updates }
  users[index] = updatedUser
  saveMockUsers(users)

  return updatedUser
}