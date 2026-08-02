import { Link, useParams, useNavigate } from "react-router-dom";
import { Building2, MapPin, Globe, Phone, User, PenSquare, Compass } from "lucide-react";
import Typography from "../../components/ui/Typography";
import Button from "../../components/ui/Button";
import OpportunityCard from "../../components/opportunity/OpportunityCard";
import CardSkeleton from "../../components/ui/CardSkeleton";
import EmptyState from "../../components/common/EmptyState";
import Skeleton from "../../components/ui/Skeleton";
import { PANEL_SURFACE } from "../../utils/surfaceStyles";
import { useOrganizationDetailsQuery } from "../../hooks/queries/useOrganizationDetailsQuery";
import { useOrganizationOpportunitiesQuery } from "../../hooks/queries/useOrganizationOpportunitiesQuery";
import { useAuth } from "../../context/AuthContext";
import { ROUTES } from "../../constants/paths";
import { getOrganizationStatusMeta, ORGANIZATION_STATUS } from "../../constants/organizationStatus";
import { getOrganizationId } from "../../utils/auth/getOrganizationId";

export default function OrganizationDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const detailsQuery = useOrganizationDetailsQuery(id);
  const opportunitiesQuery = useOrganizationOpportunitiesQuery(id);

  const organization = detailsQuery.data ?? null;
  const opportunities = opportunitiesQuery.data ?? [];

  const loading = detailsQuery.isPending;
  const loadError = detailsQuery.isError
    ? detailsQuery.error?.message || "Failed to load this organization"
    : "";

  // نفس منطق تحديد "منظمتي" المستخدم بالـ Navbar — لو هاي فعلًا منظمة
  // المستخدم المسجّل دخوله حاليًا، منظهر زر تعديل بروفايلها
  const myOrganizationId = getOrganizationId(user);
  const isOwnOrganization = organization && myOrganizationId === organization.id;

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Skeleton className="h-9 w-1/2 mb-4" />
        <Skeleton className="w-full aspect-[3/1] rounded-3xl mb-6" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6 mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  if (loadError || !organization) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <p className="rounded-lg border border-danger bg-danger/5 px-3 py-2 text-sm text-danger">
          {loadError || "This organization could not be found."}
        </p>
      </div>
    );
  }

  const isVerified = organization.status === ORGANIZATION_STATUS.VERIFIED;
  const statusMeta = getOrganizationStatusMeta(organization.status);
  const opportunitiesLoading = opportunitiesQuery.isPending;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <nav className="text-sm text-heading/50 mb-4" aria-label="Breadcrumb">
        <Link
          to={ROUTES.ORGANIZATIONS}
          className="hover:text-primary rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          Organizations
        </Link>
        <span className="mx-2">/</span>
        <span className="text-heading">{organization.name}</span>
      </nav>

      {/* غلاف علوي: صورة/شعار + الاسم + المدينة + شارة التوثيق */}
      <div className="w-full aspect-[3/1] rounded-4xl overflow-hidden bg-primary/10 flex items-center justify-center mb-6">
        {organization.profileImageUrl ? (
          <img
            src={organization.profileImageUrl}
            alt={organization.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <Building2 size={56} className="text-primary" aria-hidden="true" />
        )}
      </div>

      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <Typography variant="h1">{organization.name}</Typography>
            {isVerified ? (
              <span
                className={`inline-flex items-center rounded-full text-xs font-semibold px-3 py-1 ${statusMeta.badgeClassName}`}
              >
                {statusMeta.label}
              </span>
            ) : null}
          </div>
          <div className="flex items-center gap-1 text-sm text-body">
            <MapPin size={16} className="text-primary" aria-hidden="true" />
            {organization.city}
          </div>
        </div>

        {isOwnOrganization ? (
          <Button
            variant="secondary"
            onClick={() => navigate(ROUTES.ORGANIZATION_PROFILE)}
            className="flex items-center gap-2"
          >
            <PenSquare size={16} aria-hidden="true" />
            Edit Profile
          </Button>
        ) : null}
      </div>

      <Typography variant="h4" className="mb-3">
        About
      </Typography>
      <Typography variant="body" className="text-body leading-relaxed mb-8">
        {organization.description || "This organization hasn't added a description yet."}
      </Typography>

      {/* معلومات تواصل — تُعرض بس الحقول المتوفرة فعليًا */}
      {(organization.contactPerson || organization.phone || organization.website) && (
        <div className={`${PANEL_SURFACE} p-6 mb-10 flex flex-col gap-3`}>
          {organization.contactPerson ? (
            <div className="flex items-center gap-2 text-sm text-heading">
              <User size={16} className="text-primary shrink-0" aria-hidden="true" />
              <span className="text-heading/50">Contact person:</span>
              {organization.contactPerson}
            </div>
          ) : null}

          {organization.phone ? (
            <a
              href={`tel:${organization.phone}`}
              className="flex items-center gap-2 text-sm text-heading hover:text-primary w-fit rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              <Phone size={16} className="text-primary shrink-0" aria-hidden="true" />
              {organization.phone}
            </a>
          ) : null}

          {organization.website ? (
            <a
              href={organization.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-primary hover:underline w-fit rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              <Globe size={16} className="shrink-0" aria-hidden="true" />
              {organization.website}
            </a>
          ) : null}
        </div>
      )}

      {/* فرص هاي المنظمة المفتوحة حاليًا */}
      <Typography variant="h4" className="mb-4">
        Open Opportunities
      </Typography>

      {opportunitiesLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : opportunities.length === 0 ? (
        <EmptyState
          icon={Compass}
          title="No open opportunities right now"
          description="Check back later — this organization hasn't published any open opportunities yet."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {opportunities.map((opportunity) => (
            <OpportunityCard key={opportunity.id} opportunity={opportunity} />
          ))}
        </div>
      )}
    </div>
  );
}