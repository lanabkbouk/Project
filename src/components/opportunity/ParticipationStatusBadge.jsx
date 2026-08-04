import { Clock, CheckCircle2, XCircle } from "lucide-react";
import Chip from "../ui/Chip";
import { PARTICIPATION_STATUS, PARTICIPATION_STATUS_META } from "../../constants/participationStatus";

// أيقونة لكل حالة — مستخدمة فقط لما withIcon=true (شاشة إدارة المتقدمين)،
// حتى الشارة تصير أكثر بروزًا هناك دون التأثير على استخداماتها التانية
// (بطاقة "مشاركاتي" عند المتطوع، وقائمة "أحدث النشاطات" بالداشبورد)
const STATUS_ICONS = {
  [PARTICIPATION_STATUS.PENDING]: Clock,
  [PARTICIPATION_STATUS.ACCEPTED]: CheckCircle2,
  [PARTICIPATION_STATUS.REJECTED]: XCircle,
};

// شارة حالة المشاركة — كومبوننت مستقل حتى يُعاد استخدامه بأكثر من مكان
// (بطاقة "مشاركاتي" عند المتطوع، وقائمة المتقدمين عند المنظمة لاحقًا)
// بدون تكرار منطق تحويل الحالة إلى لون/نص في كل مكان لحاله
export default function ParticipationStatusBadge({ status, withIcon = false, className = "" }) {
  const meta = PARTICIPATION_STATUS_META[status];

  if (!meta) return null;

  const Icon = STATUS_ICONS[status];

  return (
    <Chip color={meta.color} className={`inline-flex items-center gap-1.5 ${className}`}>
      {withIcon && Icon && <Icon size={13} aria-hidden="true" />}
      {meta.label}
    </Chip>
  );
}