// نقطة واحدة لقرار "هل يقدر المتطوع ينسحب من هاي المشاركة؟" — كانت
// سابقًا محسوبة Inline جوا ParticipationCard.jsx بس، بينما صفحة تفاصيل
// الفرصة (OpportunityLifecycleCard) محتاجة تشرح نفس السياسة كنص لزائر
// لسا ما قدّم طلب. بدل ما النص يتكرر بمكانين وينحرف عن بعضه مستقبلًا،
// الاثنان يقرأوا من WITHDRAWAL_POLICY_META تحت.

import { PARTICIPATION_STATUS } from "../constants/participationStatus";
import { PARTICIPATION_DISPLAY_STATUS } from "./participationDisplayStatus";
import { isRegistrationOpen } from "./opportunityStatus";

/**
 * @param {{status:string, opportunity:object|null, canWithdraw?:boolean}} participation
 * @returns {boolean}
 *
 * (أ) لو الكائن القادم من الـ API معه حقل canWithdraw صريح (حقل مستقبلي
 *     من Laravel — بنفس تسمية camelCase المستخدمة لباقي الحقول بهالمشروع
 *     زي committedHours وhoursLogged، مش snake_case)، نستخدمه مباشرة
 *     كمصدر الحقيقة بدون أي حساب إضافي.
 * (ب) غير هيك: pending أو accepted، وبس لو تسجيل الفرصة لسا مفتوح فعليًا
 *     (يعني قبل ما تبدأ الفرصة — isRegistrationOpen بترجع false تلقائيًا
 *     أول ما تبدأ، راجع utils/opportunityStatus.js)
 */
export function canWithdraw(participation) {
  if (typeof participation?.canWithdraw === "boolean") return participation.canWithdraw;

  const { status, opportunity } = participation;
  const isEligibleStatus = status === PARTICIPATION_STATUS.PENDING || status === PARTICIPATION_STATUS.ACCEPTED;

  return isEligibleStatus && isRegistrationOpen(opportunity);
}

// نص موحّد لسياسة السحب حسب الحالة — يُستخدم بصفحة "My Volunteering"
// (تلميح البطاقة) وببطاقة دورة حياة الفرصة سوا، بدون تكرار الصياغة
export const WITHDRAWAL_POLICY_META = [
  {
    displayStatus: PARTICIPATION_DISPLAY_STATUS.PENDING,
    label: "Pending",
    allowed: true,
    description: "Allowed — you can withdraw while your application is awaiting review.",
  },
  {
    displayStatus: PARTICIPATION_DISPLAY_STATUS.ACCEPTED,
    label: "Accepted (before start)",
    allowed: true,
    description: "Allowed — you can withdraw any time before the opportunity starts.",
  },
  {
    displayStatus: PARTICIPATION_DISPLAY_STATUS.ACTIVE,
    label: "Active",
    allowed: false,
    description: "Not allowed — the opportunity has already started.",
  },
  {
    displayStatus: PARTICIPATION_DISPLAY_STATUS.COMPLETED,
    label: "Completed",
    allowed: false,
    description: "Not allowed — the opportunity has finished.",
  },
  {
    displayStatus: PARTICIPATION_DISPLAY_STATUS.REJECTED,
    label: "Rejected",
    allowed: false,
    description: "Not allowed — there's nothing to withdraw from.",
  },
];
