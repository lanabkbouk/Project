import { useQuery } from '@tanstack/react-query'
import { fetchMyOpportunities } from '../../services/opportunities'
import { queryKeys } from '../../app/queryKeys'

/**
 * يجلب الفرص المنشورة من طرف المنظمة الحالية (صفحة "My Causes").
 */
export function useMyOpportunitiesQuery() {
  return useQuery({
    queryKey: queryKeys.opportunities.mine,
    queryFn: fetchMyOpportunities,
  })
}