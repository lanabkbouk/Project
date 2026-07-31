// pages/home.jsx
//
// الصفحة الرئيسية: مسؤولة بس عن جلب البيانات (إحصائيات + فرص مكتملة)
// وتمريرها للكومبوننتات بمجلد components/home/. كل سكشن Component
// منفصل ومسؤول عن عرضه هو بس — هالملف ما فيه أي JSX تصميمي مباشر.

import { useEffect, useState } from "react";
import GeometricDivider from "../components/common/GeometricDivider";
import HomeHero from "../components/home/HomeHero";
import HomeStatsSection from "../components/home/HomeStatsSection";
import HomePartners from "../components/home/HomePartners";
import HomeSuccessStories from "../components/home/HomeSuccessStories";
import HomeHowToJoin from "../components/home/HomeHowToJoin";
import HomeFaqSection from "../components/home/HomeFaqSection";
import { fetchPlatformStats } from "../services/stats";
import { fetchCompletedOpportunities } from "../services/opportunities";

export default function Home() {
  const [stats, setStats] = useState(null);
  const [completedOpportunities, setCompletedOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadHomeData() {
      const [statsResult, completedData] = await Promise.all([
        fetchPlatformStats(),
        fetchCompletedOpportunities().catch(() => []),
      ]);

      if (!isMounted) return;
      if (statsResult.success) setStats(statsResult.data);
      setCompletedOpportunities(completedData);
      setLoading(false);
    }

    loadHomeData();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="bg-bg text-heading">
      <HomeHero volunteersCount={stats?.volunteersCount} loading={loading} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
        <HomeStatsSection stats={stats} loading={loading} />

        <GeometricDivider />

        <HomeSuccessStories opportunities={completedOpportunities} loading={loading} />

        <GeometricDivider />

        {!loading ? <HomePartners opportunities={completedOpportunities} /> : null}

        <GeometricDivider />

        <HomeHowToJoin />

        <GeometricDivider />

        <HomeFaqSection />
      </div>
    </div>
  );
}