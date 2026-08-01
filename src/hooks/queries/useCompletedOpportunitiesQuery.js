import { useQuery } from '@tanstack/react-query'
import { fetchCompletedOpportunities } from '../../services/opportunities'
import { queryKeys } from '../../app/queryKeys'

/**
 * الفرص المكتملة بنجاح — تُستخدم بسكشن "Success Stories" والشركاء
 * بالصفحة الرئيسية. الخدمة نفسها بترمي استثناء عند الفشل، فـ React Query
 * بيتكفّل فيه تلقائيًا (query.isError) بدل try/catch يدوي بالصفحة.
 */
export function useCompletedOpportunitiesQuery() {
  return useQuery({
    queryKey: queryKeys.opportunities.completed,
    queryFn: fetchCompletedOpportunities,
  })
}