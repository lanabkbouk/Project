import { useMutation, useQueryClient } from '@tanstack/react-query'
import { participateInOpportunity } from '../../services/opportunities'
import { queryKeys } from '../../app/queryKeys'

/**
 * تسجيل مشاركة المتطوع بفرصة. بعد النجاح، نبطّل (invalidate) كل الاستعلامات
 * المرتبطة بالفرص — تفاصيل هالفرصة بالذات، وقوائم التصفح/الاقتراح العامة —
 * عشان عدد المتطوعين المحدّث ينعكس فورًا بأي صفحة تانية مفتوحة عليها،
 * بدل ما نحدّث الحالة المحلية يدويًا بمكان وحيد بس.
 * @param {string} id
 */
export function useParticipateMutation(id) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (committedHours) => participateInOpportunity(id, committedHours),
    onSuccess: (result) => {
      if (!result?.success) return

      // تبطيل المفتاح الجذر ['opportunities'] كافي وحده لأنه بيشمل كل
      // الفروع تلقائيًا (list/suggested/detail) — ما في داعي نبطّلهم
      // وحدة وحدة
      queryClient.invalidateQueries({ queryKey: queryKeys.opportunities.all })
    },
  })
}