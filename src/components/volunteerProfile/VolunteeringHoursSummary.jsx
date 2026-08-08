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
import { Clock3, Building2, CheckCircle2, Compass, Sparkles } from "lucide-react";
import StatCard from "../common/StatCard";
import EmptyState from "../common/EmptyState";
import Skeleton from "../ui/Skeleton";
import Typography from "../ui/Typography";
import { useVolunteerHoursSummaryQuery } from "../../hooks/queries/useVolunteerHoursSummaryQuery";
import { useAuth } from "../../context/AuthContext";
import { ROUTES } from "../../constants/paths";

// أعلى 4 منظمات فقط بالملخّص — التفصيل الكامل موجود بصفحة My Volunteering
const MAX_ORGANIZATIONS_SHOWN = 4;

export default function VolunteeringHoursSummary() {
  const hoursSummaryQuery = useVolunteerHoursSummaryQuery();
  const { user } = useAuth();
  const summary = hoursSummaryQuery.data;
  const loading = hoursSummaryQuery.isPending;
  const hasError = hoursSummaryQuery.isError;

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
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

  // بوابة "لا يوجد شي بعد" لازم تاخد بالحسبان الفرص النشطة كمان (مش
  // بس المكتملة) — وإلا متطوع منضم لفرصة عم تشتغل هلق بس لسا ما خلصت
  // كان رح يشوف "No confirmed hours yet" بدل إحصائية "الفرص النشطة"
  if (summary.completedOpportunitiesCount === 0 && summary.activeOpportunitiesCount === 0) {
    return (
      <EmptyState
        icon={Compass}
        title="No confirmed hours yet"
        description="Once an organization confirms your hours for a completed opportunity, they'll show up here."
      />
    );
  }

  const topOrganizations = summary.byOrganization.slice(0, MAX_ORGANIZATIONS_SHOWN);
  const certificatesCount =
    typeof user?.certificatesCount === "number" && user.certificatesCount > 0 ? user.certificatesCount : null;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          number={summary.totalConfirmedHours}
          label="Confirmed Hours"
          suffix=""
          hint="Hours an organization has confirmed after an opportunity ended."
        />
        <StatCard
          number={summary.organizationsCount}
          label="Organizations"
          suffix=""
          hint="Unique organizations you've volunteered with."
        />
        <StatCard
          number={summary.completedOpportunitiesCount}
          label="Completed Opportunities"
          suffix=""
          hint="Opportunities you fully completed and got hours confirmed for."
        />
        <StatCard
          number={summary.activeOpportunitiesCount}
          label="Active Opportunities"
          suffix=""
          hint="Opportunities you're currently accepted into that are happening right now."
        />
      </div>

      {/* بطاقة "الرحلة التطوعية" — سردية موحّدة، مقصودة تختلف بصريًا عن
          شبكة الإحصائيات فوقها (Stat Cards = أرقام سريعة منفصلة، هاي =
          ملخّص واحد مجمّع) حتى ما يصير تكرار بصري بين القسمين */}
      <div className="flex items-start gap-3 rounded-2xl border border-primary/15 bg-primary/5 p-5">
        <Sparkles size={20} className="text-primary shrink-0 mt-0.5" aria-hidden="true" />
        <p className="text-sm leading-relaxed text-body">
          You've completed <strong className="text-heading">{summary.completedOpportunitiesCount}</strong>{" "}
          opportunit{summary.completedOpportunitiesCount === 1 ? "y" : "ies"}, contributing{" "}
          <strong className="text-heading">{summary.totalConfirmedHours}</strong> confirmed hours across{" "}
          <strong className="text-heading">{summary.organizationsCount}</strong> organization
          {summary.organizationsCount === 1 ? "" : "s"}.
          {certificatesCount !== null && (
            <>
              {" "}
              You've earned <strong className="text-heading">{certificatesCount}</strong> certificate
              {certificatesCount === 1 ? "" : "s"}.
            </>
          )}
        </p>
      </div>

      {topOrganizations.length > 0 && (
        <div>
          <div className="mb-3 flex items-center justify-between gap-3">
            <Typography variant="h5">Hours by organization</Typography>
            <Link
              to={ROUTES.MY_VOLUNTEERING}
              className="text-sm font-medium text-primary hover:underline shrink-0 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              View full history →
            </Link>
          </div>

          <div className="flex flex-col divide-y divide-heading/5 overflow-hidden rounded-xl border border-heading/10 bg-bg/50">
            {topOrganizations.map((organization) => (
              <Link
                key={organization.organizationId}
                to={`${ROUTES.ORGANIZATIONS}/${organization.organizationId}`}
                className="flex items-center justify-between gap-3 px-4 py-3 transition-colors hover:bg-primary/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-inset"
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
      )}
    </div>
  );
}