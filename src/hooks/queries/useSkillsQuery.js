import { useQuery } from '@tanstack/react-query'
import { fetchAvailableSkills } from '../../services/skills'
import { queryKeys } from '../../app/queryKeys'

/**
 * يجلب كل المهارات المتاحة (مع تصنيفها) — تُستخدم بفورم بروفايل المتطوع
 * وبمعاينة البروفايل (Preview) سوا، وبفضل الكاش المشترك ما بتنجلب إلا مرة
 * وحدة حتى لو استُخدم الهوك بأكثر من مكان بنفس الصفحة.
 */
export function useSkillsQuery() {
  return useQuery({
    queryKey: queryKeys.skills.all,
    queryFn: fetchAvailableSkills,
  })
}