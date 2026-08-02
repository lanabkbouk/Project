import { useQuery } from '@tanstack/react-query'
import { fetchMyOpportunities } from '../../services/opportunities'
import { queryKeys } from '../../app/queryKeys'

/**
 * يجلب الفرص المنشورة من طرف المنظمة الحالية (صفحة "My Causes").
 * @param {string} organizationId - هوية المنظمة الحالية (من AuthContext)
 */
export function useMyOpportunitiesQuery(organizationId) {
  return useQuery({
    queryKey: queryKeys.opportunities.mine(organizationId),
    queryFn: () => fetchMyOpportunities(organizationId),
    enabled: Boolean(organizationId),
  })
}