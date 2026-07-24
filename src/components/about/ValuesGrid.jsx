import { motion } from "framer-motion";

const values = [
  { title: "Community", desc: "Building stronger communities through collective action" },
  { title: "Transparency", desc: "Open communication and clear impact tracking" },
  { title: "Inclusion", desc: "Everyone has something to contribute" },
];

export default function ValuesGrid() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
    >
      <h2 className="text-3xl font-bold mb-8 text-center">Our Values</h2>

      <div className="grid md:grid-cols-3 gap-6">
        {values.map((value, index) => (
          <div
            key={index}
            className="bg-[#1A1A1A] rounded-xl p-6 border border-white/10 hover:border-[#FD7E14] transition-colors"
          >
            <h3 className="text-xl font-bold text-[#FD7E14] mb-3">{value.title}</h3>
            <p className="text-gray-400">{value.desc}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
