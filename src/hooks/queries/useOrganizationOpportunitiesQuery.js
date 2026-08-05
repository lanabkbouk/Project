import { useQuery } from '@tanstack/react-query'
import { fetchOpportunitiesByOrganization } from '../../services/opportunities'
import { queryKeys } from '../../app/queryKeys'

/**
 * يجلب كل فرص منظمة معيّنة (كل الحالات) — منفصل عن useOrganizationDetailsQuery
 * عمدًا، حتى لو فشل جلب الفرص (أو تأخر) ما يعطّل عرض بيانات المنظمة نفسها.
 * الصفحة (OrganizationDetailsPage.jsx) هي يلي بتقسمهم لـ Open Now/Past.
 * @param {string} organizationId
 */
export function useOrganizationOpportunitiesQuery(organizationId) {
  return useQuery({
    queryKey: queryKeys.organizations.opportunities(organizationId),
    queryFn: () => fetchOpportunitiesByOrganization(organizationId),
    enabled: Boolean(organizationId),
  })
}