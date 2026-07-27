// services/api/mediaUpload.js
//
// طبقة موحّدة لكل عمليات رفع الصور بالموقع (صورة بروفايل متطوع، صورة/مستندات
// منظمة، وصورة فرصة لاحقًا). الهدف إنه أي صفحة تحتاج ترفع صورة تستخدم نفس
// الدوال بدل ما تكرر منطق التحقق وبناء FormData بكل مكان لحاله.

import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE_MB } from '../../constants/media'

/**
 * يتحقق من ملف الصورة قبل إرساله (النوع والحجم).
 * @param {File} file
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateImageFile(file) {
  if (!file) return { valid: false, error: 'لم يتم اختيار أي صورة' }

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { valid: false, error: 'صيغة الصورة غير مدعومة (JPG, PNG, WEBP فقط)' }
  }

  const maxSizeBytes = MAX_IMAGE_SIZE_MB * 1024 * 1024
  if (file.size > maxSizeBytes) {
    return { valid: false, error: `حجم الصورة يجب ألا يتجاوز ${MAX_IMAGE_SIZE_MB}MB` }
  }

  return { valid: true }
}

/**
 * يبني FormData جاهز للإرسال، ويضيف حقل "_method" تلقائيًا عند التحديث.
 *
 * السبب: PHP لا يقرأ الملفات المرفوعة ($_FILES) من طلبات PUT مع
 * multipart/form-data — هذي قيود PHP نفسه. فالحل المتعارف عليه هو إرسال
 * الطلب كـ POST مع حقل "_method: PUT" ليقوم Laravel بمعاملته كـ PUT فعليًا
 * (method spoofing) مع قراءة الملف بشكل صحيح.
 *
 * @param {Object} fields - باقي حقول الفورم (نص/أرقام)
 * @param {{ file?: File, fieldName?: string }} imageInput - الصورة الفعلية
 * @param {'POST'|'PUT'} httpMethod - نوع الطلب الحقيقي المطلوب بالباك اند
 * @returns {FormData}
 */
export function buildMultipartFormData(fields = {}, imageInput = {}, httpMethod = 'POST') {
  const formData = new FormData()

  Object.entries(fields).forEach(([key, value]) => {
    if (value === undefined || value === null) return
    formData.append(key, value)
  })

  const { file, fieldName = 'photo' } = imageInput
  if (file) formData.append(fieldName, file)

  
  if (httpMethod === 'PUT') formData.append('_method', 'PUT')

  return formData
}