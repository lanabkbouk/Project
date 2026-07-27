// pages/about.jsx
//
// صفحة "About": تجلب إحصائيات المنصة من services/stats.js (لا أرقام
// ثابتة هون)، وتمرّرها للمكوّنات. حالات التحميل/الخطأ معالجة بشكل بسيط.

import { useEffect, useState } from "react";
import { fetchPlatformStats } from "../services/stats";
import { SYRIAN_GOVERNORATES_COUNT } from "../services/syrianGovernorates";
import MissionSection from "../components/about/MissionSection";
import SectionHeader from "../components/about/SectionHeader";
import StatsGrid from "../components/about/StatsGrid";
import ValuesGrid from "../components/about/ValuesGrid";
import VisionGoals from "../components/about/VisionGoals";
import GeometricDivider from "../components/common/GeometricDivider";
import LoadingSpinner from "../components/common/LoadingSpinner";

export default function About() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    fetchPlatformStats().then((result) => {
      if (!isMounted) return;
      if (result.success) setStats(result.data);
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, []);

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

        {isLoading ? (
          <LoadingSpinner message="Loading stats..." />
        ) : (
          <StatsGrid stats={statsArray} />
        )}

        <GeometricDivider />

        <ValuesGrid />

        <GeometricDivider />

        <VisionGoals />
      </div>
    </div>
  );
}