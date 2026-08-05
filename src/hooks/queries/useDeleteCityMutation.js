import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteGovernorate } from '../../services/syrianGovernorates'
import { queryKeys } from '../../app/queryKeys'

/**
 * يحذف محافظة/مدينة (أدمن فقط).
 */
export function useDeleteCityMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteGovernorate,
    onSuccess: (result, cityId) => {
      if (!result?.success) return
      queryClient.setQueryData(queryKeys.cities.all, (current) =>
        Array.isArray(current) ? current.filter((city) => city.id !== cityId) : current,
      )
    },
  })
}
