import { useMutation, useQueryClient } from '@tanstack/react-query'
import { withdrawParticipation } from '../../services/participations'
import { queryKeys } from '../../app/queryKeys'
import { PARTICIPATION_STATUS } from '../../constants/participationStatus'

/**
 * ينسحب المتطوع من مشاركة — تحديث حالة إلى WITHDRAWN (مش حذف كامل،
 * راجع services/participations.js لسبب هذا القرار). المشاركة تبقى
 * ظاهرة بقائمة "مشاركاتي" عند المتطوع نفسه أيضًا (بحالة "Withdrew"،
 * بدون أي زر إجراء متاح عليها بعدها)، بدل ما تختفي بصمت.
 */
export function useWithdrawParticipationMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (participationId) => withdrawParticipation(participationId),
    onSuccess: (result, participationId) => {
      if (!result?.success) return

      queryClient.setQueryData(queryKeys.participations.mine, (current) =>
        Array.isArray(current)
          ? current.map((participation) =>
              participation.id === participationId
                ? {
                    ...participation,
                    status: PARTICIPATION_STATUS.WITHDRAWN,
                    withdrawnDate: new Date().toISOString().slice(0, 10),
                  }
                : participation,
            )
          : current,
      )
    },
  })
}