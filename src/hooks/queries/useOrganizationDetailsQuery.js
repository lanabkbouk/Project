import { useQuery } from '@tanstack/react-query'
import { fetchOrganizationById } from '../../services/organizations'
import { queryKeys } from '../../app/queryKeys'

/**
 * يجلب منظمة واحدة بتفاصيلها الكاملة عبر id.
 * @param {string} id
 */
export function useOrganizationDetailsQuery(id) {
  return useQuery({
    queryKey: queryKeys.organizations.detail(id),
    queryFn: () => fetchOrganizationById(id),
    enabled: Boolean(id),
  })
}