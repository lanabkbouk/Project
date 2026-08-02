import { getUserDisplayName } from './displayName'

/**
 * نقطة التطبيع الوحيدة لبيانات المستخدم في كامل التطبيق.
 * تُستدعى مرة واحدة فقط، مباشرة بعد استقبال استجابة تسجيل الدخول/التسجيل
 * (داخل services/auth.js)، وتُنتج شكلًا ثابتًا يعتمد عليه AuthContext وكل الـ Components.
 *
 */
export function normalizeUser(rawUser) {
  if (!rawUser || typeof rawUser !== 'object') return null

  return {
    ...rawUser,
    // اسم جاهز للعرض دائمًا، بنفس منطق getUserDisplayName لكن محسوب مرة واحدة فقط
    displayName: getUserDisplayName(rawUser),
    // صورة جاهزة للعرض مع قيمة افتراضية فارغة بدل تكرار هذا الشرط في كل مكوّن
    avatarUrl: rawUser.imageUrl || rawUser.avatarUrl || '',
    // توحيد اسم حقل الهاتف: الـ API الحقيقي بيرجّعه phone_number (Laravel
    // snake_case)، بينما وضع الـ Mock بيخزّنه أصلًا كـ phone (camelCase،
    // جاي مباشرة من حقل فورم التسجيل) — كل الواجهة بعد هالنقطة بتستخدم
    // user.phone بس، بغض النظر عن الوضع
    phone: rawUser.phone_number || rawUser.phone || '',
  }
}