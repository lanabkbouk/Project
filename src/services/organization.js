// services/organization.js
//
// جلب وتحديث بروفايل المنظمة الحالية (المسجّلة دخول). بنفس نمط
//
// TODO: لما يجهز الباك اند، خلي VITE_USE_MOCK_ORGANIZATION_PROFILE=false
// GET  /api/organizations/me   → بروفايل المنظمة الحالية (فيها status)
// POST /api/organizations/me   (multipart, _method=PUT عند التحديث)
//
// ⚠️ ملاحظة مهمة: حقل "verification_documents" لازم يُرفع مرة وحدة بس
// عند إنشاء الحساب (بصفحة Register)، مو من هالصفحة — بعد الإنشاء يكون
// read-only هون، لأنه لو صار قابل للتعديل بعد التوثيق ممكن تتلاعب فيه
// المنظمة بعد ما توافق عليها السوبر أدمن.

import { apiClient, getApiErrorMessage } from './api/client'
import { ORGANIZATION_STATUS } from '../constants/organizationStatus'
import { AUTH_STORAGE_KEY } from '../constants/auth/storage'
import { loadMockUsers, updateMockUser } from './mock/mockUserStore'

const MOCK_MODE = (import.meta.env.VITE_USE_MOCK_ORGANIZATION_PROFILE || 'true') === 'true'

function wait(duration = 300) {
  return new Promise((resolve) => setTimeout(resolve, duration))
}

// إيميل المستخدم المسجّل دخوله حاليًا (من نفس الجلسة يلي AuthContext خزّنها)
// بنستخدمه لنلاقي سجل هالمنظمة بالضبط جوا mockUsers، بدل ما نرجّع بيانات ثابتة
function getCurrentSessionEmail() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)?.user?.email || null
  } catch {
    return null
  }
}

const EMPTY_ORGANIZATION = {
  name: '',
  email: '',
  contactPerson: '',
  description: '',
  city: '',
  website: '',
  imageUrl: null,
  status: ORGANIZATION_STATUS.PENDING,
  rejectionReason: null,
}

/**
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export async function fetchOrganizationProfile() {
  if (MOCK_MODE) {
    await wait()

    const email = getCurrentSessionEmail()
    const mockUser = email ? loadMockUsers().find((u) => u.email === email) : null

    // لو ما لقينا مستخدم (نادرًا)، نرجع كائن فاضي بدل ما نكسر الصفحة
    if (!mockUser) return { success: true, data: EMPTY_ORGANIZATION }

    return {
      success: true,
      data: {
        name: mockUser.orgName || '',
        email: mockUser.email || '',
        contactPerson: mockUser.contactPerson || '',
        description: mockUser.description || '',
        city: mockUser.city || '',
        website: mockUser.website || '',
        imageUrl: mockUser.imageUrl || null,
        status: mockUser.status || ORGANIZATION_STATUS.PENDING,
        rejectionReason: mockUser.rejectionReason || null,
      },
    }
  }

  try {
    const response = await apiClient.get('/organizations/me')
    return { success: true, data: response.data }
  } catch (error) {
    return { success: false, error: getApiErrorMessage(error, 'Failed to load organization profile') }
  }
}

/**
 * @param {FormData} formData - name/description/city/website + logo optional
 */
export async function updateOrganizationProfile(formData) {
  if (MOCK_MODE) {
    await wait()

    // نحفظ التعديلات فعليًا بنفس مخزن المستخدمين، عشان لما نرجع نفتح
    // البروفايل (أو نعمل refresh) البيانات تضل موجودة، مو ترجع فاضية
    const email = getCurrentSessionEmail()
    if (email) {
      updateMockUser(email, {
        orgName: formData.get('name') || '',
        description: formData.get('description') || '',
        city: formData.get('city') || '',
        website: formData.get('website') || '',
      })
    }

    return { success: true, data: { imageUrl: null } }
  }

  try {
    const response = await apiClient.post('/organizations/me', formData, {
      // نفس منطق mediaUpload.js: يُرسل POST مع _method=PUT (تمت إضافته
      // بالفورم قبل الإرسال) بسبب قيود PHP مع PUT + multipart.
      headers: { 'Content-Type': undefined },
    })
    return { success: true, data: response.data }
  } catch (error) {
    return { success: false, error: getApiErrorMessage(error, 'Failed to save organization profile') }
  }
}