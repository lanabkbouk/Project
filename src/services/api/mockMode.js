// نقطة واحدة لتحديد وضع تشغيل كل خدمات المشروع: محاكاة (mock) أو ربط
// حقيقي بالباك اند (real). كل ملفات services/*.js تستورد isMockMode()
// من هنا فقط — بدل ما كان عندنا 8 متغيرات بيئة منفصلة
// (VITE_USE_MOCK_AUTH, VITE_USE_MOCK_CATALOG, VITE_USE_MOCK_OPPORTUNITIES...)
// كل وحدة فيها احتمال تنسى تبدّليها لما يجهز endpoint معيّن بالباك اند.
//
// وضع الانتقال التدريجي: لو احتجتي مستقبلًا تفعّلي endpoint واحد بس
// وتخلّي الباقي Mock (لحالات اختبار جزئي)، أضيفي استثناء صريح هون بدل
// الرجوع لمتغيرات بيئة متفرقة — مثال:
//   const MOCK_OVERRIDES = { auth: false }
//   export function isMockMode(domain) { return MOCK_OVERRIDES[domain] ?? (import.meta.env.VITE_API_MODE || 'mock') !== 'real' }
export function isMockMode() {
  return (import.meta.env.VITE_API_MODE || 'mock') !== 'real'
}