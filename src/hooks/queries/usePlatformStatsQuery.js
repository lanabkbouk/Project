import { useQuery } from '@tanstack/react-query'
import { fetchPlatformStats } from '../../services/stats'
import { queryKeys } from '../../app/queryKeys'

/**
 * إحصائيات المنصة لصفحة About. الخدمة بترجع { success, data/error }
 * دايمًا بدون رمي استثناء، فمنطق التحقق يضل بمسؤولية الصفحة.
 */
export function usePlatformStatsQuery() {
  return useQuery({
    queryKey: queryKeys.stats.platform,
    queryFn: fetchPlatformStats,
  })
}