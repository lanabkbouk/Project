import { useQuery } from '@tanstack/react-query'
import { fetchOrganizations } from '../../services/organizations'
import { queryKeys } from '../../app/queryKeys'

/**
 * يجلب قائمة المنظمات الموثّقة (فلترة status تصير داخل الـ service نفسه).
 * @param {{search?: string}} filters
 */
export function useOrganizationsQuery({ search = '' } = {}) {
  return useQuery({
    queryKey: queryKeys.organizations.list({ search }),
    queryFn: () => fetchOrganizations({ search }),
    // يبقي نتائج البحث السابقة ظاهرة أثناء كتابة حرف جديد، بدل فلاش
    // شاشة تحميل فاضية مع كل ضغطة (نفس نمط useOpportunitiesQuery)
    placeholderData: (previousData) => previousData,
  })
}