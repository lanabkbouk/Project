// حالات طلب المشاركة (Participation) الممكنة بين المتطوع والفرصة —
// مؤكدة حاليًا 4 مخزّنة: pending/accepted/rejected (تحدّدها المنظمة)،
// وwithdrawn (يحدّدها المتطوع نفسه بانسحابه).
//
// EXPIRED حالة خامسة **محسوبة فقط، مش مخزّنة** — قرار مع فريق سنا: لو
// status لسا pending وتاريخ بداية الفرصة المرتبطة فات، تُعتبر منتهية
// الوقت تلقائيًا بالعرض بس (راجع getEffectiveParticipationStatus
// أسفل الملف)، بدون أي عمود إضافي بقاعدة البيانات.
//
// ⚠️ الانسحاب (Withdraw) — قرار مُحدَّث: كان سابقًا حذف كامل للسطر من
// opportunity_volunteer (بدون أي أثر)، لكن هذا كان يعني اختفاء
// المتطوع من قائمة المتقدمين عند المنظمة بصمت تام، بدون أي تفسير
// (هل انسحب؟ خطأ تقني؟ ما في طريقة تعرف). الآن: المشاركة تبقى بالسجل
// بحالة WITHDRAWN صريحة — مختلفة تمامًا عن REJECTED (رفض = قرار
// المنظمة، انسحاب = قرار المتطوع)، فالتاريخ الكامل يبقى شفافًا لكلا
// الطرفين. راجع services/participations.js → withdrawParticipation
export const PARTICIPATION_STATUS = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
  WITHDRAWN: "withdrawn",
  EXPIRED: "expired",
};

/**
 * بيانات وصفية (Meta) موحّدة لكل حالة، تُستخدم بكل مكان تُعرض فيه حالة
 * المشاركة (بطاقة "مشاركاتي" عند المتطوع، وقائمة المتقدمين عند المنظمة)
 * بدون تكرار النصوص أو الألوان في أكثر من مكان.
 */
export const PARTICIPATION_STATUS_META = {
  [PARTICIPATION_STATUS.PENDING]: { label: "Pending Review", color: "gold" },
  [PARTICIPATION_STATUS.ACCEPTED]: { label: "Accepted", color: "green" },
  [PARTICIPATION_STATUS.REJECTED]: { label: "Rejected", color: "red" },
  [PARTICIPATION_STATUS.WITHDRAWN]: { label: "Withdrew", color: "gray" },
  [PARTICIPATION_STATUS.EXPIRED]: { label: "Expired", color: "gray" },
};

/**
 * يحسب الحالة "الفعلية" للمشاركة — لو لسا pending وفات تاريخ بداية
 * الفرصة، تصير expired بالعرض. غير هيك، بترجع status المخزّنة زي ما هي.
 * بوضع الـ API الحقيقي، الباك اند نفسه المفروض يرجّع نفس هالمنطق جاهز
 * (computed_status)، وهاي الدالة بتصير غير مستخدمة إلا بوضع الـ Mock.
 * @param {{status: string}} participation
 * @param {{startDate?: string}} opportunity
 * @param {Date} [now]
 */
export function getEffectiveParticipationStatus(participation, opportunity, now = new Date()) {
  if (participation.status !== PARTICIPATION_STATUS.PENDING) return participation.status;

  const startDate = opportunity?.startDate ? new Date(opportunity.startDate) : null;
  if (startDate && now >= startDate) return PARTICIPATION_STATUS.EXPIRED;

  return PARTICIPATION_STATUS.PENDING;
}