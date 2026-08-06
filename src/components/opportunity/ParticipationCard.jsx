import { useState } from "react";
import { Link } from "react-router-dom";
import { Building2, Clock, MapPin, LogOut } from "lucide-react";
import Button from "../ui/Button";
import ParticipationStatusBadge from "./ParticipationStatusBadge";
import { useWithdrawParticipationMutation } from "../../hooks/queries/useWithdrawParticipationMutation";
import { PARTICIPATION_STATUS } from "../../constants/participationStatus";
import { ROUTES } from "../../constants/paths";
import { CARD_BASE } from "../../utils/surfaceStyles";
import { isRegistrationOpen } from "../../utils/opportunityStatus";

export default function ParticipationCard({ participation }) {
  const { opportunity, status, committedHours, hoursLogged, joinedDate } = participation;
  const withdrawMutation = useWithdrawParticipationMutation();
  const [error, setError] = useState("");

  // hoursLogged بيضل null لحد ما المنظمة تأكد/تعدّل الرقم النهائي بعد
  // انتهاء الفرصة فعليًا (راجع updateParticipationHours) — بعد التأكيد
  // نعرض الرقمين سوا (يلي حدّده المتطوع لنفسه + يلي أكّدته المنظمة)
  const isConfirmed = hoursLogged !== null && hoursLogged !== undefined;
  const hoursLabel = isConfirmed
    ? `Pledged ${committedHours} hrs → Confirmed ${hoursLogged} hrs`
    : `${committedHours} hrs pledged`;

  // قرار مع فريق سنا: الانسحاب متاح من pending أو accepted سوا (حذف
  // كامل للسطر)، بس مش من rejected أو expired — ما في شي ينسحب منه.
  // ⚠️ لازم كمان فترة التسجيل لسا مفتوحة — وإلا المنظمة ممكن تخسر مقعد
  // مقبول بعد ما قفلت التسجيل (حتى لو الفرصة نفسها لسا ما بدأت)، فمجرد
  // إغلاق التسجيل لازم يخفي زر الانسحاب نهائيًا
  const canWithdraw =
    (status === PARTICIPATION_STATUS.PENDING || status === PARTICIPATION_STATUS.ACCEPTED) &&
    isRegistrationOpen(opportunity);

  const handleWithdraw = async () => {
    const confirmed = window.confirm(
      `Withdraw from "${opportunity.title}"? This can't be undone.`,
    );
    if (!confirmed) return;

    setError("");
    const result = await withdrawMutation.mutateAsync(participation.id);
    if (!result.success) {
      setError(result.error || "Failed to withdraw from this opportunity");
    }
  };

  return (
    <div className={CARD_BASE}>
      <div className="flex items-start justify-between gap-3 mb-1">
        <Link to={`${ROUTES.OPPORTUNITIES}/${opportunity.id}`} className="font-semibold text-heading hover:underline">
          {opportunity.title}
        </Link>
        <ParticipationStatusBadge status={status} />
      </div>

      {opportunity.organization?.name && (
        <Link
          to={`${ROUTES.ORGANIZATIONS}/${opportunity.organization.id}`}
          className="mb-2 flex w-fit items-center gap-1.5 text-sm text-body hover:text-primary hover:underline"
        >
          <Building2 size={13} className="text-primary shrink-0" aria-hidden="true" />
          {opportunity.organization.name}
        </Link>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-4 text-sm text-body">
          <span className="flex items-center gap-1">
            <MapPin size={14} className="text-primary" aria-hidden="true" />
            {opportunity.location}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={14} className="text-primary" aria-hidden="true" />
            {hoursLabel}
          </span>
          <span className="text-heading/40">Joined {joinedDate}</span>
        </div>

        {canWithdraw && (
          <Button
            variant="ghost"
            size="small"
            onClick={handleWithdraw}
            disabled={withdrawMutation.isPending}
            className="flex items-center gap-1 !px-3 !py-1.5 !text-sm text-danger hover:bg-danger/10 shrink-0"
          >
            <LogOut size={14} />
            Withdraw
          </Button>
        )}
      </div>

      {error && <p className="mt-2 text-sm text-danger">{error}</p>}
    </div>
  );
}