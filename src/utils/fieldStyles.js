// utils/fieldStyles.js
//
// نقطة واحدة لأنماط الحقول المشتركة بين Input و Dropdown و Textarea
// (لون الخلفية، شكل الـ label، شكل رسالة الخطأ) — بدل ما تتكرر
// نفس الـ Tailwind classes بثلاث ملفات مختلفة وتنلخبط ببعضها.
//
// أي تغيير مستقبلي بشكل الحقول (لون، حجم خط، مسافات) بيصير هون بس،
// وبينعكس تلقائيًا على كل حقل بالمشروع.

// شكل الـ label الموحّد فوق أي حقل
export const FIELD_LABEL = "mb-1 text-sm font-medium text-heading";

// شكل رسالة الخطأ الموحّدة تحت أي حقل
export const FIELD_ERROR = "mt-1 text-xs text-danger";

// لون الخلفية والحدود الموحّد لأي حقل (يُستخدم مع bg-field المعرّف بـ index.css)
export const FIELD_SURFACE = "bg-field border border-heading/10";

// لون الـ placeholder والأيقونات غير المفعّلة، موحّد بكل الحقول
export const FIELD_PLACEHOLDER = "placeholder-body/60";