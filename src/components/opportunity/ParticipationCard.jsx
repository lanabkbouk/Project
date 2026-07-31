import { Link } from "react-router-dom";
import { Clock, MapPin } from "lucide-react";
import ParticipationStatusBadge from "./ParticipationStatusBadge";
import { ROUTES } from "../../constants/paths";

export default function ParticipationCard({ participation }) {
  const { opportunity, status, hoursLogged, joinedDate } = participation;

  return (
    <div className="rounded-2xl bg-field border border-heading/10 p-5 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between gap-3 mb-2">
        <Link to={`${ROUTES.OPPORTUNITIES}/${opportunity.id}`} className="font-semibold text-heading hover:underline">
          {opportunity.title}
        </Link>
        <ParticipationStatusBadge status={status} />
      </div>

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
    </div>
  );
}