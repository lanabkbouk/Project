import { useMutation } from '@tanstack/react-query'
import { updateVolunteerProfile } from '../../services/volunteer'

/**
 * حفظ بروفايل المتطوع. بيانات البروفايل نفسها معاشة بـ AuthContext (مو
 * بكاش React Query)، فما في queries تانية نحتاج نبطّلها بعد النجاح —
 * الصفحة يلي بتستدعي الهوك هي المسؤولة تنادي updateUser() بعد النجاح.
 */
export function useUpdateVolunteerProfileMutation() {
  return useMutation({
    mutationFn: updateVolunteerProfile,
  })
}