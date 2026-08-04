import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateSkill } from '../../services/skills'
import { queryKeys } from '../../app/queryKeys'

/**
 * يعدّل اسم مهارة و/أو تصنيفها (أدمن فقط).
 */
export function useUpdateSkillMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ skillId, payload }) => updateSkill(skillId, payload),
    onSuccess: (result) => {
      if (!result?.success) return
      // نفس سبب useCreateSkillMutation: كائن category المرتبط لازم
      // يُعاد بناؤه بعد تغيير التصنيف، فإعادة الجلب أبسط وأضمن
      queryClient.invalidateQueries({ queryKey: queryKeys.skills.all })
    },
  })
}