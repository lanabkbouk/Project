// pages/dashboard.jsx
//
// داشبورد المنظمة: إحصائيات سريعة + توزيع المتطوعين على الفرص + أحدث
// النشاطات. هالملف مسؤول بس عن الجلب وحالات العرض (تحميل/فارغ/جاهز)
// — كل قسم Component منفصل بمجلد components/dashboard/ مسؤول عن
// عرضه هو بس، بنفس نمط صفحة Home.

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard } from "lucide-react";
import Typography from "../components/ui/Typography";
import Skeleton from "../components/ui/Skeleton";
import EmptyState from "../components/common/EmptyState";
import VerificationStatusBanner from "../components/OrgProfile/VerificationStatusBanner";
import DashboardStatsGrid from "../components/dashboard/DashboardStatsGrid";
import OpportunitiesBreakdownChart from "../components/dashboard/OpportunitiesBreakdownChart";
import RecentActivityFeed from "../components/dashboard/RecentActivityFeed";
import { fetchOrganizationDashboard } from "../services/dashboard";
import { useAuth } from "../context/AuthContext";
import { useOrganizationVerification } from "../hooks/useOrganizationVerification";
import { PANEL_SURFACE, CARD_SURFACE } from "../utils/surfaceStyles";
import { ROUTES } from "../constants/paths";

function DashboardSkeleton() {
  return (
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className={`${CARD_SURFACE} p-8 flex flex-col items-center gap-3`}>
            <Skeleton className="h-9 w-16" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`lg:col-span-2 ${PANEL_SURFACE} p-6 md:p-8 flex flex-col gap-5`}>
          <Skeleton className="h-5 w-48" />
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-8 w-full rounded-lg" />
          ))}
        </div>

        <div className={`${PANEL_SURFACE} p-6 md:p-8 flex flex-col gap-4`}>
          <Skeleton className="h-5 w-32" />
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-10 w-full rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const organizationId = user?.organization?.id ?? user?.organizationId ?? null;
  const { status, isVerified, hasLoadError } = useOrganizationVerification();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    fetchOrganizationDashboard(organizationId).then((result) => {
      if (!isMounted) return;
      if (result.success) {
        setData(result.data);
      } else {
        setError(result.error || "Unable to load dashboard data");
      }
      setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [organizationId]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <VerificationStatusBanner status={status} hasLoadError={hasLoadError} />

      <Typography variant="sectionTitle" className="mb-2">
        Dashboard
      </Typography>
      <Typography variant="body" className="mb-8 text-body">
        An overview of your organization's volunteering activity.
      </Typography>

      {error && (
        <p className="mb-4 rounded-lg border border-danger bg-danger/5 px-3 py-2 text-sm text-danger">
          {error}
        </p>
      )}

      {loading ? (
        <DashboardSkeleton />
      ) : !data || data.totalOpportunities === 0 ? (
        <EmptyState
          icon={LayoutDashboard}
          title="Nothing to show yet"
          description={
            isVerified
              ? "Publish your first volunteering opportunity to start seeing stats and activity here."
              : "Once your organization is verified, you'll be able to publish causes and track activity here."
          }
          actionLabel={isVerified ? "Create Your First Cause" : undefined}
          onAction={isVerified ? () => navigate(ROUTES.CREATE_CAUSE) : undefined}
        />
      ) : (
        <>
          <DashboardStatsGrid data={data} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <OpportunitiesBreakdownChart opportunities={data.opportunitiesBreakdown} />
            </div>

            <RecentActivityFeed activity={data.recentActivity} />
          </div>
        </>
      )}
    </div>
  );
}