// جلب وتحديث بروفايل المنظمة الحالية (المسجّلة دخول). بنفس نمط
//
// TODO: لما يجهز الباك اند، خلي VITE_API_MODE=real
// GET  /api/organizations/me   → بروفايل المنظمة الحالية (فيها status)
// POST /api/organizations/me   (multipart, _method=PUT عند التحديث)
//
// ⚠️ ملاحظة مهمة: حقل "verification_documents" لازم يُرفع مرة وحدة بس
// عند إنشاء الحساب (بصفحة Register)، مو من هالصفحة — بعد الإنشاء يكون
// read-only هون، لأنه لو صار قابل للتعديل بعد التوثيق ممكن تتلاعب فيه
// المنظمة بعد ما توافق عليها السوبر أدمن.

import { apiClient, getApiErrorMessage } from './api/client'
import { isMockMode } from './api/mockMode'
import { wait } from './api/delay'
import { ORGANIZATION_STATUS } from '../constants/organizationStatus'
import { AUTH_STORAGE_KEY } from '../constants/auth/storage'
import { loadMockUsers, updateMockUser } from './mock/mockUserStore'
import { validateOrganizationProfileResponse } from '../utils/api/apiResponseSchemas'

const MOCK_MODE = isMockMode()

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

    // نتحقق من شكل الاستجابة قبل ما توصل لأي Component — لو حقل ناقص
    // أو النوع غلط، هون التحقق بيرجّع قيمة افتراضية آمنة أو خطأ واضح
    const validation = validateOrganizationProfileResponse(response.data)
    if (!validation.success) return validation

    return { success: true, data: validation.data }
  } catch (error) {
    return { success: false, error: getApiErrorMessage(error, 'Failed to load organization profile') }
  }
}

// يبني FormData لتحديث بروفايل المنظمة، مع إرفاق الشعار (logo) إن وُجد —
// نفس نمط buildOpportunityFormData بـ services/opportunities.js
function buildOrganizationFormData({ name, description, city, website }, logoFile) {
  const formData = new FormData()

  formData.append('name', name)
  formData.append('description', description)
  formData.append('city', city)
  formData.append('website', website || '')

  if (logoFile) formData.append('logo', logoFile)

  return formData
}

/**
 * @param {object} profileData - { name, description, city, website }
 * @param {File} [logoFile] - ملف الشعار الجديد إن اختاره المستخدم
 */
export async function updateOrganizationProfile(profileData, logoFile) {
  const formData = buildOrganizationFormData(profileData, logoFile)
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