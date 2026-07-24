import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Typography from "../components/ui/Typography";
import Button from "../components/ui/Button";
import ParticipationCard from "../components/opportunity/ParticipationCard";
import { fetchMyParticipations } from "../services/participations";
import { ROUTES } from "../constants/paths";

export default function Participates() {
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
        <p className="text-sm text-heading/50">Loading...</p>
      ) : error ? (
        <p className="text-sm text-danger">{error}</p>
      ) : participations.length === 0 ? (
        <div className="rounded-3xl bg-heading/5 border border-heading/10 p-10 text-center flex flex-col items-center gap-4">
          <Typography variant="h4">You haven't joined any opportunities yet</Typography>
          <Typography variant="body" className="text-body max-w-md">
            Browse open opportunities that match your skills and start making an impact today.
          </Typography>
          <Link to={ROUTES.EXPLORE}>
            <Button variant="primary" size="large">
              Explore Opportunities
            </Button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {participations.map((participation) => (
            <ParticipationCard key={participation.opportunityId} participation={participation} />
          ))}
        </div>
      )}
    </div>
  );
}