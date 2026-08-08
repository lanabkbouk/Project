import { useMutation } from '@tanstack/react-query'
import { updateVolunteerProfile } from '../../services/volunteer'

/**
 * حفظ بروفايل المتطوع. المعرف يُربط هنا حتى تبقى الصفحة تستدعي
 * mutateAsync(data) فقط، بدل تمرير id في كل submit (نفس نمط
 * useUpdateOrganizationProfileMutation).
 *
 * بيانات البروفايل نفسها معاشة بـ AuthContext (مو بكاش React Query)،
 * فما في queries تانية نحتاج نبطّلها بعد النجاح — الصفحة يلي بتستدعي
 * الهوك هي المسؤولة تنادي updateUser() بعد النجاح.
 */
export function useUpdateVolunteerProfileMutation(volunteerId) {
  return useMutation({
    mutationFn: (payload) => updateVolunteerProfile(volunteerId, payload),
  })
}