import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Typography from "../components/ui/Typography";
import Button from "../components/ui/Button";
import MyCauseCard from "../components/organization/MyCauseCard";
import VerificationStatusBanner from "../components/OrgProfile/VerificationStatusBanner";
import { fetchMyOpportunities, deleteOpportunity } from "../services/opportunities";
import { useOrganizationVerification } from "../hooks/useOrganizationVerification";
import { ROUTES } from "../constants/paths";

export default function MyCauses() {
  const navigate = useNavigate();
  const { status, isVerified } = useOrganizationVerification();
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const data = await fetchMyOpportunities();
        if (isMounted) setOpportunities(data);
      } catch (err) {
        if (isMounted) setError(err.message || "Failed to load your causes");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleDelete = async (id) => {
    const result = await deleteOpportunity(id);
    if (!result.success) {
      setError(result.error || "Failed to delete this cause");
      return;
    }
    setOpportunities((current) => current.filter((opportunity) => opportunity.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <VerificationStatusBanner status={status} />

      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <Typography variant="sectionTitle" className="mb-2">
            My Causes
          </Typography>
          <Typography variant="body" className="text-body">
            Manage the volunteering opportunities you've published.
          </Typography>
        </div>

        <div className="flex flex-col items-end gap-1">
          <Button
            onClick={() => navigate(ROUTES.CREATE_CAUSE)}
            disabled={!isVerified}
            className="flex items-center gap-2"
          >
            <Plus size={18} />
            New Cause
          </Button>
          {!isVerified && (
            <p className="text-xs text-heading/50">Available once your organization is verified</p>
          )}
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-heading/50">Loading your causes...</p>
      ) : error ? (
        <p className="text-sm text-danger">{error}</p>
      ) : opportunities.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-heading/20 bg-heading/5 p-12 text-center">
          <Typography variant="h4" className="mb-2">
            You haven't posted any causes yet
          </Typography>
          <Typography variant="body" className="mb-6 text-body">
            {isVerified
              ? "Create your first volunteering opportunity to start receiving applicants."
              : "Once your organization is verified, you'll be able to publish your first cause."}
          </Typography>
          <Button
            onClick={() => navigate(ROUTES.CREATE_CAUSE)}
            disabled={!isVerified}
            className="inline-flex items-center gap-2"
          >
            <Plus size={18} />
            Create Your First Cause
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {opportunities.map((opportunity) => (
            <MyCauseCard
              key={opportunity.id}
              opportunity={opportunity}
              onDelete={handleDelete}
              isVerified={isVerified}
            />
          ))}
        </div>
      )}
    </div>
  );
}