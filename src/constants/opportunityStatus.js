// حالة الفرصة أصبحت 4 مراحل بدل مرحلتين (open/closed) — حسب متطلبات الباك اند:
// registration_open  : لسا التسجيل مفتوح لاستقبال متطوعين جدد
// registration_closed: التسجيل توقف (يدويًا من المنظمة، أو تلقائيًا لما
//                       current_volu يوصل max_volu، أو ينتهي register_end_at)
//                       لكن الفرصة نفسها لسا ما بدأت (قبل start_date)
// in_progress        : وصلنا start_date والفرصة عم تشتغل فعليًا
// completed          : تجاوزنا end_date — انتهت الفرصة بالكامل
//
// ملاحظة مهمة: هاي الحالة تُحسب تلقائيًا حسب التاريخ الحالي عبر
// getEffectiveOpportunityStatus() في utils/opportunityStatus.js، وما
// بتُخزَّن يدويًا إلا لجزء "إغلاق التسجيل المبكر" (راجع الملف المذكور).
export const OPPORTUNITY_STATUS = {
  REGISTRATION_OPEN: "registration_open",
  REGISTRATION_CLOSED: "registration_closed",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
};

export const OPPORTUNITY_STATUS_META = {
  [OPPORTUNITY_STATUS.REGISTRATION_OPEN]: { label: "Open", color: "green" },
  [OPPORTUNITY_STATUS.REGISTRATION_CLOSED]: { label: "Closed", color: "gold" },
  [OPPORTUNITY_STATUS.IN_PROGRESS]: { label: "In Progress", color: "blue" },
  [OPPORTUNITY_STATUS.COMPLETED]: { label: "Completed", color: "gray" },
};