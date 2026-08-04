import { useQuery } from '@tanstack/react-query'
import { fetchPendingOrganizations } from '../../services/admin'
import { queryKeys } from '../../app/queryKeys'

/**
 * يجلب قائمة المنظمات بانتظار مراجعة توثيق الأدمن.
 */
export function usePendingOrganizationsQuery() {
  return useQuery({
    queryKey: queryKeys.admin.pendingOrganizations,
    queryFn: fetchPendingOrganizations,
  })
}