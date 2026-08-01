import { useMutation } from '@tanstack/react-query'
import { updateOrganizationProfile } from '../../services/organization'

/**
 * حفظ بروفايل المنظمة. تحديث الكاش بعد النجاح (setQueryData) مسؤولية
 * الصفحة نفسها — لأنه القيم يلي بدنا ندمجها هي بيانات الفورم المُتحقق
 * منها (data)، مو الاستجابة الخام (بترجع بس { imageUrl } بوضع الـ Mock).
 */
export function useUpdateOrganizationProfileMutation() {
  return useMutation({
    mutationFn: updateOrganizationProfile,
  })
}