import { useQuery } from '@tanstack/react-query'
import { syrianGovernorates } from '../../services/syrianGovernorates'
import { queryKeys } from '../../app/queryKeys'

/**
 * يجلب قائمة المحافظات/المدن — نفس شكل useCategoriesQuery/useSkillsQuery
 * (useQuery حتى تستفيد من نفس الكاش وحالات isPending/isLoading الموحّدة)،
 * رغم إنه المصدر حاليًا مصفوفة محلية مباشرة بدل نداء شبكة فعلي.
 */
export function useCitiesQuery() {
  return useQuery({
    queryKey: queryKeys.cities.all,
    queryFn: () => syrianGovernorates,
  })
}
