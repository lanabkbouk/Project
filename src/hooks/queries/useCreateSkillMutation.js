import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createSkill } from '../../services/skills'
import { queryKeys } from '../../app/queryKeys'

/**
 * ينشئ مهارة جديدة تحت تصنيف معيّن (أدمن فقط).
 */
export function useCreateSkillMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createSkill,
    onSuccess: () => {
      // المهارات مخزّنة بالكاش بشكلها الموسّع (مربوطة مع كائن category
      // كامل، مو بس categoryId) — أبسط وأضمن نعيد الجلب هون بدل ما
      // نبني نفس منطق الربط يدويًا بكل مكان يعدّل الكاش
      queryClient.invalidateQueries({ queryKey: queryKeys.skills.all })
    },
  })
}