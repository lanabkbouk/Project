import { useQuery } from '@tanstack/react-query'
import { fetchOpportunitiesByOrganization } from '../../services/opportunities'
import { queryKeys } from '../../app/queryKeys'

/**
 * يجلب الفرص المفتوحة لمنظمة معيّنة — منفصل عن useOrganizationDetailsQuery
 * عمدًا، حتى لو فشل جلب الفرص (أو تأخر) ما يعطّل عرض بيانات المنظمة نفسها.
 * @param {string} organizationId
 */
export function useOrganizationOpportunitiesQuery(organizationId) {
  return useQuery({
    queryKey: queryKeys.organizations.opportunities(organizationId),
    queryFn: () => fetchOpportunitiesByOrganization(organizationId),
    enabled: Boolean(organizationId),
  })
}