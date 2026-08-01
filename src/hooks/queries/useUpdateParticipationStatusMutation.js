import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateParticipationStatus } from '../../services/participations'
import { queryKeys } from '../../app/queryKeys'

/**
 * يقبل/يرفض طلب متقدّم على فرصة معيّنة. بعد النجاح، نحدّث حالته مباشرة
 * بكاش قائمة المتقدّمين (بدون إعادة جلب كاملة)، ونبطّل صفحة "My
 * Volunteering" الخاصة فيه لو كانت مفتوحة بمكان تاني.
 * @param {string} opportunityId
 */
export function useUpdateParticipationStatusMutation(opportunityId) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ applicantId, status }) => updateParticipationStatus(applicantId, status),
    onSuccess: (result, { applicantId, status }) => {
      if (!result?.success) return

      queryClient.setQueryData(
        queryKeys.participations.applicants(opportunityId),
        (current) =>
          Array.isArray(current)
            ? current.map((applicant) =>
                applicant.id === applicantId ? { ...applicant, status } : applicant,
              )
            : current,
      )

      queryClient.invalidateQueries({ queryKey: queryKeys.participations.mine })
    },
  })
}