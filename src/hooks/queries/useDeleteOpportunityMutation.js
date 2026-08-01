import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteOpportunity } from '../../services/opportunities'
import { queryKeys } from '../../app/queryKeys'

/**
 * حذف فرصة (من طرف المنظمة). بعد النجاح: نشيلها فورًا من كاش "My Causes"
 * (بدل انتظار إعادة جلب كاملة، عشان تجربة إزالة فورية زي القديمة تمامًا)،
 * ونبطّل باقي قوائم الفرص (تصفح عام/مقترح/تفاصيل) عشان تنعكس بالمرة الجاية.
 */
export function useDeleteOpportunityMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteOpportunity,
    onSuccess: (result, id) => {
      if (!result?.success) return

      queryClient.setQueryData(queryKeys.opportunities.mine, (current) =>
        Array.isArray(current) ? current.filter((opportunity) => opportunity.id !== id) : current,
      )

      // نبطّل المفتاح الجذر بدل كل فرع لحاله — نفس الفكرة المستخدمة
      // بـ useParticipateMutation، بيشمل list/suggested/detail تلقائيًا
      queryClient.invalidateQueries({ queryKey: queryKeys.opportunities.all })
    },
  })
}