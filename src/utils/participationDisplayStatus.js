// نشتق هون "حالة عرض" واحدة لكل مشاركة — تُستخدم لتبويبات/عدادات "My
// Volunteering" (فلترة)، وكمان لشارة الحالة نفسها (ParticipationStatusBadge)
// عبر getParticipationStatusMeta تحت. PARTICIPATION_STATUS المخزّنة فعليًا
// ما فيها active/completed إطلاقًا — الاثنتان بيطلعوا فقط من تقاطع
// status === accepted مع opportunity.status المحسوبة (راجع
// utils/opportunityStatus.js)، فمن دون هالملف كل مكان بده يعرض هالحالة
// كان رح يعيد نفس الحساب لحاله.

import { PARTICIPATION_STATUS, PARTICIPATION_STATUS_META } from "../constants/participationStatus";
import { OPPORTUNITY_STATUS, OPPORTUNITY_STATUS_META } from "../constants/opportunityStatus";

export const PARTICIPATION_DISPLAY_STATUS = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  ACTIVE: "active",
  COMPLETED: "completed",
  REJECTED: "rejected",
  WITHDRAWN: "withdrawn",
  EXPIRED: "expired",
};

/**
 * @param {{status:string, opportunity:{status?:string}|null}} participation
 *   يتوقّع الشكل اللي بترجّعه fetchMyParticipations — status محسوبة فعليًا
 *   (ممكن تكون expired)، وopportunity.status محسوبة فعليًا هي كمان.
 * @returns {string} إحدى قيم PARTICIPATION_DISPLAY_STATUS
 */
export function getParticipationDisplayStatus(participation) {
  const { status, opportunity } = participation;

  if (status !== PARTICIPATION_STATUS.ACCEPTED) return status;

  if (opportunity?.status === OPPORTUNITY_STATUS.IN_PROGRESS) return PARTICIPATION_DISPLAY_STATUS.ACTIVE;
  if (opportunity?.status === OPPORTUNITY_STATUS.COMPLETED) return PARTICIPATION_DISPLAY_STATUS.COMPLETED;

  return PARTICIPATION_DISPLAY_STATUS.ACCEPTED;
}

/**
 * هل هاي المشاركة تنتمي لتبويب معيّن؟ نقطة واحدة تحدّد هالقرار حتى
 * الفلترة والعدادات (useParticipationCounts) يستخدموا نفس القاعدة
 * بالضبط. تبويب "Pending" بيضم Expired كمان — قائمة التبويبات المطلوبة
 * ما فيها تبويب مستقل لـ"منتهية"، وExpired أصلًا تعريفها مشاركة pending
 * فات وقتها، فمنطقيًا مكانها تحت نفس التبويب (شارة الحالة على البطاقة
 * نفسها بتظل توضّح Expired بشكل منفصل ومميّز).
 * @param {object} participation
 * @param {string} tabId - 'all' أو إحدى قيم PARTICIPATION_DISPLAY_STATUS
 */
export function matchesParticipationStatusTab(participation, tabId) {
  if (tabId === "all") return true;

  const displayStatus = getParticipationDisplayStatus(participation);

  if (tabId === PARTICIPATION_DISPLAY_STATUS.PENDING) {
    return displayStatus === PARTICIPATION_DISPLAY_STATUS.PENDING || displayStatus === PARTICIPATION_DISPLAY_STATUS.EXPIRED;
  }

  return displayStatus === tabId;
}

// تسمية الحالتين المُشتقّتين بس — نعرض "Active"/"Completed" (مو "In
// Progress" رغم إنه هيك تسمية OPPORTUNITY_STATUS_META.IN_PROGRESS)
// لأنه المنظور هون منظور المتطوع لمشاركته هو، مش منظور الفرصة نفسها
const DERIVED_STATUS_LABELS = {
  [PARTICIPATION_DISPLAY_STATUS.ACTIVE]: "Active",
  [PARTICIPATION_DISPLAY_STATUS.COMPLETED]: "Completed",
};

/**
 * نقطة واحدة مركزية تحوّل "حالة عرض" (PARTICIPATION_DISPLAY_STATUS) —
 * جاهزة مسبقًا أو معروفة سلفًا (متل WITHDRAWAL_POLICY_META) — إلى
 * {label, color, icon} جاهزة للعرض. أي مكان بالمشروع يحتاج يعرض حالة
 * مشاركة (شارة، بوكس "How this works"...) لازم يمرّ من هون، مش يكتب
 * لون/أيقونة مستقلة لحاله.
 *
 * للحالتين المُشتقّتين (Active/Completed) نستخدم لون وأيقونة
 * OPPORTUNITY_STATUS_META[IN_PROGRESS/COMPLETED] مباشرة بدل تعريف لون
 * منفصل لهما — بما إنهما فعليًا انعكاس مباشر لحالة الفرصة نفسها بلحظة
 * العرض، هيك بيضلوا متزامنين تلقائيًا مع أي تغيير مستقبلي بألوان/أيقونات
 * حالة الفرصة، بدون أي مزامنة يدوية بين الملفين.
 * @param {string} displayStatus - إحدى قيم PARTICIPATION_DISPLAY_STATUS
 * @returns {{label:string, color:string, icon:Function}|undefined}
 */
export function getDisplayStatusMeta(displayStatus) {
  if (displayStatus === PARTICIPATION_DISPLAY_STATUS.ACTIVE) {
    const { color, icon } = OPPORTUNITY_STATUS_META[OPPORTUNITY_STATUS.IN_PROGRESS];
    return { label: DERIVED_STATUS_LABELS[displayStatus], color, icon };
  }

  if (displayStatus === PARTICIPATION_DISPLAY_STATUS.COMPLETED) {
    const { color, icon } = OPPORTUNITY_STATUS_META[OPPORTUNITY_STATUS.COMPLETED];
    return { label: DERIVED_STATUS_LABELS[displayStatus], color, icon };
  }

  return PARTICIPATION_STATUS_META[displayStatus];
}

/**
 * نفس getDisplayStatusMeta فوق، بس بداية من مشاركة خام (بدل حالة عرض
 * جاهزة مسبقًا) — تُستخدم من ParticipationStatusBadge حصرًا.
 * @param {{status:string, opportunity?:{status?:string}|null}} participation
 * @returns {{label:string, color:string, icon:Function}}
 */
export function getParticipationStatusMeta(participation) {
  return getDisplayStatusMeta(getParticipationDisplayStatus(participation));
}
