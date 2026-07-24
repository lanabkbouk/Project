import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { MapPin, Calendar, Clock } from "lucide-react";
import Typography from "../../components/ui/Typography";
import Chip from "../../components/ui/Chip";
import Button from "../../components/ui/Button";
import OpportunityProgressBar from "../../components/opportunity/OpportunityProgressBar";
import CategorySidebar from "../../components/opportunity/CategorySidebar";
import SimilarOpportunities from "../../components/opportunity/SimilarOpportunities";
import useAsyncAction from "../../hooks/useAsyncAction";
import { fetchOpportunityById, participateInOpportunity } from "../../services/opportunities";
import { fetchCategories } from "../../services/categories";
import { useAuth } from "../../context/AuthContext";
import { ACCOUNT_TYPES } from "../../constants/auth/accountTypes";
import { ROUTES } from "../../constants/paths";
import { CATEGORY_COLORS, CATEGORY_ICONS } from "../../utils/categoryStyles";

function formatDate(dateString) {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function OpportunityDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, accountType } = useAuth();

  const [opportunity, setOpportunity] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [hasJoined, setHasJoined] = useState(false);

  const { loading: joining, error: joinError, execute: joinOpportunity } = useAsyncAction(
    () => participateInOpportunity(id),
  );

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    async function load() {
      try {
        const [{ opportunity: data, similar: similarData }, categoryList] = await Promise.all([
          fetchOpportunityById(id),
          fetchCategories(),
        ]);
        if (isMounted) {
          setOpportunity(data);
          setSimilar(similarData);
          setCategories(categoryList);
        }
      } catch (err) {
        if (isMounted) setLoadError(err.message || "Failed to load this opportunity");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, [id]);

  async function handleParticipate() {
    const result = await joinOpportunity();
    if (result.success) setHasJoined(true);
  }

  if (loading) {
    return <p className="max-w-7xl mx-auto px-4 py-10 text-sm text-heading/50">Loading...</p>;
  }

  if (loadError || !opportunity) {
    return (
      <p className="max-w-7xl mx-auto px-4 py-10 text-sm text-danger">
        {loadError || "This opportunity could not be found."}
      </p>
    );
  }

  const isVolunteer = isAuthenticated && accountType === ACCOUNT_TYPES.VOLUNTEER;
  const spotsLeft = Math.max(opportunity.maxVolunteers - opportunity.currentVolunteers, 0);
  const categoryName = opportunity.category?.name;
  const categoryStyle = CATEGORY_COLORS[categoryName] || CATEGORY_COLORS.Social;
  const CategoryIcon = CATEGORY_ICONS[categoryName] || MapPin;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <nav className="text-sm text-heading/50 mb-4" aria-label="Breadcrumb">
        <Link to={ROUTES.OPPORTUNITIES} className="hover:text-primary">
          Opportunities
        </Link>
        <span className="mx-2">/</span>
        <span className="text-heading">{opportunity.title}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-10">
        <div className="flex-1 min-w-0">
          <Typography variant="h1" className="mb-4">
            {opportunity.title}
          </Typography>

          <div className="w-full aspect-video rounded-4xl overflow-hidden bg-heading/5 flex items-center justify-center mb-6">
            {opportunity.image ? (
              <img
                src={opportunity.image}
                alt={opportunity.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className={`flex w-full h-full items-center justify-center ${categoryStyle}`}>
                <CategoryIcon size={48} aria-hidden="true" />
              </div>
            )}
          </div>

          <div className="mb-6">
            <OpportunityProgressBar
              current={opportunity.currentVolunteers}
              max={opportunity.maxVolunteers}
            />
          </div>

          <div className="flex flex-wrap gap-4 mb-6 text-sm text-body">
            <span className="flex items-center gap-1">
              <MapPin size={16} className="text-primary" aria-hidden="true" />
              {opportunity.location}
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={16} className="text-primary" aria-hidden="true" />
              {formatDate(opportunity.startDate)} - {formatDate(opportunity.endDate)}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={16} className="text-primary" aria-hidden="true" />
              {opportunity.minHours}-{opportunity.maxHours} hrs / session
            </span>
          </div>

          {opportunity.skills.length > 0 ? (
            <div className="flex flex-wrap gap-2 mb-8">
              {opportunity.skills.map((skill) => (
                <Chip key={skill.id} color="blue">
                  {skill.name}
                </Chip>
              ))}
            </div>
          ) : null}

          <div className="rounded-3xl bg-heading/5 border border-heading/10 p-6 mb-8">
            <p className="text-sm text-heading/50 mb-1">Organized by</p>
            <p className="font-semibold text-heading">{opportunity.organization.name}</p>
          </div>

          <Typography variant="h4" className="mb-3">
            About this opportunity
          </Typography>
          <Typography variant="body" className="text-body leading-relaxed mb-8">
            {opportunity.description}
          </Typography>

          <Button
            variant="primary"
            size="large"
            onClick={isVolunteer ? handleParticipate : undefined}
            isLoading={joining}
            disabled={!isVolunteer || hasJoined || spotsLeft === 0}
            loadingText="Joining..."
          >
            {!isVolunteer
              ? "Participate"
              : hasJoined
                ? "You're in! ✓"
                : spotsLeft === 0
                  ? "Fully Booked"
                  : "Participate"}
          </Button>

          {!isVolunteer ? (
            isAuthenticated ? (
              <p className="mt-2 text-sm text-heading/50">
                Only volunteer accounts can join opportunities.
              </p>
            ) : (
              <p className="mt-2 text-sm text-heading/50">
                You're browsing as a guest.{" "}
                <Link to={ROUTES.LOGIN} className="text-primary font-medium">
                  Log in
                </Link>{" "}
                or{" "}
                <Link to={ROUTES.REGISTER} className="text-primary font-medium">
                  create a volunteer account
                </Link>{" "}
                to participate in this opportunity.
              </p>
            )
          ) : null}

          {joinError ? <p className="mt-2 text-sm text-danger">{joinError}</p> : null}
        </div>

        <div className="w-full lg:w-72 shrink-0 flex flex-col gap-6">
          <CategorySidebar
            categories={categories}
            activeCategoryId={opportunity.category?.id || ""}
            onSelectCategory={() => navigate(ROUTES.OPPORTUNITIES)}
          />
          <SimilarOpportunities opportunities={similar} />
        </div>
      </div>
    </div>
  );
}