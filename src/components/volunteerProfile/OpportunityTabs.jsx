// تبويب بسيط للتبديل بين "كل الفرص" و"الفرص المصنّفة مناسبة إلك"
// (نتيجة خوارزمية المطابقة). Component عرض بحت، ما فيه أي منطق جلب
// بيانات — الصفحة الأب هي يلي بتقرر شو تجيب لما يتغير التبويب النشط.

export const OPPORTUNITY_TABS = {
  ALL: 'all',
  SUGGESTED: 'suggested',
}

export default function OpportunityTabs({ activeTab, onChange }) {
  const tabs = [
    { id: OPPORTUNITY_TABS.ALL, label: 'All Opportunities' },
    { id: OPPORTUNITY_TABS.SUGGESTED, label: 'Suggested for You' },
  ]

  return (
    <div
      role="tablist"
      aria-label="Opportunities view"
      className="inline-flex rounded-2xl bg-heading/5 border border-heading/10 p-1 mb-6"
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={activeTab === tab.id}
          onClick={() => onChange(tab.id)}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
            activeTab === tab.id
              ? 'bg-bg text-primary shadow-sm'
              : 'text-heading/60 hover:text-heading'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}