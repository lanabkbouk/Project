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

export default function OrganizationCard({ organization }) {
  const navigate = useNavigate();

  const imageFallback = (
    <div className="flex w-full aspect-video items-center justify-center bg-primary/10">
      <Building2 className="h-10 w-10 text-primary" aria-hidden="true" />
    </div>
  );

  // TODO: عمود status غير متوفر من الباك اند حاليًا — إعادة التفعيل
  // بعد إضافته لجدول organizations (راجع مع مطور الباك اند). شارة
  // "Verified" كانت رح تظهر/تختفي بشكل عشوائي (دايمًا true بوضع mock،
  // دايمًا false بوضع real) بدل ما تعكس حالة توثيق فعلية، فمخفية مؤقتًا
  // بدل ما تضلّل الزائر.
  const verifiedBadge = null;

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