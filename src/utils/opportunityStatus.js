// يحسب الحالة "الفعلية" للفرصة اعتمادًا على التاريخ الحالي وعدد المتطوعين،
// بدل الاعتماد بس على قيمة status مخزّنة يدويًا — هيك الفرصة بتنتقل تلقائيًا
// عبر مراحلها الأربع (تسجيل مفتوح ← تسجيل منتهي ← قيد العمل ← منتهية) بمجرد
// ما ننادي هالدالة، بدون أي Cron Job أو تدخل يدوي.
//
// بوضع الـ API الحقيقي: الباك اند هو يلي بيحسب ويرجّع status جاهزة، فهاي
// الدالة بتصير غير مستخدمة إلا بوضع الـ Mock (راجع services/opportunities.js).

import { OPPORTUNITY_STATUS } from "../constants/opportunityStatus";

/**
 * @param {{startDate?:string, endDate?:string, registerEndAt?:string,
 *   currentVolunteers?:number, maxVolunteers?:number, registrationClosedManually?:boolean}} opportunity
 * @param {Date} [now] - محقونة كوسيط لتسهيل الاختبار، افتراضيًا الوقت الحالي
 */
export function getEffectiveOpportunityStatus(opportunity, now = new Date()) {
  const startDate = opportunity.startDate ? new Date(opportunity.startDate) : null;
  const endDate = opportunity.endDate ? new Date(opportunity.endDate) : null;
  const registerEndAt = opportunity.registerEndAt ? new Date(opportunity.registerEndAt) : null;

  // انتهت الفرصة فعليًا — أعلى أولوية، بغض النظر عن أي شي آخر
  if (endDate && now > endDate) return OPPORTUNITY_STATUS.COMPLETED;

  // بدأ العمل الفعلي بالفرصة (وصلنا start_date) لكن لسا ما انتهت
  if (startDate && now >= startDate) return OPPORTUNITY_STATUS.IN_PROGRESS;

  // قبل ما تبدأ الفرصة: إما التسجيل لسا مفتوح أو انتهى
  const isFull =
    opportunity.maxVolunteers != null &&
    (opportunity.currentVolunteers || 0) >= opportunity.maxVolunteers;
  const registrationWindowPassed = Boolean(registerEndAt && now > registerEndAt);
  const closedManually = Boolean(opportunity.registrationClosedManually);

  if (isFull || registrationWindowPassed || closedManually) {
    return OPPORTUNITY_STATUS.REGISTRATION_CLOSED;
  }

  return OPPORTUNITY_STATUS.REGISTRATION_OPEN;
}

/** اختصار شائع الاستخدام: هل المتطوع لسا يقدر يسجّل بهاي الفرصة؟ */
export function isRegistrationOpen(opportunity, now = new Date()) {
  return getEffectiveOpportunityStatus(opportunity, now) === OPPORTUNITY_STATUS.REGISTRATION_OPEN;
}

const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000;

/**
 * كم يوم متبقٍّ لبدء الفرصة، أو null لو خارج نافذة "قريبًا" (يومين)
 * أو لو بدأت فعليًا (بالماضي أو هالّلحظة بالضبط). مصدر واحد يستخدمه
 * services/notifications.js (تذكير الجرس) وParticipationCard.jsx
 * (الشارة على البطاقة) معًا — نفس القاعدة بالضبط، بدون احتمال ينحرف
 * أحد الملفين عن الآخر مستقبلًا.
 * @param {string} [startDate]
 * @param {Date} [now] - محقونة كوسيط لتسهيل الاختبار
 */
export function getDaysUntilStart(startDate, now = new Date()) {
  if (!startDate) return null;
  const msUntilStart = new Date(startDate) - now;
  if (msUntilStart <= 0 || msUntilStart > TWO_DAYS_MS) return null;
  return Math.max(1, Math.ceil(msUntilStart / (24 * 60 * 60 * 1000)));
}