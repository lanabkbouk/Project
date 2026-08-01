import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { MapPin, Calendar, Clock } from "lucide-react";
import Typography from "../../components/ui/Typography";
import Chip from "../../components/ui/Chip";
import Button from "../../components/ui/Button";
import OpportunityProgressBar from "../../components/opportunity/OpportunityProgressBar";
import CategorySidebar from "../../components/opportunity/CategorySidebar";
import SimilarOpportunities from "../../components/opportunity/SimilarOpportunities";
import Skeleton from "../../components/ui/Skeleton";
import { PANEL_SURFACE } from "../../utils/surfaceStyles";
import { useOpportunityDetailsQuery } from "../../hooks/queries/useOpportunityDetailsQuery";
import { useParticipateMutation } from "../../hooks/queries/useParticipateMutation";
import { useCategoriesQuery } from "../../hooks/queries/useCategoriesQuery";
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

  const [hasJoined, setHasJoined] = useState(false);
  const [joinError, setJoinError] = useState("");

  // نفس هوك التصنيفات المستخدم بصفحة قائمة الفرص — React Query بيتشارك
  // نفس الكاش (['categories']) تلقائيًا، فما في طلب مكرر لو الصفحتين
  // فُتحتا بنفس الجلسة
  const categoriesQuery = useCategoriesQuery();
  const detailsQuery = useOpportunityDetailsQuery(id);
  const participateMutation = useParticipateMutation(id);

  const opportunity = detailsQuery.data?.opportunity ?? null;
  const similar = detailsQuery.data?.similar ?? [];
  const categories = categoriesQuery.data ?? [];

  const loading = detailsQuery.isPending;
  const loadError = detailsQuery.isError
    ? detailsQuery.error?.message || "Failed to load this opportunity"
    : "";

  async function handleParticipate() {
    setJoinError("");
    const result = await participateMutation.mutateAsync();
    if (result?.success) {
      setHasJoined(true);
    } else {
      setJoinError(result?.error || "Failed to join this opportunity");
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          <div className="flex-1 min-w-0">
            <Skeleton className="h-9 w-2/3 mb-4" />
            <Skeleton className="w-full aspect-video rounded-3xl mb-6" />
            <Skeleton className="h-2 w-full rounded-full mb-6" />
            <div className="flex flex-wrap gap-4 mb-6">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-24 w-full rounded-2xl mb-8" />
            <Skeleton className="h-6 w-48 mb-3" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6" />
          </div>

          <div className="w-full lg:w-72 shrink-0 flex flex-col gap-6">
            <div className={`${PANEL_SURFACE} p-5 flex flex-col gap-3`}>
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-full rounded-lg" />
              <Skeleton className="h-8 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loadError || !opportunity) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <p className="rounded-lg border border-danger bg-danger/5 px-3 py-2 text-sm text-danger">
          {loadError || "This opportunity could not be found."}
        </p>
      </div>
    );
  }

  const isVolunteer = isAuthenticated && accountType === ACCOUNT_TYPES.VOLUNTEER;
  // حساب دقيق لكل حالة ممكنة لزر المشاركة، بدل ما يكون منطق الزر مبعثر
  // بين onClick و disabled و النص — كل شي هون بمكان واحد وواضح.
  const isGuest = !isAuthenticated;
  const isNonVolunteerAccount = isAuthenticated && !isVolunteer; // حساب منظمة مسجّل دخوله
  const spotsLeft = Math.max(opportunity.maxVolunteers - opportunity.currentVolunteers, 0);
  const categoryName = opportunity.category?.name;
  const categoryStyle = CATEGORY_COLORS[categoryName] || CATEGORY_COLORS.Social;
  const CategoryIcon = CATEGORY_ICONS[categoryName] || MapPin;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <nav className="text-sm text-heading/50 mb-4" aria-label="Breadcrumb">
        <Link to={ROUTES.OPPORTUNITIES} className="hover:text-primary rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40">
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

          <div className={`${PANEL_SURFACE} p-6 mb-8`}>
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
            onClick={
              isGuest
                ? () => navigate(ROUTES.REGISTER) // زائر: نحوّله مباشرة لإنشاء حساب، بلا رسالة وسيطة
                : isVolunteer
                  ? handleParticipate
                  : undefined
            }
            isLoading={participateMutation.isPending}
            // الزر يتعطل بس لحالة: انضم فعلاً / اكتملت الفرصة / حساب منظمة مسجّل دخوله
            // الزائر ما بينعطل الزر عندو، بينقله للتسجيل بدل ما يمنعه
            disabled={isNonVolunteerAccount || hasJoined || spotsLeft === 0}
            loadingText="Joining..."
          >
            {isGuest
              ? "Participate"
              : hasJoined
                ? "You're in! ✓"
                : spotsLeft === 0
                  ? "Fully Booked"
                  : "Participate"}
          </Button>

          {/* رسالة توضيحية تبقى بس لحساب منظمة مسجّل دخوله (مو متطوع) */}
          {isNonVolunteerAccount ? (
            <p className="mt-2 text-sm text-heading/50">
              Only volunteer accounts can join opportunities.
            </p>
          ) : null}

          {joinError ? (
            <p className="mt-2 rounded-lg border border-danger bg-danger/5 px-3 py-2 text-sm text-danger">
              {joinError}
            </p>
          ) : null}
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