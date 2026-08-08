
// قائمة "أحدث النشاطات": آخر طلبات مشاركة وصلت على فرص المنظمة، كل
// عنصر بيوضّح مين تقدّم، على أي فرصة، وشو حالة طلبه — نفس مكوّن شارة
// الحالة (ParticipationStatusBadge) المستخدم أصلًا بقائمة المتقدمين،
// بدون تكرار منطق الألوان.

import { Users } from "lucide-react";
import Typography from "../ui/Typography";
import ParticipationStatusBadge from "../opportunity/ParticipationStatusBadge";
import { PANEL_SURFACE } from "../../utils/surfaceStyles";

function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function RecentActivityFeed({ activity = [] }) {
  return (
    <div className={`${PANEL_SURFACE} p-6 md:p-8`}>
      <Typography variant="h4" gutterBottom>
        Recent Activity
      </Typography>

      {activity.length === 0 ? (
        <p className="text-sm text-body">No recent activity yet.</p>
      ) : (
        <ul className="flex flex-col divide-y divide-heading/10">
          {activity.map((item) => (
            <li key={item.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Users size={16} aria-hidden="true" />
              </span>

              <div className="min-w-0 flex-1">
                <Typography variant="bodySm" color="heading" className="leading-snug">
                  <span className="font-medium">{item.volunteerName}</span> applied to{" "}
                  <span className="font-medium">{item.opportunityTitle}</span>
                </Typography>
                <Typography variant="caption" color="muted">
                  {formatDate(item.date)}
                </Typography>
              </div>

              <ParticipationStatusBadge participation={{ status: item.status }} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}