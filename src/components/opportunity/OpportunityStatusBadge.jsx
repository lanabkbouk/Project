import Chip from "../ui/Chip";
import { OPPORTUNITY_STATUS_META } from "../../constants/opportunityStatus";

// الأيقونة تظهر دايمًا مع اللون والنص سوا (مش اللون لحاله) — نفس مبدأ
// ParticipationStatusBadge بالضبط، حتى Completed (رمادي هون) يبقى
// مميّز بصريًا عن Withdrawn/Expired (رماديتين برضو بـ
// PARTICIPATION_STATUS_META) لما يظهروا سوا بأي مكان.
export default function OpportunityStatusBadge({ status, className = "" }) {
  const meta = OPPORTUNITY_STATUS_META[status];

  if (!meta) return null;

  const Icon = meta.icon;

  return (
    <Chip color={meta.color} className={`inline-flex items-center gap-1.5 ${className}`}>
      {Icon && <Icon size={13} aria-hidden="true" />}
      {meta.label}
    </Chip>
  );
}