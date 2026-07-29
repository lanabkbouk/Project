// حالات طلب المشاركة (Participation) الممكنة بين المتطوع والفرصة
// pending/accepted/rejected: يدوية (تحدّدها المنظمة)
// withdrawn: يدوية (يحدّدها المتطوع بنفسه)
// ongoing/completed: تلقائية (يحدّدها النظام حسب تاريخ الفرصة)
export const PARTICIPATION_STATUS = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  ONGOING: "ongoing",
  COMPLETED: "completed",
  REJECTED: "rejected",
  WITHDRAWN: "withdrawn",
};

/**
 * بيانات وصفية (Meta) موحّدة لكل حالة، تُستخدم بكل مكان تُعرض فيه حالة
 * المشاركة (بطاقة "مشاركاتي" عند المتطوع، وقائمة المتقدمين عند المنظمة لاحقًا)
 * بدون تكرار النصوص أو الألوان في أكثر من مكان.
 */
export const PARTICIPATION_STATUS_META = {
  [PARTICIPATION_STATUS.PENDING]: { label: "Pending Review", color: "gold" },
  [PARTICIPATION_STATUS.ACCEPTED]: { label: "Accepted", color: "green" },
  // [PARTICIPATION_STATUS.ONGOING]: { label: "Ongoing", color: "blue" },
  [PARTICIPATION_STATUS.COMPLETED]: { label: "Completed", color: "silver" },
  [PARTICIPATION_STATUS.REJECTED]: { label: "Rejected", color: "red" },
  [PARTICIPATION_STATUS.WITHDRAWN]: { label: "Withdrawn", color: "gray" },
};