// components/organization/OrganizationCard.jsx
//
// بطاقة منظمة بدليل المنظمات العام (Organizations Directory) — تختلف عن
// MyCauseCard (يلي لبطاقات فرص المنظمة بلوحة تحكمها الخاصة). هاي البطاقة
// للعرض العام فقط (اسم + مدينة + مقتطف وصف + شارة توثيق)، بتفتح على
// صفحة تفاصيل المنظمة عند الضغط.

import { Building2, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Card from "../ui/Card";
import Button from "../ui/Button";
import { ROUTES } from "../../constants/paths";
import { getOrganizationStatusMeta, ORGANIZATION_STATUS } from "../../constants/organizationStatus";

export default function OrganizationCard({ organization }) {
  const navigate = useNavigate();
  const isVerified = organization.status === ORGANIZATION_STATUS.VERIFIED;
  const statusMeta = getOrganizationStatusMeta(organization.status);

  const imageFallback = (
    <div className="flex w-full aspect-video items-center justify-center bg-primary/10">
      <Building2 className="h-10 w-10 text-primary" aria-hidden="true" />
    </div>
  );

  const verifiedBadge = isVerified ? (
    <span
      className={`inline-flex items-center rounded-full text-xs font-semibold px-3 py-1 shadow-sm ${statusMeta.badgeClassName}`}
    >
      {statusMeta.label}
    </span>
  ) : null;

  const goToProfile = () => navigate(`${ROUTES.ORGANIZATIONS}/${organization.id}`);

  return (
    <Card
      imageSrc={organization.profileImageUrl}
      imageAlt={organization.name}
      imageFallback={imageFallback}
      badge={verifiedBadge}
      title={organization.name}
      description={organization.description}
      onAction={goToProfile}
    >
      <div className="flex items-center gap-1 mb-4 text-sm text-body">
        <MapPin size={16} className="text-primary" aria-hidden="true" />
        {organization.city}
      </div>

      <Button
        variant="secondary"
        fullWidth
        className="py-4 rounded-4xl text-[15px] font-bold uppercase tracking-wide mt-auto"
        onClick={goToProfile}
      >
        View Profile
      </Button>
    </Card>
  );
}