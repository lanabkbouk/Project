import Chip from "../ui/Chip";
import { PARTICIPATION_STATUS_META } from "../../constants/participationStatus";

// شارة حالة المشاركة — كومبوننت مستقل حتى يُعاد استخدامه بأكثر من مكان
// (بطاقة "مشاركاتي" عند المتطوع، وقائمة المتقدمين عند المنظمة لاحقًا)
// بدون تكرار منطق تحويل الحالة إلى لون/نص في كل مكان لحاله
export default function ParticipationStatusBadge({ status }) {
  const meta = PARTICIPATION_STATUS_META[status];

  if (!meta) return null;

  return <Chip color={meta.color}>{meta.label}</Chip>;
}