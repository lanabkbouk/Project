// components/about/MissionSection.jsx
//
// قسم "رسالتنا" + بطاقة عدد المتطوعين. الرقم يُمرَّر من الصفحة الأب
// (قادم من services/stats.js)، هذا المكوّن لا يجلب بيانات بنفسه.
// الرقم يظهر بعد تصاعدي (useCountUp) كحركة موحّدة مقصودة بالموقع.

import { motion } from "framer-motion";
import { useCountUp } from "../../hooks/useCountUp";

export default function MissionSection({ volunteers }) {
  const { displayValue, elementRef } = useCountUp(volunteers);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="grid md:grid-cols-2 gap-12 items-center mb-16"
    >
      <div>
        <h2 className="text-3xl font-bold mb-4 text-heading">Our Mission</h2>
        <p className="text-body leading-relaxed">
          We believe that every individual has the power to make a positive impact.
          Our mission is to connect volunteers with meaningful opportunities that
          strengthen communities and inspire long‑term change.
        </p>
      </div>

      <div
        ref={elementRef}
        className="bg-heading/5 rounded-2xl p-8 border border-heading/10 text-center"
      >
        <div className="text-6xl font-bold text-primary mb-2">
          {displayValue}+
        </div>
        <p className="text-body">Active Volunteers</p>
      </div>
    </motion.div>
  );
}