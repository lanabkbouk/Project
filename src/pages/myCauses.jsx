import { useEffect, useState } from "react";
import { Plus, FolderPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Typography from "../components/ui/Typography";
import Button from "../components/ui/Button";
import MyCauseCard from "../components/organization/MyCauseCard";
import VerificationStatusBanner from "../components/OrgProfile/VerificationStatusBanner";
import CardSkeleton from "../components/ui/CardSkeleton";
import EmptyState from "../components/common/EmptyState";
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

        {!loading && opportunities.length > 0 && (
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
        )}
      </div>

      {error && (
        <p className="mb-4 rounded-lg border border-danger bg-danger/5 px-3 py-2 text-sm text-danger">
          {error}
        </p>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <CardSkeleton key={index} />
          ))}
        </div>
      ) : opportunities.length === 0 ? (
        <EmptyState
          icon={FolderPlus}
          title={
            isVerified
              ? "Your organization hasn't published any causes yet."
              : "You haven't posted any causes yet"
          }
          description={
            isVerified
              ? "Create your first volunteering opportunity to start receiving applicants."
              : "Once your organization is verified, you'll be able to publish your first cause."
          }
          actionLabel={isVerified ? "Create Your Organization's First Cause" : undefined}
          onAction={isVerified ? () => navigate(ROUTES.CREATE_CAUSE) : undefined}
        />
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