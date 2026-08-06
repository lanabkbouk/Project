// components/volunteerProfile/VolunteeringHoursSummary.jsx
//
// ملخّص ثابت لساعات التطوع أعلى بروفايل المتطوع (طبقة "الهوية") — رقم
// تراكمي دائم، بعكس صفحة "My Volunteering" (طبقة "المعاملات") التي
// تعرض كل مشاركة بالتفصيل سطرًا سطرًا. هون بنكتفي بملخّص + أعلى 4
// منظمات، ورابط للصفحة الكاملة بدل تكرار نفس القائمة بمكانين.
//
// كل الأرقام هون تجي من useVolunteerHoursSummaryQuery، يلي بدوره
// مبني فوق buildVolunteerHoursSummary الموحّدة (utils/volunteerHoursSummary.js)
// — نفس مصدر الساعات المستخدم بالضبط بـ achievements.js وبإحصائيات
// "لدى هالمنظمة" عند المنظمات، فأي رقم ظاهر هون متطابق مع أي مكان تاني.

import { Link } from "react-router-dom";
import { Clock3, Building2, CheckCircle2, Compass } from "lucide-react";
import StatCard from "../common/StatCard";
import EmptyState from "../common/EmptyState";
import Skeleton from "../ui/Skeleton";
import Typography from "../ui/Typography";
import { useVolunteerHoursSummaryQuery } from "../../hooks/queries/useVolunteerHoursSummaryQuery";
import { ROUTES } from "../../constants/paths";

// أعلى 4 منظمات فقط بالملخّص — التفصيل الكامل موجود بصفحة My Volunteering
const MAX_ORGANIZATIONS_SHOWN = 4;

export default function VolunteeringHoursSummary() {
  const hoursSummaryQuery = useVolunteerHoursSummaryQuery();
  const summary = hoursSummaryQuery.data;
  const loading = hoursSummaryQuery.isPending;
  const hasError = hoursSummaryQuery.isError;

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-28 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (hasError) {
    return (
      <p className="rounded-lg border border-danger bg-danger/5 px-3 py-2 text-sm text-danger">
        {hoursSummaryQuery.error?.message || "Failed to load your volunteering hours"}
      </p>
    );
  }

  if (summary.completedOpportunitiesCount === 0) {
    return (
      <EmptyState
        icon={Compass}
        title="No confirmed hours yet"
        description="Once an organization confirms your hours for a completed opportunity, they'll show up here."
      />
    );
  }

  const topOrganizations = summary.byOrganization.slice(0, MAX_ORGANIZATIONS_SHOWN);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard number={summary.totalConfirmedHours} label="Confirmed Hours" suffix="" />
        <StatCard number={summary.organizationsCount} label="Organizations" suffix="" />
        <StatCard number={summary.completedOpportunitiesCount} label="Completed Opportunities" suffix="" />
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between gap-3">
          <Typography variant="h5">Hours by organization</Typography>
          <Link
            to={ROUTES.MY_VOLUNTEERING}
            className="text-sm font-medium text-primary hover:underline shrink-0"
          >
            View full history →
          </Link>
        </div>

        <div className="flex flex-col gap-2">
          {topOrganizations.map((organization) => (
            <Link
              key={organization.organizationId}
              to={`${ROUTES.ORGANIZATIONS}/${organization.organizationId}`}
              className="flex items-center justify-between gap-3 rounded-xl border border-heading/10 bg-bg/50 px-4 py-3 hover:border-primary/30 hover:bg-primary/5"
            >
              <span className="flex min-w-0 items-center gap-2 text-sm font-medium text-heading">
                <Building2 size={15} className="text-primary shrink-0" aria-hidden="true" />
                <span className="truncate">{organization.organizationName}</span>
              </span>

              <span className="flex shrink-0 items-center gap-1.5 text-sm text-body">
                <Clock3 size={14} className="text-primary" aria-hidden="true" />
                {organization.confirmedHours} hrs
                <span className="hidden sm:flex items-center gap-1 text-heading/40">
                  <CheckCircle2 size={13} aria-hidden="true" />
                  {organization.completedOpportunitiesCount}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}