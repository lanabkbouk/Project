import { useQuery } from '@tanstack/react-query'
import { fetchAdminOrganizations } from '../../services/admin'
import { queryKeys } from '../../app/queryKeys'

export function useAdminOrganizationsQuery() {
  return useQuery({
    queryKey: queryKeys.admin.organizations,
    queryFn: fetchAdminOrganizations,
  })
}