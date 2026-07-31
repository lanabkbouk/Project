import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Users } from "lucide-react";
import Typography from "../components/ui/Typography";
import ApplicantCard from "../components/organization/ApplicantCard";
import Skeleton from "../components/ui/Skeleton";
import EmptyState from "../components/common/EmptyState";
import VerificationStatusBanner from "../components/OrgProfile/VerificationStatusBanner";
import { useOrganizationVerification } from "../hooks/useOrganizationVerification";
import { fetchOpportunityById } from "../services/opportunities";
import {
  fetchApplicantsForOpportunity,
  updateParticipationStatus,
} from "../services/participations";
import { PARTICIPATION_STATUS } from "../constants/participationStatus";
import { CARD_SURFACE } from "../utils/surfaceStyles";
import { ROUTES } from "../constants/paths";

export default function ApplicantsList() {
  const { id } = useParams();
  const { status, isVerified } = useOrganizationVerification();

  const [opportunity, setOpportunity] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const [{ opportunity: opportunityData }, applicantsData] = await Promise.all([
          fetchOpportunityById(id),
          fetchApplicantsForOpportunity(id),
        ]);
        if (!isMounted) return;
        setOpportunity(opportunityData);
        setApplicants(applicantsData);
      } catch (err) {
        if (isMounted) setError(err.message || "Failed to load applicants");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleStatusChange = async (applicantId, status) => {
    if (!isVerified) return;

    setUpdatingId(applicantId);
    const result = await updateParticipationStatus(applicantId, status);
    setUpdatingId(null);

    if (!result.success) {
      setError(result.error || "Failed to update this request");
      return;
    }

    setApplicants((current) =>
      current.map((applicant) =>
        applicant.id === applicantId ? { ...applicant, status } : applicant,
      ),
    );
  };

  const pendingCount = applicants.filter(
    (applicant) => applicant.status === PARTICIPATION_STATUS.PENDING,
  ).length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <VerificationStatusBanner status={status} />

      <Link
        to={ROUTES.MY_CAUSES}
        className="inline-flex items-center gap-1 text-sm text-primary hover:underline mb-4"
      >
        <ArrowLeft size={16} />
        Back to My Causes
      </Link>

      <Typography variant="sectionTitle" className="mb-1">
        Applicants
      </Typography>
      {!loading ? (
        <Typography variant="body" className="mb-8 text-body">
          {opportunity?.title}
          {pendingCount > 0 ? ` — ${pendingCount} awaiting your review` : ""}
        </Typography>
      ) : null}

      {error && (
        <p className="mb-4 rounded-lg border border-danger bg-danger/5 px-3 py-2 text-sm text-danger">
          {error}
        </p>
      )}

      {loading ? (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className={`${CARD_SURFACE} p-5 flex flex-col sm:flex-row sm:items-center gap-4`}>
              <Skeleton className="h-12 w-12 rounded-full shrink-0" />
              <div className="flex-1 flex flex-col gap-2">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <Skeleton className="h-9 w-24 rounded-xl" />
            </div>
          ))}
        </div>
      ) : applicants.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No applicants yet"
          description="Once volunteers apply to this cause, they'll show up here."
        />
      ) : (
        <div className="flex flex-col gap-4">
          {applicants.map((applicant) => (
            <ApplicantCard
              key={applicant.id}
              applicant={applicant}
              isUpdating={updatingId === applicant.id}
              isVerified={isVerified}
              onAccept={(applicantId) =>
                handleStatusChange(applicantId, PARTICIPATION_STATUS.ACCEPTED)
              }
              onReject={(applicantId) =>
                handleStatusChange(applicantId, PARTICIPATION_STATUS.REJECTED)
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}