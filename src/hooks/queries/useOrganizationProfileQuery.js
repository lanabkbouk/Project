import { useQuery } from '@tanstack/react-query'
import { fetchOrganizationProfile } from '../../services/organization'
import { queryKeys } from '../../app/queryKeys'

/**
 * يجلب بروفايل المنظمة المسجّلة دخولها حاليًا. الخدمة نفسها ما بترمي
 * استثناء عند الفشل (بترجع { success: false, error } بدل throw)، فمنطق
 * التحقق من success يضل بمسؤولية الصفحة نفسها (نفس ما كان قبل React Query).
 */
export function useOrganizationProfileQuery() {
  return useQuery({
    queryKey: queryKeys.organization.profile,
    queryFn: fetchOrganizationProfile,
  })
}