import { useQuery } from '@tanstack/react-query'
import { fetchOpportunityById } from '../../services/opportunities'
import { queryKeys } from '../../app/queryKeys'

/**
 * يجلب فرصة واحدة بتفاصيلها الكاملة + قائمة الفرص المشابهة (نفس شكل
 * استجابة fetchOpportunityById الأصلية: { opportunity, similar }).
 * @param {string} id
 */
export function useOpportunityDetailsQuery(id) {
  return useQuery({
    queryKey: queryKeys.opportunities.detail(id),
    queryFn: () => fetchOpportunityById(id),
    // ما في داعي نحاول الجلب أصلًا لو ما وصل id لسا (مثلًا أول render)
    enabled: Boolean(id),
  })
}