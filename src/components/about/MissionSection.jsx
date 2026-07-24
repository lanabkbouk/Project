import { motion } from "framer-motion";

export default function MissionSection({ volunteers }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="grid md:grid-cols-2 gap-12 items-center mb-16"
    >
      <div>
        <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
        <p className="text-gray-300 leading-relaxed">
          We believe that every individual has the power to make a positive impact.
          Our mission is to connect volunteers with meaningful opportunities that
          strengthen communities and inspire long‑term change.
        </p>
      </div>

      <div className="backdrop-blur-md bg-white/5 rounded-2xl p-8 border border-white/10 text-center">
        <div className="text-6xl font-bold text-[#FD7E14] drop-shadow-[0_0_10px_rgba(253,126,20,0.5)] mb-2">
          {volunteers}+
        </div>
        <p className="text-gray-400">Active Volunteers</p>
      </div>
    </motion.div>
  );
}
