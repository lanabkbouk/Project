// components/about/VisionGoals.jsx
//
// قسم "رؤيتنا وأهدافنا" — مكوّن جديد (مو موجود بالمشروع سابقًا)،
// بيانات ثابتة تسويقية (مو من الباك اند)، بنفس ثيم بقية أقسام الصفحة.

import { motion } from "framer-motion";

const GOALS = [
  "Expand volunteer opportunities across diverse sectors.",
  "Strengthen partnerships with organizations.",
  "Provide transparent tracking of contributions.",
  "Encourage youth engagement and community initiatives.",
];

export default function VisionGoals() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="mb-20"
    >
      <h2 className="text-3xl font-bold mb-8 text-center text-heading">Our Vision & Goals</h2>

      <div className="grid md:grid-cols-2 gap-10">
        <div className="rounded-2xl bg-heading/5 border border-heading/10 p-8">
          <h3 className="text-2xl font-bold text-primary mb-4">Our Vision</h3>
          <p className="text-body leading-relaxed">
            To create a world where volunteering is accessible, impactful, and deeply
            connected to the needs of every community.
          </p>
        </div>

        <div className="rounded-2xl bg-heading/5 border border-heading/10 p-8">
          <h3 className="text-2xl font-bold text-primary mb-4">Our Goals</h3>
          <ul className="space-y-3 text-body">
            {GOALS.map((goal) => (
              <li key={goal} className="flex items-start gap-3">
                <span className="text-primary text-xl leading-none">•</span>
                {goal}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}