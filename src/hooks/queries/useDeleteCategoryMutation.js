import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteCategory } from '../../services/categories'
import { queryKeys } from '../../app/queryKeys'

/**
 * يحذف تصنيفًا (أدمن فقط). بعد النجاح نشيله فورًا من كاش القائمة.
 */
export function useDeleteCategoryMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: (result, categoryId) => {
      if (!result?.success) return

      queryClient.setQueryData(queryKeys.categories.all, (current) =>
        Array.isArray(current) ? current.filter((category) => category.id !== categoryId) : current,
      )
    },
  })
}