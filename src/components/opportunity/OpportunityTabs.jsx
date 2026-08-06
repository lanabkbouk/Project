// components/opportunity/OpportunityTabs.jsx
//
// غلاف رقيق فوق components/ui/Tabs.jsx العام — تبويبات "كل الفرص"
// و"الفرص المصنّفة مناسبة إلك" جاهزة مسبقًا، بنفس الـ API القديم
// بالضبط (activeTab/onChange) حتى ما تحتاج OpportunitiesListPage.jsx
// أي تعديل.

import { Sparkles, LayoutGrid } from "lucide-react";
import Tabs from "../ui/Tabs";

export const OPPORTUNITY_TABS = {
  ALL: 'all',
  SUGGESTED: 'suggested',
}

// LayoutGrid لتبويب التصفح العادي، Sparkles لتبويب المقترح — نفس
// مستوى التفصيل البصري بين التبويبين، ما في وحدة "ناقصة" أيقونة
const TABS = [
  { id: OPPORTUNITY_TABS.ALL, label: 'All Opportunities', icon: LayoutGrid },
  { id: OPPORTUNITY_TABS.SUGGESTED, label: 'Recommended for You', icon: Sparkles },
]

export default function OpportunityTabs({ activeTab, onChange }) {
  return <Tabs tabs={TABS} activeTab={activeTab} onChange={onChange} ariaLabel="Opportunities view" />
}