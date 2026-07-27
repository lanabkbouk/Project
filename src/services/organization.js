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

const MOCK_MODE = (import.meta.env.VITE_USE_MOCK_ORGANIZATION_PROFILE || 'true') === 'true'

function wait(duration = 300) {
  return new Promise((resolve) => setTimeout(resolve, duration))
}

const MOCK_ORGANIZATION = {
  name: '',
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
    return { success: true, data: MOCK_ORGANIZATION }
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