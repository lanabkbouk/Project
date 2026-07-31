
// نقطة واحدة لكل أنماط "الأسطح" المشتركة بالمشروع — بطاقات مرتفعة
// وقابلة للتفاعل (Cards) ولوحات غائرة ثابتة (Panels) — بدل ما كل واحدة
// تتكرر بملف منفصل صغير. نفس مبدأ fieldStyles.js الموجود مسبقًا، بس
// مجمّع هون تحت سقف واحد بما إن المفهومين قريبين من بعض (شكل سطح +
// خلفية + حدود).
//
// أي تغيير مستقبلي بشكل البطاقات أو اللوحات بيصير هون بس، وينعكس
// تلقائيًا على كل مكان بالمشروع يستخدمها.

// ————————————————————————————————
// Cards: بطاقات مرتفعة وقابلة للتفاعل (Stat, Participation, Applicant,
// Achievement, Opportunity...) — عندها Hover Elevation لأنها فعليًا
// عناصر قابلة للنقر أو الاهتمام بيها.
// ————————————————————————————————

// الشكل الأساسي المشترك: الحواف + الخلفية + الحدود
export const CARD_SURFACE = "rounded-2xl bg-field border border-heading/10";

// حالة الارتفاع الموحّدة عند المرور بالماوس (Hover Elevation)
export const CARD_ELEVATION =
  "shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1";

// Padding مريح موحّد لمحتوى البطاقة (يمكن تجاوزه لبطاقات ذات حجم مختلف)
export const CARD_PADDING = "p-5";

// تركيبة جاهزة لأكثر حالة استخدام شيوعًا: بطاقة تفاعلية عادية
export const CARD_BASE = `${CARD_SURFACE} ${CARD_ELEVATION} ${CARD_PADDING}`;

// ————————————————————————————————
// Panels: لوحات غائرة ثابتة (رأس بروفايل، لوحة معاينة، لوحة نموذج...)
// بدون Hover Elevation لأنها مو تفاعلية — خلفية تظليل خفيفة بدل خلفية
// بيضاء مرتفعة، عكس الكارد تمامًا بالمعنى البصري.
// ————————————————————————————————

export const PANEL_SURFACE = "rounded-3xl bg-heading/5 border border-heading/10";