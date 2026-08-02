import { useMutation, useQueryClient } from '@tanstack/react-query'
import { setOpportunityStatus } from '../../services/opportunities'
import { queryKeys } from '../../app/queryKeys'

/**
 * تبديل حالة فرصة يدويًا (إغلاق/إعادة فتح) من طرف المنظمة — يستخدمه زر
 * القفل بكارد "My Causes". كانت الدالة setOpportunityStatus موجودة
 * بالخدمة من دون أي hook أو ربط بالواجهة، فزر التبديل كان يظهر ويعمل
 * تأكيد لكن onToggleStatus?.() كان يصمت (undefined) بدون أي تأثير فعلي.
 * @param {string} organizationId - لتحديث كاش "My Causes" الصحيح فورًا
 */
export function useToggleOpportunityStatusMutation(organizationId) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }) => setOpportunityStatus(id, status),
    onSuccess: (result, { id, status }) => {
      if (!result?.success) return

      // تحديث فوري بالكاش (بدل انتظار إعادة جلب) — نفس نمط الحذف
      queryClient.setQueryData(queryKeys.opportunities.mine(organizationId), (current) =>
        Array.isArray(current)
          ? current.map((opportunity) => (opportunity.id === id ? { ...opportunity, status } : opportunity))
          : current,
      )

      queryClient.invalidateQueries({ queryKey: queryKeys.opportunities.all })
    },
  })
}