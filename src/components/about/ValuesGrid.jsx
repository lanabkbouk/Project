
import { motion } from "framer-motion";

const VALUES = [
  { title: "Community", desc: "Building stronger communities through collective action" },
  { title: "Transparency", desc: "Open communication and clear impact tracking" },
  { title: "Inclusion", desc: "Everyone has something to contribute" },
];

export default function ValuesGrid() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="mb-20"
    >
      <h2 className="text-3xl font-bold mb-8 text-center text-heading">Our Values</h2>

      <div className="grid md:grid-cols-3 gap-6">
        {VALUES.map((value) => (
          <div
            key={value.title}
            className="bg-heading/5 rounded-xl p-6 border border-heading/10 hover:border-primary transition-colors"
          >
            <h3 className="text-xl font-bold text-primary mb-3">{value.title}</h3>
            <p className="text-body">{value.desc}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}