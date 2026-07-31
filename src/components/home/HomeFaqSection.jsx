// components/home/HomeFaqSection.jsx
//
// سكشن الأسئلة الشائعة: عنوان + FaqAccordion. البيانات جاية من
// constants/homeContent.js.

import Typography from "../ui/Typography";
import FaqAccordion from "../common/FaqAccordion";
import { HOME_FAQS } from "../../constants/homeContent";

export default function HomeFaqSection() {
  return (
    <section>
      <div className="text-center mb-10">
        <Typography variant="h2" className="mb-2">
          Frequently Asked Questions
        </Typography>
        <Typography variant="body" className="max-w-xl mx-auto">
          Answers to the most common questions from volunteers and organizations.
        </Typography>
      </div>

      <FaqAccordion items={HOME_FAQS} />
    </section>
  );
}