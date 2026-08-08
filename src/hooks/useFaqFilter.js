import { useMemo, useState } from "react";
import { useDebouncedValue } from "./useDebouncedValue";

export const FAQ_CATEGORY_ALL = "all";

/**
 * منطق فلترة الأسئلة الشائعة (فئة + بحث) معزول بالكامل عن العرض —
 * الفلترة نفسها فورية على العميل، وبتشتغل الاثنتان سوا (AND): تغيير
 * الفئة ما بيصفّر نص البحث، والعكس صحيح.
 * @param {Array<{question:string, category:string}>} items
 */
export function useFaqFilter(items = []) {
  const [activeCategory, setActiveCategory] = useState(FAQ_CATEGORY_ALL);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebouncedValue(searchTerm);

  const filteredItems = useMemo(() => {
    const normalizedSearch = debouncedSearchTerm.trim().toLowerCase();

    return items.filter((item) => {
      const matchesCategory = activeCategory === FAQ_CATEGORY_ALL || item.category === activeCategory;
      const matchesSearch = !normalizedSearch || item.question.toLowerCase().includes(normalizedSearch);
      return matchesCategory && matchesSearch;
    });
  }, [items, activeCategory, debouncedSearchTerm]);

  return { activeCategory, setActiveCategory, searchTerm, setSearchTerm, filteredItems };
}
