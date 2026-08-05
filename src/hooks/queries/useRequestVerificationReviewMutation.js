import { useMutation, useQueryClient } from '@tanstack/react-query'
import { requestVerificationReview } from '../../services/organization'
import { queryKeys } from '../../app/queryKeys'
import { ORGANIZATION_STATUS } from '../../constants/organizationStatus'

/**
 * تطلب المنظمة إعادة مراجعة توثيقها بعد الرفض (بنفس الوثيقة الأصلية —
 * راجع services/organization.js لتوضيح ليش ما فيه رفع ملف جديد). بعد
 * النجاح، نحدّث كاش بروفايل المنظمة مباشرة (status → pending) بدل
 * إعادة جلب كاملة، حتى الـ Banner ينعكس فورًا بكل الصفحات المشتركة.
 */
export function useRequestVerificationReviewMutation(organizationId) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => requestVerificationReview(organizationId),
    onSuccess: (result) => {
      if (!result?.success) return

      queryClient.setQueryData(queryKeys.organization.profile(organizationId), (current) =>
        current?.success
          ? { success: true, data: { ...current.data, status: ORGANIZATION_STATUS.PENDING, rejectionReason: '' } }
          : current,
      )
    },
  })
}