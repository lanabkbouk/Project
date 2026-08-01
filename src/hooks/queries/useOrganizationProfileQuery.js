import { useQuery } from '@tanstack/react-query'
import { fetchOrganizationProfile } from '../../services/organization'
import { queryKeys } from '../../app/queryKeys'

/**
 * يجلب بروفايل المنظمة المسجّلة دخولها حاليًا. المفتاح لازم يرتبط
 * بمعرّف المنظمة نفسه حتى ما يصير cache collision بين أكثر من منظمة أو
 * بين جلسة فيها منظمة وأخرى بدونها.
 */
export function useOrganizationProfileQuery(organizationId) {
  return useQuery({
    queryKey: queryKeys.organization.profile(organizationId),
    queryFn: () => fetchOrganizationProfile(organizationId),
    enabled: Boolean(organizationId),
  })
}