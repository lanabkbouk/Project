// components/opportunity/OpportunityTabs.jsx
//
// تبويب بسيط للتبديل بين "كل الفرص" و"الفرص المصنّفة مناسبة إلك"
// (نتيجة خوارزمية المطابقة). Component عرض بحت، ما فيه أي منطق جلب
// بيانات — الصفحة الأب هي يلي بتقرر شو تجيب لما يتغير التبويب النشط.

import { Sparkles, LayoutGrid } from "lucide-react";

export const OPPORTUNITY_TABS = {
  ALL: 'all',
  SUGGESTED: 'suggested',
}

export default function OpportunityTabs({ activeTab, onChange }) {
  const tabs = [
    // LayoutGrid لتبويب التصفح العادي، Sparkles لتبويب المقترح — نفس
    // مستوى التفصيل البصري بين التبويبين، ما في وحدة "ناقصة" أيقونة
    { id: OPPORTUNITY_TABS.ALL, label: 'All Opportunities', icon: LayoutGrid },
    { id: OPPORTUNITY_TABS.SUGGESTED, label: 'Recommended for You', icon: Sparkles },
  ]

  return (
    <div
      role="tablist"
      aria-label="Opportunities view"
      className="inline-flex rounded-2xl bg-heading/5 border border-heading/10 p-1 mb-6"
    >
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = activeTab === tab.id

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              isActive
                ? 'bg-field text-primary shadow-sm'
                : 'text-heading/60 hover:text-heading'
            }`}
          >
            {Icon ? <Icon size={15} className={isActive ? 'text-primary' : ''} /> : null}
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}