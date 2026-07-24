import { Link } from "react-router-dom";
import { Clock, MapPin } from "lucide-react";
import Chip from "../ui/Chip";
import { ROUTES } from "../../constants/paths";

const STATUS_STYLES = {
  ongoing: { label: "Ongoing", color: "blue" },
  completed: { label: "Completed", color: "green" },
  upcoming: { label: "Upcoming", color: "gold" },
};

export default function ParticipationCard({ participation }) {
  const { opportunity, status, hoursLogged, joinedDate } = participation;
  const statusInfo = STATUS_STYLES[status] || STATUS_STYLES.ongoing;

  return (
    <Link
      to={`${ROUTES.OPPORTUNITIES}/${opportunity.id}`}
      className="block rounded-2xl bg-bg border border-heading/10 p-5 hover:shadow-lg transition-shadow"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="font-semibold text-heading">{opportunity.title}</h3>
        <Chip color={statusInfo.color}>{statusInfo.label}</Chip>
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
    </Link>
  );
}