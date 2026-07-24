import { motion } from "framer-motion";

export default function VisionGoals() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="mb-20"
    >
      <h2 className="text-3xl font-bold text-center mb-8 ">Our Vision & Goals</h2>

      <div className="grid md:grid-cols-2 gap-10">

        <div className="relative overflow-hidden rounded-2xl backdrop-blur-md bg-white/5 border border-white/10 p-8">
          <h3 className="text-2xl font-bold text-[#FD7E14] drop-shadow-[0_0_10px_rgba(253,126,20,0.5)] mb-4">
            Our Vision
          </h3>
          <p className="text-gray-300 leading-relaxed">
            To create a world where volunteering is accessible, impactful, and deeply
            connected to the needs of every community.
          </p>
        </div>

        <div className="relative overflow-hidden rounded-2xl backdrop-blur-md bg-white/5 border border-white/10 p-8">
          <h3 className="text-2xl font-bold text-[#FD7E14] drop-shadow-[0_0_10px_rgba(253,126,20,0.5)] mb-4">
            Our Goals
          </h3>

          <ul className="space-y-3 text-gray-300">
            <li className="flex items-start gap-3">
              <span className="text-[#FD7E14] text-xl">•</span>
              Expand volunteer opportunities across more cities.
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#FD7E14] text-xl">•</span>
              Strengthen partnerships with organizations.
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#FD7E14] text-xl">•</span>
              Provide transparent tracking of contributions.
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#FD7E14] text-xl">•</span>
              Encourage youth engagement and community initiatives.
            </li>
          </ul>
        </div>

      </div>
    </motion.div>
  );
}
