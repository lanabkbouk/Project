import { useMemo } from 'react'
import { useMyParticipationsQuery } from './useMyParticipationsQuery'
import { buildVolunteerHoursSummary } from '../../utils/volunteerHoursSummary'

/**
 * ملخّص ساعات التطوع للمتطوع الحالي (لقسم "Volunteering Hours" ببروفايل
 * المتطوع). يعيد استخدام useMyParticipationsQuery بنفسها — نفس مفتاح
 * الكاش (queryKeys.participations.mine) المستخدم أصلًا بصفحة My
 * Volunteering — فما في أي نداء شبكة إضافي، وما في مصدر بيانات ثانٍ.
 * الحساب نفسه عبر buildVolunteerHoursSummary الموحّدة (نفس الدالة
 * المستخدمة بـ achievements.js وبإحصائيات المنظمة)، فأي رقم ساعات
 * ظاهر بأي مكان بالمشروع محسوب بنفس القاعدة بالضبط.
 */
export function useVolunteerHoursSummaryQuery() {
  const participationsQuery = useMyParticipationsQuery()

  const summary = useMemo(
    () => buildVolunteerHoursSummary(participationsQuery.data ?? []),
    [participationsQuery.data],
  )

  return { ...participationsQuery, data: summary }
}