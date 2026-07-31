// components/dashboard/DashboardStatsGrid.jsx
//
// أربع بطاقات إحصائيات لداشبورد المنظمة، بتعيد استخدام StatCard
// الموحّد أصلًا بالمشروع (نفس البطاقة المستخدمة بصفحتي Home وAbout)
// بدل إنشاء بطاقة جديدة تؤدي نفس الوظيفة.

import StatCard from "../common/StatCard";

export default function DashboardStatsGrid({ data }) {
  const stats = [
    { number: data.totalVolunteers, label: "Total Volunteers" },
    { number: data.totalOpportunities, label: "Published Opportunities" },
    { number: data.pendingRequests, label: "New Requests" },
    { number: data.completionRate, label: "Completion Rate", suffix: "%" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => (
        <StatCard key={stat.label} number={stat.number} label={stat.label} suffix={stat.suffix} />
      ))}
    </div>
  );
}