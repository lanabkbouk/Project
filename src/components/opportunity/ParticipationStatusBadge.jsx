import Chip from "../ui/Chip";
import { getParticipationStatusMeta } from "../../utils/participationDisplayStatus";

// شارة حالة المشاركة — كومبوننت مستقل حتى يُعاد استخدامه بأكثر من مكان
// (بطاقة "مشاركاتي" عند المتطوع، قائمة المتقدمين عند المنظمة، أحدث
// النشاطات بالداشبورد) بدون تكرار منطق تحويل الحالة إلى لون/أيقونة/نص
// في كل مكان لحاله. الأيقونة تظهر دايمًا مع اللون والنص سوا (مش اللون
// لحاله) — هي عنصر التمييز البصري الأساسي بين الحالات يلي بتشارك نفس
// اللون الرمادي (Completed/Withdrawn/Expired).
//
// participation يتوقّع {status, opportunity?} — opportunity اختياري:
// لو انمرر (بطاقة "مشاركاتي" مثلًا)، الحالتين المُشتقّتين Active/Completed
// بيظهروا صح. لو ما انمرر (قائمة المتقدمين، أحدث النشاطات — ما عندهم
// كائن الفرصة الكامل أصلًا بالبيانات المتوفرة هلق)، الشارة بترجع تلقائيًا
// لحالة المشاركة الخام (pending/accepted/...) بدون أي خطأ أو كسر.
export default function ParticipationStatusBadge({ participation, className = "" }) {
  const meta = getParticipationStatusMeta(participation);

  if (!meta) return null;

  const Icon = meta.icon;

  return (
    <Chip color={meta.color} className={`inline-flex items-center gap-1.5 ${className}`}>
      {Icon && <Icon size={13} aria-hidden="true" />}
      {meta.label}
    </Chip>
  );
}
