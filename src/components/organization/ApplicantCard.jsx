import { MapPin, Phone, Check, X } from "lucide-react";
import Chip from "../ui/Chip";
import Button from "../ui/Button";
import ParticipationStatusBadge from "../opportunity/ParticipationStatusBadge";
import { PARTICIPATION_STATUS } from "../../constants/participationStatus";

export default function ApplicantCard({ applicant, onAccept, onReject, isUpdating, isVerified = true }) {
  const { volunteer, status, participatedAt } = applicant;
  const isPending = status === PARTICIPATION_STATUS.PENDING;

  if (!volunteer) return null;

  return (
    <div className="rounded-2xl bg-field border border-heading/10 p-5 flex flex-col sm:flex-row sm:items-center gap-4">
      {/* الصورة الرمزية */}
      <div className="h-14 w-14 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg shrink-0">
        {volunteer.name?.charAt(0) || "?"}
      </div>

      {/* المعلومات */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <h3 className="font-semibold text-heading">{volunteer.name}</h3>
          <ParticipationStatusBadge status={status} />
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm text-body mb-2">
          <span className="flex items-center gap-1">
            <MapPin size={14} className="text-primary" aria-hidden="true" />
            {volunteer.city}
          </span>
          <span className="flex items-center gap-1">
            <Phone size={14} className="text-primary" aria-hidden="true" />
            {volunteer.phone}
          </span>
          <span className="text-heading/40">Applied {participatedAt}</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {(volunteer.skills || []).map((skill) => (
            <Chip key={skill} color="blue">
              {skill}
            </Chip>
          ))}
        </div>
      </div>

      {/* أزرار القبول/الرفض — فقط لطلب قيد الانتظار */}
      {isPending && (
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="success"
            size="small"
            disabled={isUpdating || !isVerified}
            onClick={() => onAccept(applicant.id)}
            className="flex items-center gap-1"
            title={!isVerified ? "Available once your organization is verified" : undefined}
          >
            <Check size={16} />
            Accept
          </Button>
          <Button
            variant="ghost"
            size="small"
            disabled={isUpdating || !isVerified}
            onClick={() => onReject(applicant.id)}
            className="flex items-center gap-1 text-danger hover:bg-danger/10"
            title={!isVerified ? "Available once your organization is verified" : undefined}
          >
            <X size={16} />
            Reject
          </Button>
        </div>
      )}
    </div>
  );
}