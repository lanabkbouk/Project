import { useQuery } from '@tanstack/react-query'
import { fetchApplicantsForOpportunity } from '../../services/participations'
import { queryKeys } from '../../app/queryKeys'

/**
 * يجلب المتقدّمين على فرصة معيّنة (صفحة "قائمة المتقدّمين" عند المنظمة).
 * @param {string} opportunityId
 */
export function useApplicantsQuery(opportunityId) {
  return useQuery({
    queryKey: queryKeys.participations.applicants(opportunityId),
    queryFn: () => fetchApplicantsForOpportunity(opportunityId),
    enabled: Boolean(opportunityId),
  })
}