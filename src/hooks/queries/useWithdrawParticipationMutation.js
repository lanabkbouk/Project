import { useMutation, useQueryClient } from '@tanstack/react-query'
import { withdrawParticipation } from '../../services/participations'
import { queryKeys } from '../../app/queryKeys'

/**
 * ينسحب المتطوع من مشاركة (حذف كامل، مش تغيير حالة — راجع
 * services/participations.js). بعد النجاح نشيلها فورًا من كاش
 * "مشاركاتي" بدل إعادة جلب كاملة.
 */
export function useWithdrawParticipationMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (participationId) => withdrawParticipation(participationId),
    onSuccess: (result, participationId) => {
      if (!result?.success) return

      queryClient.setQueryData(queryKeys.participations.mine, (current) =>
        Array.isArray(current)
          ? current.filter((participation) => participation.id !== participationId)
          : current,
      )
    },
  })
}