import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createOpportunity, updateOpportunity } from '../../services/opportunities'
import { queryKeys } from '../../app/queryKeys'

/**
 * إنشاء أو تعديل فرصة بنفس الهوك — يقرر لحاله أي دالة يستخدم حسب
 * isEditMode، فصفحة الفورم ما بتحتاج تفرّق بين الحالتين إلا بالنص
 * المعروض وبس.
 * @param {{isEditMode: boolean, id?: string}} params
 */
export function useSaveOpportunityMutation({ isEditMode, id }) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload) => (isEditMode ? updateOpportunity(id, payload) : createOpportunity(payload)),
    onSuccess: (result) => {
      if (!result?.success) return
      // فرصة جديدة أو معدّلة بتأثر على كل قوائم الفرص المعروضة بأي مكان
      queryClient.invalidateQueries({ queryKey: queryKeys.opportunities.all })
    },
  })
}