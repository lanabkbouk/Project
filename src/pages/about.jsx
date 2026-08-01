// pages/about.jsx
//
// صفحة "About": تجلب إحصائيات المنصة عبر usePlatformStatsQuery (React
// Query)، وتمرّرها للمكوّنات. حالات التحميل/الخطأ معالجة بشكل بسيط.

import { usePlatformStatsQuery } from "../hooks/queries/usePlatformStatsQuery";
import { SYRIAN_GOVERNORATES_COUNT } from "../services/syrianGovernorates";
import MissionSection from "../components/about/MissionSection";
import SectionHeader from "../components/about/SectionHeader";
import StatsGrid from "../components/about/StatsGrid";
import ValuesGrid from "../components/about/ValuesGrid";
import VisionGoals from "../components/about/VisionGoals";
import GeometricDivider from "../components/common/GeometricDivider";

export default function About() {
  const statsQuery = usePlatformStatsQuery();
  const isLoading = statsQuery.isPending;
  const stats = statsQuery.data?.success ? statsQuery.data.data : null;

  const statsArray = stats
    ? [
        { number: stats.volunteersCount, label: "Active Volunteers" },
        { number: stats.organizationsCount, label: "Organizations" },
        { number: stats.opportunitiesCount, label: "Opportunities" },
        { number: SYRIAN_GOVERNORATES_COUNT, label: "Governorates Covered" },
      ]
    : [];

  return (
    <div className="min-h-screen bg-bg text-heading px-6 py-16">
      <div className="container mx-auto">
        <SectionHeader />

        <GeometricDivider />

        <MissionSection volunteers={stats?.volunteersCount ?? 0} />

        <GeometricDivider />

        <StatsGrid stats={statsArray} loading={isLoading} />

        <GeometricDivider />

        <ValuesGrid />

        <GeometricDivider />

        <VisionGoals />
      </div>
    </div>
  );
}