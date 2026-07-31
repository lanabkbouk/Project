
// سكشن "إحصائيات سريعة": يضيف عدد المحافظات (SYRIAN_GOVERNORATES_COUNT)
// جنب إحصائيات الباك (متطوعين/منظمات/فرص) — نفس مصدر البيانات المستخدم
// أصلًا بصفحة About، بدون تكرار الرقم بمكان تاني.

import StatsGrid from "../about/StatsGrid";
import LoadingSpinner from "../common/LoadingSpinner";
import { SYRIAN_GOVERNORATES_COUNT } from "../../services/syrianGovernorates";

export default function HomeStatsSection({ stats, loading }) {
  if (loading) {
    return <LoadingSpinner message="Loading platform stats..." />;
  }

  if (!stats) return null;

  const statsArray = [
    { number: stats.volunteersCount, label: "Active Volunteers" },
    { number: stats.organizationsCount, label: "Organizations" },
    { number: stats.opportunitiesCount, label: "Opportunities" },
    { number: SYRIAN_GOVERNORATES_COUNT, label: "Governorates Covered" },
  ];

  return <StatsGrid stats={statsArray} />;
}