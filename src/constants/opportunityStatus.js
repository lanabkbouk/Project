import { Unlock, Lock, PlayCircle, CheckCircle2 } from "lucide-react";

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

// icon: مصدر التمييز البصري الأساسي بين الحالات يلي بتشارك نفس اللون
// (مثلًا Completed هون رمادي، ونفس الرمادي مستخدم لـ Withdrawn/Expired
// بـ PARTICIPATION_STATUS_META — الأيقونة المختلفة هي يلي بتفرّق بينهم
// بصريًا لما يظهروا سوا، مش اللون). كل Badge/Chip بيعرض الحالة لازم
// يعرض هالأيقونة مع النص واللون سوا، مش اللون لحاله أبدًا.
export const OPPORTUNITY_STATUS_META = {
  [OPPORTUNITY_STATUS.REGISTRATION_OPEN]: {
    label: "Open",
    color: "green",
    icon: Unlock,
    // وصف مبسّط غير تقني — يُستخدم بـ StatusLegendPopover، مش أي مكان
    // تقني. صياغة "شو هالمعنى للمستخدم" مش "شو الشرط البرمجي"
    description: "There's still room to join.",
  },
  [OPPORTUNITY_STATUS.REGISTRATION_CLOSED]: {
    label: "Closed",
    color: "gold",
    icon: Lock,
    description: "Registration has ended, but the opportunity hasn't started yet.",
  },
  [OPPORTUNITY_STATUS.IN_PROGRESS]: {
    label: "In Progress",
    color: "blue",
    icon: PlayCircle,
    description: "It's happening right now.",
  },
  [OPPORTUNITY_STATUS.COMPLETED]: {
    label: "Completed",
    color: "gray",
    icon: CheckCircle2,
    description: "It has finished.",
  },
};