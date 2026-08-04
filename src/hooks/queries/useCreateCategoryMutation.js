import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createCategory } from '../../services/categories'
import { queryKeys } from '../../app/queryKeys'

/**
 * ينشئ تصنيفًا جديدًا (أدمن فقط). بعد النجاح نضيفه مباشرة لكاش قائمة
 * التصنيفات بدل إعادة جلب كاملة — نفس منطق التحديث المتفائل المستخدم
 * بباقي الـ mutations بالمشروع.
 */
export function useCreateCategoryMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createCategory,
    onSuccess: (result) => {
      if (!result?.success) return

      queryClient.setQueryData(queryKeys.categories.all, (current) =>
        Array.isArray(current) ? [...current, result.data] : [result.data],
      )
    },
  })
}