// حالات طلب المشاركة (Participation) الممكنة بين المتطوع والفرصة —
// مؤكدة حاليًا 3 بس: pending/accepted/rejected (تحدّدها المنظمة).
//
// ongoing/completed/withdrawn انشالت مؤقتًا: وجودها معلّق على تأكيد
// الباك (متل موضوع العمر بالفرصة تمامًا) — لو تأكد لاحقًا إنها موجودة
// فعليًا بالـ API، منرجع نضيفها هون وبمكان واحد بس.
export const PARTICIPATION_STATUS = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
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
};