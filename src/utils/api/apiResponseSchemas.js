// utils/api/apiResponseSchemas.js
//
// تحقق (validation) من شكل استجابات الـ API الحقيقي فقط (وضع
// VITE_API_MODE=real)، عند "حدود" التطبيق — أول لحظة توصل فيها بيانات
// من الباك اند. الهدف: لو Laravel رجّع شكل مختلف شوي عما نتوقعه (حقل
// ناقص، اسم حقل تغيّر، نوع بيانات غلط)، نفشل بوضوح ورسالة مفهومة، بدل
// ما نكمل بصمت وتصير حقول "undefined" منتشرة بالواجهة وحدا ما بيلاحظ
// السبب الحقيقي إلا بعد وقت طويل من التنقيب.
//
// ما منستخدمها بوضع mock: بيانات الـ Mock تحت سيطرتنا الكاملة أصلًا،
// فالتحقق منها ما بيضيف أي قيمة، بس بيبطّئ التطوير بدون داعي.

import { z } from 'zod'

// ---------------------------------------------------------------------------
// حدود تسجيل الدخول / التسجيل (services/auth.js)
// ---------------------------------------------------------------------------

// .passthrough() تسمح بحقول إضافية غير متوقعة (مثلًا لو الباك اند ضاف
// حقل جديد لاحقًا) بدون ما نرفض الاستجابة كلها — بس الحقول الأساسية
// هون إجبارية ولازم يكون نوعها صحيح، لأن باقي الكود (normalizeUser،
// AuthContext...) بيعتمد عليها مباشرة
const authUserSchema = z
  .object({
    id: z.union([z.string(), z.number()]),
    email: z.string().email(),
  })
  .passthrough()

export const authResponseSchema = z
  .object({
    user: authUserSchema,
    token: z.string().min(1, 'Token missing from server response'),
  })
  .passthrough()

/**
 * تتحقق من شكل استجابة تسجيل الدخول/التسجيل الحقيقية قبل ما نبني منها
 * بيانات الجلسة (buildAuthPayload).
 * @returns {{success: true, data: object} | {success: false, error: string}}
 */
export function validateAuthResponse(responseData) {
  const result = authResponseSchema.safeParse(responseData)

  if (!result.success) {
    // console.error هون مقصود: هاد خطأ برمجي (عدم تطابق العقد بين
    // الفرونت والباك اند) لازم يبان بوضوح أثناء التطوير، مو مجرد
    // حالة مستخدم عادية
    console.error('Unexpected auth API response shape:', result.error.flatten())
    return {
      success: false,
      error: 'Unexpected response from server. Please try again or contact support.',
    }
  }

  return { success: true, data: result.data }
}

// ---------------------------------------------------------------------------
// حدود بروفايل المنظمة (services/organization.js)
// ---------------------------------------------------------------------------

// ✅ مصحّح بعد فحص فعلي لـ OrganizationController + OrganizationResource
// بالباك اند: الحقول الحقيقية بالاستجابة snake_case (contact_person،
// profile_image)، والبريد مش موجود بمستوى أول — جوا owner.email بس.
// نستخدم .transform() هون عشان نحوّل الشكل الخام لنفس الشكل يلي orgProfile.jsx
// و OrganizationDetailsPage.jsx بيتوقعوه، بمكان واحد بس، بدل ما كل صفحة
// تتعامل مع snake_case يدويًا.
//
// 🔴 status دايمًا null من الباك حاليًا (عمود status مش موجود إطلاقًا
// بجدول organizations) — الـ fallback لـ 'pending' هون قرار متعمّد لحد
// ما الباك يضيف العمود، مش قيمة حقيقية.
const organizationProfileResponseSchema = z
  .object({
    id: z.union([z.string(), z.number()]).optional(),
    name: z.string().default(''),
    description: z.string().nullable().default(''),
    city: z.string().nullable().default(''),
    website: z.string().nullable().default(''),
    contact_person: z.string().default(''),
    profile_image: z.string().nullable().default(null),
    verification_document: z.string().nullable().default(null),
    status: z.string().nullable().default(null),
    owner: z
      .object({
        id: z.union([z.string(), z.number()]).optional(),
        name: z.string().nullable().optional(),
        email: z.string().nullable().optional(),
      })
      .nullable()
      .optional(),
  })
  .passthrough()
  .transform((data) => ({
    id: data.id ?? null,
    name: data.name,
    email: data.owner?.email || '',
    // ⚠️ .nullable().default('') بـ Zod ما بيحوّل null لـ '' تلقائيًا —
    // الـ default بتشتغل بس لما القيمة undefined (حقل غير موجود)، مش
    // لما تكون null صراحة (حقل موجود وقيمته فاضية). لازم نستكمل التحويل
    // هون يدويًا وإلا null بتنسرّب للـ Component وتكسر .toLowerCase()
    // أو أي عملية نص تانية بتفترض string دايمًا
    description: data.description || '',
    city: data.city || '',
    website: data.website || '',
    contactPerson: data.contact_person,
    imageUrl: data.profile_image,
    verificationDocumentUrl: data.verification_document,
    status: data.status || 'pending',
    // 🔴 مفهوم "سبب الرفض" غير موجود إطلاقًا بالباك اند حاليًا (زي status
    // تمامًا) — null صراحة هون بدل ما تختفي بصمت، وVerificationStatusBanner
    // أصلاً بيتعامل معها كـ optional
    rejectionReason: null,
    owner: data.owner || null,
  }))

/**
 * تتحقق من شكل استجابة بروفايل المنظمة الحقيقية عند الجلب.
 * @returns {{success: true, data: object} | {success: false, error: string}}
 */
export function validateOrganizationProfileResponse(responseData) {
  const result = organizationProfileResponseSchema.safeParse(responseData)

  if (!result.success) {
    console.error('Unexpected organization profile API response shape:', result.error.flatten())
    return {
      success: false,
      error: 'Unexpected response from server while loading organization profile.',
    }
  }

  return { success: true, data: result.data }
}