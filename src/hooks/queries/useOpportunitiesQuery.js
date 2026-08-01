import { useQuery } from '@tanstack/react-query'
import { fetchOpportunities, fetchSuggestedOpportunities } from '../../services/opportunities'
import { calculateAge } from '../../utils/validators'
import { queryKeys } from '../../app/queryKeys'

/**
 * هوك موحّد لجلب الفرص، بيقرر لحاله أي endpoint يستخدم حسب isSuggestedTab:
 * - التبويب المقترح: fetchSuggestedOpportunities (حسب مهارات/عمر/مدينة المتطوع)
 * - غير هيك: fetchOpportunities (حسب البحث والتصنيف)
 *
 * كل حالة إلها queryKey مختلف، فـ React Query بيفصل الـ cache تلقائيًا
 * بينهم (تبديل التبويب ما بيلخبط نتائج التصفح العادي، والعكس صحيح).
 *
 * @param {{isSuggestedTab: boolean, search?: string, categoryId?: string, user?: object}} params
 */
export function useOpportunitiesQuery({ isSuggestedTab, search = '', categoryId = '', user } = {}) {
  const suggestedParams = {
    skillIds: Array.isArray(user?.skillIds) ? user.skillIds : [],
    age: calculateAge(user?.dateOfBirth),
    city: user?.city || '',
  }

  return useQuery({
    queryKey: isSuggestedTab
      ? queryKeys.opportunities.suggested(suggestedParams)
      : queryKeys.opportunities.list({ search, categoryId }),
    queryFn: () =>
      isSuggestedTab
        ? fetchSuggestedOpportunities(suggestedParams)
        : fetchOpportunities({ search, categoryId }),
    // يخلي نتائج البحث/الفلتر السابقة ظاهرة أثناء تحميل الفلتر الجديد
    // (بدل فلاش شاشة تحميل فاضية مع كل ضغطة مفتاح أو تبديل تصنيف)
    placeholderData: (previousData) => previousData,
  })
}