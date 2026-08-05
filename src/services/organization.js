// جلب وتحديث بروفايل المنظمة الحالية.
//
// ⚠️ تصحيح مهم (بعد فحص الباك اند الفعلي على GitHub):
// لا يوجد أي مسار "/organizations/me" في الباك اند. الراوت الحقيقي هو
// GET/PUT /organizations/{organization} مع Route Model Binding حقيقي —
// يعني الـ id في الـ URL يحدد فعليًا أي منظمة سيتم جلبها/تعديلها.
// لذلك أي استدعاء هون لازم يستقبل organizationId معرّف (قادم من
// AuthContext → user.organization.id الذي يصل ضمن استجابة login/register).
//
// GET /api/organizations/{id}   → بروفايل منظمة واحدة (فيها status)
// PUT /api/organizations/{id}   → تحديث بيانات نصية فقط (JSON عادي)
//
// ⚠️ ملاحظتان مهمتان مؤكّدتان من كود الباك اند (OrganizationController):
// 1) حقل "verification_document" (وثيقة توثيق أنها منظمة حقيقية) يُرفع
//    مرة وحدة بس عند إنشاء الحساب من صفحة Register — وهو غير مرتبط
//    إطلاقًا بصورة/شعار البروفايل. بعد الإنشاء يبقى read-only هون.
// 2) الباك اند حاليًا (OrganizationController::update) لا يعالج رفع أي
//    صورة/شعار جديد عند التحديث (الكود الفعلي فيه فقط $organization
//    ->update($request->validated()) بدون أي addMediaFromRequest).
//    لذلك ما منرسل logo ضمن هذا التحديث حاليًا، ومنعرض هذا الحقل
//    كـ "قريبًا" بالواجهة لحد ما يضيفه فريق الباك اند.
//
// TODO: لما يجهز الباك اند رفع الشعار بالتحديث، رجّعي منطق FormData
// + verification_document handling كان موجود سابقًا بهالملف.

import { apiClient, getApiErrorMessage } from './api/client'
import { isMockMode } from './api/mockMode'
import { wait } from './api/delay'
import { ORGANIZATION_STATUS } from '../constants/organizationStatus'
import { AUTH_STORAGE_KEY } from '../constants/auth/storage'
import { loadMockUsers, updateMockUser } from './mock/mockUserStore'
import { validateOrganizationProfileResponse } from '../utils/api/apiResponseSchemas'

const MOCK_MODE = isMockMode()

// إيميل المستخدم المسجّل دخوله حاليًا (من نفس الجلسة يلي AuthContext خزّنها)
// نستخدمه فقط بوضع الـ Mock للبحث داخل mockUsers
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
  id: null,
  name: '',
  email: '',
  contactPerson: '',
  description: '',
  city: '',
  website: '',
  // ⚠️ imageUrl (مو profileImageUrl): كان فيه عدم تطابق بين الاسم هون
  // واسم الحقل يلي orgProfile.jsx فعليًا بيقرأه (organization.imageUrl) —
  // نفس الاسم بالضبط يلي صار تصحيحه بـ organizationProfileResponseSchema
  // (apiResponseSchemas.js) لوضع real، حتى الوضعين يطابقوا نفس الـ Component
  imageUrl: null,
  verificationDocumentUrl: null,
  status: ORGANIZATION_STATUS.PENDING,
  owner: null,
}

/**
 * @param {number|string} organizationId - يجب أن يصل من AuthContext (user.organization.id)
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export async function fetchOrganizationProfile(organizationId) {
  if (MOCK_MODE) {
    await wait()

    const email = getCurrentSessionEmail()
    const mockUser = email ? loadMockUsers().find((u) => u.email === email) : null

    if (!mockUser) return { success: true, data: EMPTY_ORGANIZATION }

    return {
      success: true,
      data: {
        id: mockUser.organizationId || null,
        name: mockUser.orgName || '',
        // ⚠️ كان ناقص هون قبل — الإيميل كان موجود بس جوا owner.email،
        // بينما orgProfile.jsx وOrgProfilePreview بيقرأوا organization.email
        // مباشرة (نفس الشكل يلي organizationProfileResponseSchema بيرجعه
        // بوضع real)، فكان يظهر فاضي دايمًا بوضع mock رغم إنه محفوظ فعليًا
        email: mockUser.email || '',
        contactPerson: mockUser.contactPerson || '',
        description: mockUser.description || '',
        city: mockUser.city || '',
        website: mockUser.website || '',
        imageUrl: mockUser.imageUrl || null,
        verificationDocumentUrl: mockUser.verificationDocumentUrl || null,
        status: mockUser.status || ORGANIZATION_STATUS.PENDING,
        owner: { id: mockUser.id, name: mockUser.name, email: mockUser.email },
      },
    }
  }

  if (!organizationId) {
    return { success: false, error: 'Organization id is required to load the profile' }
  }

  try {
    const response = await apiClient.get(`/organizations/${organizationId}`)

    // نتحقق من شكل الاستجابة (OrganizationResource الحقيقي) قبل ما توصل
    // لأي Component — لو حقل ناقص أو النوع غلط، هون التحقق بيرجّع خطأ واضح
    const validation = validateOrganizationProfileResponse(response.data)
    if (!validation.success) return validation

    return { success: true, data: validation.data }
  } catch (error) {
    return { success: false, error: getApiErrorMessage(error, 'Failed to load organization profile') }
  }
}

/**
 * تحديث البيانات النصية للمنظمة فقط (بدون صور — راجع الملاحظة (2) بالأعلى).
 * الحقول تطابق OrganizationRequest بالضبط: name, description, city,
 * website, contact_person. لا يوجد "email" ضمن جدول organizations.
 *
 * @param {number|string} organizationId
 * @param {{ name: string, description: string, city: string, website?: string, contactPerson: string }} profileData
 */
export async function updateOrganizationProfile(organizationId, profileData) {
  if (MOCK_MODE) {
    await wait()

    const email = getCurrentSessionEmail()
    if (email) {
      updateMockUser(email, {
        orgName: profileData.name || '',
        description: profileData.description || '',
        city: profileData.city || '',
        website: profileData.website || '',
        contactPerson: profileData.contactPerson || '',
      })
    }

    return { success: true, data: {} }
  }

  if (!organizationId) {
    return { success: false, error: 'Organization id is required to update the profile' }
  }

  try {
    // لا حاجة لـ FormData/multipart هون: التحديث الحالي بالباك اند لا يقبل
    // أي ملف، فقط حقول نصية عادية → نرسل JSON بسيط.
    const response = await apiClient.put(`/organizations/${organizationId}`, {
      name: profileData.name,
      description: profileData.description,
      city: profileData.city,
      website: profileData.website || '',
      contact_person: profileData.contactPerson,
    })
    return { success: true, data: response.data }
  } catch (error) {
    return { success: false, error: getApiErrorMessage(error, 'Failed to save organization profile') }
  }
}

// ————————————————————————————————————————————————————————————
// إعادة رفع وثيقة التوثيق بعد الرفض (Resubmit Verification Document)
//
// ⚠️ عكس الوثيقة الأصلية (read-only بعد إنشاء الحساب — راجع الملاحظة
// بأعلى الملف)، هاي الدالة **بترسل ملف جديد فعليًا** ليحل محل الوثيقة
// المرفوضة، وبترجّع الحالة لـ pending تلقائيًا حتى يراجعها الأدمن من
// جديد. هاي نقطة الحل الوحيدة المتاحة للمنظمة لما يكون سبب الرفض
// متعلق بالوثيقة نفسها (كانت request-review القديمة بترجّع pending
// بنفس الوثيقة المرفوضة، بدون أي فرصة تصليح فعلي).
//
// الباك اند الحقيقي ما عنده هالـ endpoint لسا — مطلوب جديد:
//   POST /organizations/{id}/verification-document  (multipart/form-data)
// (حقل واحد: verification_document، يرجّع status=pending ويصفّر rejection_reason)
// ————————————————————————————————————————————————————————————

/**
 * @param {number|string} organizationId
 * @param {{file: File, previewUrl: string}} document - previewUrl هي معاينة
 *   base64 محلية جاهزة أصلًا من useImageUpload، نستخدمها بوضع mock فقط
 *   كبديل لرابط تخزين حقيقي (ما في سيرفر فعلي يرفع له الملف بهالوضع)
 * @returns {Promise<{success: boolean, error?: string, data?: object}>}
 */
export async function resubmitVerificationDocument(organizationId, { file, previewUrl }) {
  if (!file) return { success: false, error: 'Please select a document to upload' }

  if (MOCK_MODE) {
    await wait()

    const email = getCurrentSessionEmail()
    if (!email) return { success: false, error: 'Could not identify the current organization' }

    const updated = updateMockUser(email, {
      verificationDocumentUrl: previewUrl,
      status: ORGANIZATION_STATUS.PENDING,
      rejectionReason: '',
    })

    return { success: true, data: { verificationDocumentUrl: updated?.verificationDocumentUrl } }
  }

  if (!organizationId) {
    return { success: false, error: 'Organization id is required to resubmit the document' }
  }

  try {
    const formData = new FormData()
    formData.append('verification_document', file)

    const response = await apiClient.post(`/organizations/${organizationId}/verification-document`, formData)
    return { success: true, data: response.data }
  } catch (error) {
    return { success: false, error: getApiErrorMessage(error, 'Failed to upload the new document') }
  }
}