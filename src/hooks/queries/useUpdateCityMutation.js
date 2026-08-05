import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateGovernorate } from '../../services/syrianGovernorates'
import { queryKeys } from '../../app/queryKeys'

/**
 * يعدّل اسم محافظة/مدينة موجودة (أدمن فقط).
 */
export function useUpdateCityMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ cityId, payload }) => updateGovernorate(cityId, payload),
    onSuccess: (result) => {
      if (!result?.success) return
      queryClient.setQueryData(queryKeys.cities.all, (current) =>
        Array.isArray(current)
          ? current.map((city) => (city.id === result.data.id ? result.data : city))
          : current,
      )
    },
  })
}
