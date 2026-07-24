// نقطة واحدة لتحديد ما إذا كانت الخدمات تعمل بوضع المحاكاة أو مع API حقيقي
// استُخدمت من قبل عدة ملفات (auth.js, organizations.js...) لتفادي التكرار
export function isMockMode() {
  return (import.meta.env.VITE_USE_MOCK_AUTH || 'true') === 'true'
}