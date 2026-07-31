
// شبكة الإحصائيات (متطوعين/منظمات/فرص...). البيانات تجي كـ prop "stats"
// من الصفحة الأب. البطاقة نفسها (StatCard) صارت بـ components/common
// لأنها تُستخدم هون وبصفحة Home كمان.

import { motion } from "framer-motion";
import StatCard from "../common/StatCard";

export default function StatsGrid({ stats }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24"
    >
      {stats.map((stat) => (
        <StatCard key={stat.label} number={stat.number} label={stat.label} />
      ))}
    </motion.div>
  );
}