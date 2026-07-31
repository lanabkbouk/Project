
// أكورديون أسئلة شائعة: سؤال واحد مفتوح بأي وقت. Component عرض بحت،
// البيانات (items) جاية من الصفحة الأب — قابل لإعادة الاستخدام بأي
// صفحة تانية تحتاج قسم أسئلة شائعة (مثلًا About) بدون أي تعديل هون.

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FaqAccordion({ items }) {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="flex flex-col gap-3 max-w-3xl mx-auto">
      {items.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          <div
            key={item.question}
            className="rounded-2xl border border-heading/10 bg-field overflow-hidden"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
              className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left"
            >
              <span className="font-medium text-heading">{item.question}</span>
              <ChevronDown
                size={18}
                className={`text-primary shrink-0 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
                aria-hidden="true"
              />
            </button>

            <div
              className={`grid transition-all duration-200 ease-in-out ${
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <p className="px-6 pb-4 text-sm text-body leading-relaxed">{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}