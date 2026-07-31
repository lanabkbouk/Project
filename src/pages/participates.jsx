import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Compass } from "lucide-react";
import Typography from "../components/ui/Typography";
import ParticipationCard from "../components/opportunity/ParticipationCard";
import LoadingSpinner from "../components/common/LoadingSpinner";
import EmptyState from "../components/common/EmptyState";
import { fetchMyParticipations } from "../services/participations";
import { ROUTES } from "../constants/paths";

export default function Participates() {
  const navigate = useNavigate();
  const [participations, setParticipations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const data = await fetchMyParticipations();
        if (isMounted) setParticipations(data);
      } catch (err) {
        if (isMounted) setError(err.message || "Failed to load your volunteering history");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Typography variant="sectionTitle" className="mb-2">
        My Volunteering
      </Typography>
      <Typography variant="body" className="mb-8 text-body">
        Track the opportunities you've joined and your progress so far.
      </Typography>

      {loading ? (
        <LoadingSpinner message="Loading your volunteering history..." />
      ) : error ? (
        <p className="text-sm text-danger">{error}</p>
      ) : participations.length === 0 ? (
        <EmptyState
          icon={Compass}
          title="You haven't joined any opportunities yet"
          description="Browse open opportunities that match your skills and start making an impact today."
          actionLabel="Explore Opportunities"
          onAction={() => navigate(ROUTES.EXPLORE)}
        />
      ) : (
        <div className="flex flex-col gap-4">
          {participations.map((participation) => (
            <ParticipationCard key={participation.id} participation={participation} />
          ))}
        </div>
      )}
    </div>
  );
}