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

// كل حقل معه .default() عمدًا: لو الباك اند ما رجّع حقل معيّن (مثلًا
// website فاضي)، منستخدم قيمة افتراضية آمنة بدل undefined ينتشر بالواجهة
const organizationProfileResponseSchema = z
  .object({
    name: z.string().default(''),
    email: z.string().default(''),
    description: z.string().default(''),
    city: z.string().default(''),
    website: z.string().nullable().default(''),
    imageUrl: z.string().nullable().default(null),
    status: z.string().default('pending'),
    rejectionReason: z.string().nullable().default(null),
  })
  .passthrough()

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