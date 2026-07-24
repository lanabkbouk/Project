import { motion } from "framer-motion";

export default function StatsGrid({ stats }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
    >
      {stats.map((stat, index) => (
        <div
          key={index}
          className="backdrop-blur-md bg-white/5 rounded-xl p-6 text-center border border-white/10 hover:border-[#FD7E14] transition-colors"
        >
          <div className="text-3xl font-bold text-[#FD7E14] drop-shadow-[0_0_10px_rgba(253,126,20,0.5)] mb-2">
            {stat.number}+
          </div>
          <p className="text-gray-400 text-sm">{stat.label}</p>
        </div>
      ))}
    </motion.div>
  );
}
