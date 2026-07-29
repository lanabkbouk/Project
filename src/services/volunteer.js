// services/volunteer.js
//
// Handles saving the currently logged-in volunteer's own profile
// (personal info, skills, photo). Keeps the API call out of the page
// component, consistent with every other service in this project.
//
// POST /api/volunteers/me  (multipart/form-data, because of the photo)
// Laravel requires POST + _method: PUT for file uploads in updates.

import { apiClient, getApiErrorMessage } from './api/client'

const MOCK_MODE = (import.meta.env.VITE_USE_MOCK_VOLUNTEER_PROFILE || 'true') === 'true'

function wait(duration = 300) {
  return new Promise((resolve) => setTimeout(resolve, duration))
}

// يبني FormData بأسماء وقيَم حقول Laravel الصحيحة انطلاقًا من بيانات الفورم الخام (camelCase)
// هذا هو المكان الوحيد الذي يعرف شكل الباك اند، بدل تكرار هذا التحويل داخل صفحة الـ Profile
function buildVolunteerFormData({ values, photoFile }) {
  const formData = new FormData()

  formData.append('education_level', values.educationLevel || '')
  formData.append('birth_date', values.dateOfBirth || '')
  // الباك اند يتحقق من هذا الحقل بحروف صغيرة فقط: in:male,female
  formData.append('gendre', (values.gender || '').toLowerCase())
  formData.append('city', values.city || '')
  formData.append('about', values.about || '')

  if (photoFile) formData.append('photo', photoFile)

  return formData
}

/**
 * يحفظ بروفايل المتطوع.
 * @param {{ values: object, photoFile?: File }} payload - بيانات الفورم الخام + الصورة (اختياري)
 * @returns {Promise<{success: boolean, data?: {imageUrl?: string}, error?: string}>}
 */
export async function updateVolunteerProfile({ values, photoFile } = {}) {
  if (MOCK_MODE) {
    await wait()
    return { success: true, data: { imageUrl: null } }
  }

  try {
    const formData = buildVolunteerFormData({ values, photoFile })

    // IMPORTANT:
    // PHP does NOT read files in PUT multipart/form-data.
    // So we send POST + _method: PUT to allow Laravel to process the file.
    formData.append('_method', 'PUT')

    const response = await apiClient.post('/volunteers/me', formData, {
      headers: { 'Content-Type': undefined }, // allow browser to set boundary
    })

    return { success: true, data: response.data }
  } catch (error) {
    return { success: false, error: getApiErrorMessage(error, 'Failed to save profile') }
  }
}