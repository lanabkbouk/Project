export default function MissionSection({ volunteers }) {
  return (
    <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
      <div>
        <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
        <p className="text-gray-300 leading-relaxed">
          We believe that every individual has the power to make a positive impact...
        </p>
      </div>

      <div className="bg-[#1A1A1A] rounded-2xl p-8 border border-white/10">
        <div className="text-6xl font-bold text-[#FD7E14] mb-2">
          {volunteers}+
        </div>
        <p className="text-gray-400">Active Volunteers</p>
      </div>
    </div>
  );
}
