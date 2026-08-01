import { useQuery } from '@tanstack/react-query'
import { fetchMyParticipations } from '../../services/participations'
import { queryKeys } from '../../app/queryKeys'

/**
 * يجلب الفرص التي انضم لها المتطوع الحالي (صفحة "My Volunteering").
 */
export function useMyParticipationsQuery() {
  return useQuery({
    queryKey: queryKeys.participations.mine,
    queryFn: fetchMyParticipations,
  })
}