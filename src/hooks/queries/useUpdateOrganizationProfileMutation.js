import { useMutation } from '@tanstack/react-query'
import { updateOrganizationProfile } from '../../services/organization'

/**
 * حفظ بروفايل المنظمة. المعرف يُربط هنا حتى تبقى الصفحة تستدعي
 * mutateAsync(data) فقط، بدل تمرير id في كل submit.
 */
export function useUpdateOrganizationProfileMutation(organizationId) {
  return useMutation({
    mutationFn: (profileData) => updateOrganizationProfile(organizationId, profileData),
  })
}