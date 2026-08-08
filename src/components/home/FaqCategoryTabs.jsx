// غلاف رقيق فوق components/ui/Tabs.jsx العام — بس عمدًا عام (categories
// جايي كـ prop، مش أسئلة شائعة مكتوبة جوا الملف) حتى يصير قابل لإعادة
// الاستخدام بأي قسم تاني بالمشروع يحتاج تبويبات فئات لاحقًا، بدون أي
// تعديل هون.

import Tabs from "../ui/Tabs";
import { FAQ_CATEGORY_ALL } from "../../hooks/useFaqFilter";

/**
 * @param {Array<{id:string, label:string, icon?:Function}>} categories
 * @param {string} activeCategory
 * @param {(categoryId:string)=>void} onChange
 */
export default function FaqCategoryTabs({ categories, activeCategory, onChange }) {
  const tabs = [{ id: FAQ_CATEGORY_ALL, label: "All" }, ...categories];

  return <Tabs tabs={tabs} activeTab={activeCategory} onChange={onChange} ariaLabel="FAQ category filter" />;
}
