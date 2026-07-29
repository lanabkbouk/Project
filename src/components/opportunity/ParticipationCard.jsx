import { Link } from "react-router-dom";
import { Clock, MapPin, X } from "lucide-react";
import ParticipationStatusBadge from "./ParticipationStatusBadge";
import Button from "../ui/Button";
import { ROUTES } from "../../constants/paths";
import { PARTICIPATION_STATUS } from "../../constants/participationStatus";

// الحالات التي يُسمح فيها للمتطوع بسحب طلبه بنفسه
const WITHDRAWABLE_STATUSES = [PARTICIPATION_STATUS.PENDING, PARTICIPATION_STATUS.ACCEPTED];

export default function ParticipationCard({ participation, onWithdraw }) {
  const { opportunity, status, hoursLogged, joinedDate } = participation;
  const canWithdraw = WITHDRAWABLE_STATUSES.includes(status);

  return (
    <div className="rounded-2xl bg-bg border border-heading/10 p-5 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between gap-3 mb-2">
        <Link to={`${ROUTES.OPPORTUNITIES}/${opportunity.id}`} className="font-semibold text-heading hover:underline">
          {opportunity.title}
        </Link>
        <ParticipationStatusBadge status={status} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-4 text-sm text-body">
          <span className="flex items-center gap-1">
            <MapPin size={14} className="text-primary" aria-hidden="true" />
            {opportunity.location}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={14} className="text-primary" aria-hidden="true" />
            {hoursLogged} hrs logged
          </span>
          <span className="text-heading/40">Joined {joinedDate}</span>
        </div>

        {canWithdraw && (
          <Button
            type="button"
            variant="ghost"
            size="small"
            onClick={() => onWithdraw?.(participation.id)}
            className="flex items-center gap-1 text-danger hover:bg-danger/10"
          >
            <X size={14} />
            Cancel Request
          </Button>
        )}
      </div>
    </div>
  );
}