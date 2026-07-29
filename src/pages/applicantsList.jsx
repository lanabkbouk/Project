import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Typography from "../components/ui/Typography";
import ApplicantCard from "../components/organization/ApplicantCard";
import VerificationStatusBanner from "../components/OrgProfile/VerificationStatusBanner";
import { useOrganizationVerification } from "../hooks/useOrganizationVerification";
import { fetchOpportunityById } from "../services/opportunities";
import {
  fetchApplicantsForOpportunity,
  updateParticipationStatus,
} from "../services/participations";
import { PARTICIPATION_STATUS } from "../constants/participationStatus";
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
      <Typography variant="body" className="mb-8 text-body">
        {loading ? "Loading..." : opportunity?.title}
        {!loading && pendingCount > 0 ? ` — ${pendingCount} awaiting your review` : ""}
      </Typography>

      {error && <p className="text-sm text-danger mb-4">{error}</p>}

      {!loading && applicants.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-heading/20 bg-heading/5 p-12 text-center">
          <Typography variant="h4" className="mb-2">
            No applicants yet
          </Typography>
          <Typography variant="body" className="text-body">
            Once volunteers apply to this cause, they'll show up here.
          </Typography>
        </div>
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