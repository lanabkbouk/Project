export default function StatsGrid({ stats }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
      {stats.map((stat, index) => (
        <div key={index} className="bg-[#1A1A1A] rounded-xl p-6 text-center border border-white/10">
          <div className="text-3xl font-bold text-[#FD7E14] mb-2">
            {stat.number}+
          </div>
          <p className="text-gray-400 text-sm">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
