import { useQuery } from '@tanstack/react-query'
import { fetchCategories } from '../../services/categories'
import { queryKeys } from '../../app/queryKeys'

/**
 * التصنيفات مساعدة ثانوية للفلترة فقط، مو بيانات حرجة — لو فشل الجلب
 * ما نعرض رسالة خطأ للمستخدم، منرجع مصفوفة فاضية وبس (نفس السلوك القديم).
 */
export function useCategoriesQuery() {
  return useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: fetchCategories,
  })
}