// بطاقة متقدّم واحد بقائمة "المتقدمين" عند المنظمة. مُعاد تصميمها بمحاذاة
// وتسلسل هرمي أوضح: أفاتار + معلومات على اليسار، شارة الحالة والإجراء
// على اليمين، مع سطر مهارات مستقل تحته لتجنّب ازدحام السطر الأول.

import { MapPin, Phone, Check, X, CheckCircle2 } from "lucide-react";
import Button from "../ui/Button";
import SkillChipsPreview from "../common/SkillChipsPreview";
import ParticipationStatusBadge from "../opportunity/ParticipationStatusBadge";
import { PARTICIPATION_STATUS } from "../../constants/participationStatus";
import { CARD_BASE } from "../../utils/surfaceStyles";

export default function ApplicantCard({
  applicant,
  onAccept,
  onReject,
  isUpdating,
  isVerified = true,
  // ⚠️ حجز مستقبلي — "إدارة ساعات التطوع" (راجع التعليق أسفل الملف):
  // opportunityHasEnded لازم توصل من الصفحة الأم (applicantsList.jsx)
  // عبر مقارنة تاريخ انتهاء الفرصة بالتاريخ الحالي. غير مستخدمة بعد.
  opportunityHasEnded = false,
}) {
  const { volunteer, status, participatedAt } = applicant;
  const isPending = status === PARTICIPATION_STATUS.PENDING;
  const isAccepted = status === PARTICIPATION_STATUS.ACCEPTED;

  if (!volunteer) return null;

  return (
    <div
      className={`${CARD_BASE} flex flex-col gap-4`}
      // نقطة التقاط جاهزة لميزة "إدارة ساعات التطوع" المستقبلية — راجع
      // التعليق التفصيلي أسفل الملف. ما إلها أي تأثير بصري حاليًا.
      data-hours-management-eligible={opportunityHasEnded && isAccepted}
    >
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        {/* الصورة الرمزية */}
        <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg shrink-0">
          {volunteer.name?.charAt(0) || "?"}
        </div>

        {/* المعلومات */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="font-semibold text-heading truncate">{volunteer.name}</h3>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-body mt-1">
                {volunteer.city && (
                  <span className="flex items-center gap-1">
                    <MapPin size={13} className="text-primary shrink-0" aria-hidden="true" />
                    {volunteer.city}
                  </span>
                )}
                {volunteer.phone && (
                  <span className="flex items-center gap-1">
                    <Phone size={13} className="text-primary shrink-0" aria-hidden="true" />
                    {volunteer.phone}
                  </span>
                )}
                <span className="text-heading/40">Applied {participatedAt}</span>
              </div>
            </div>

            {/* شارة الحالة — بارزة مع أيقونة، بمحاذاة أعلى البطاقة دايمًا */}
            <ParticipationStatusBadge status={status} withIcon className="shrink-0" />
          </div>

          {volunteer.skills?.length > 0 && (
            <div className="mt-3">
              <SkillChipsPreview skills={volunteer.skills} max={4} />
            </div>
          )}
        </div>
      </div>

      {/* شريط الإجراء السفلي — إما أزرار قرار (pending)، أو مؤشر "تم
          البتّ" (accepted/rejected) بدل ما نخلي المساحة فاضية بصمت */}
      <div className="flex items-center justify-end gap-2 pt-3 border-t border-heading/10">
        {isPending ? (
          <>
            <Button
              variant="success"
              size="small"
              disabled={isUpdating || !isVerified}
              onClick={() => onAccept(applicant.id)}
              className="flex items-center gap-1 !px-3 !py-1.5 !text-sm"
              title={!isVerified ? "Available once your organization is verified" : undefined}
            >
              <Check size={14} />
              Accept
            </Button>
            <Button
              variant="ghost"
              size="small"
              disabled={isUpdating || !isVerified}
              onClick={() => onReject(applicant.id)}
              className="flex items-center gap-1 !px-3 !py-1.5 !text-sm text-danger hover:bg-danger/10"
              title={!isVerified ? "Available once your organization is verified" : undefined}
            >
              <X size={14} />
              Reject
            </Button>
          </>
        ) : (
          <span className="flex items-center gap-1.5 text-xs font-medium text-heading/50">
            <CheckCircle2 size={14} aria-hidden="true" />
            Decision completed
          </span>
        )}

        {/*
          حجز مستقبلي — "إدارة ساعات التطوع" (لا تُبنَى الواجهة الآن):
          سيظهر هنا زر/قسم "Manage Hours" فقط عندما:
            1) opportunityHasEnded === true (الفرصة انتهت فعليًا)، و
            2) isAccepted === true (متطوع مقبول فقط، مو pending/rejected)
          مثال الشرط المستقبلي:
            {opportunityHasEnded && isAccepted && (
              <Button variant="secondary" size="small" onClick={() => onManageHours(applicant.id)}>
                Manage Hours
              </Button>
            )}
          الزر بيحتاج mutation جديدة (updateParticipationHours) بالضبط
          متل updateParticipationStatus الموجودة، وendpoint خاص بالساعات
          بالباك اند (راجع رد سابق: عمود hours_logged لسا مو موجود
          بجدول opportunity_volunteer). isAccepted مُحسوبة أعلاه مسبقًا
          لهذا الغرض بالضبط، فقط غير مستخدمة بعد.
        */}
      </div>
    </div>
  );
}