// الإنجازات المقفلة / غير المقفلة
// يعرض ملف تعريف المتطوعين كتالوج الإنجاز الكامل (وليس فقط
// تلك التي تكسب بالفعل) حتى يتمكنوا من رؤية ما لا يزال أمامهم - مقفل
// يتم تقديم الإنجازات في الرمادي مع اسمها الحقيقي / وصفها ،
// تظهر تلك المقفلة بالألوان الكاملة مع تاريخ كسبها.
// هذا يعني أن واجهة برمجة التطبيقات يجب أن تعيد كل تعريف للإنجاز ، ولكل منها: ////
// - غير مقفل: boolean
// - المكتسبةالتاريخ: سلسلة | null (لاغية أثناء قفل)
//
// هام - من يمنح إنجازا:
// منح هو تماما قاعدة الأعمال الخلفية، وليس شيئا مجموعة المشرف
// يدويا وليس شيئا تقرر في الواجهة الأمامية. القواعد هي:
// - أول فرصة مكتملة
// - 10 ساعات تطوعية تراكمية
// - 3 فرص جماعية مكتملة
// يجب على Laravel تقييم هذه تلقائيًا (على سبيل المثال حدث / مراقب نموذجي
// التي يتم تشغيلها عند اكتمال المشاركة) وقلب "غير مقفلة" إلى
// صحيح + مجموعة "كرند دايت" بمجرد استيفاء قاعدة. يعرض هذا الملف فقط
// مهما كانت عودة API - لا شيء عن أي إنجازات موجودة ، أو
// سواء كانت مقفلة ، فهي مشفرة على العميل.
import { apiClient, getApiErrorMessage } from './api/client'
import { isMockMode } from './api/mockMode'
import { wait } from './api/delay'
import { MOCK_PARTICIPATIONS } from './mock/mockParticipationsStore'
import { MOCK_OPPORTUNITIES } from './mock/mockOpportunitiesStore'
import { PARTICIPATION_STATUS } from '../constants/participationStatus'
import { AUTH_STORAGE_KEY } from '../constants/auth/storage'

const MOCK_MODE = isMockMode()

// تعريفات الإنجازات (بدون unlocked/earnedDate ثابتين — هلق بيتحسبوا
// فعليًا لكل متطوع لحاله، مش قيمة واحدة ثابتة للجميع)
const ACHIEVEMENT_DEFINITIONS = [
  {
    id: 'a1',
    name: 'First Volunteering Opportunity',
    description: 'Completed your first volunteering opportunity.',
  },
  {
    id: 'a2',
    name: '10 Volunteer Hours',
    description: 'Reached 10 cumulative volunteering hours.',
  },
  {
    id: 'a3',
    name: 'Completion of Three Group Activities',
    description: 'Completed 3 group volunteering opportunities.',
  },
]

/**
 * يحسب حالة فتح كل إنجاز لمتطوع معيّن، من سجل مشاركاته الحقيقي عبر
 * المنصة كلها (مش خاص بمنظمة وحدة — راجع API_CONTRACT.md لتوضيح ليش
 * قواعد المنح تراكمية عالمنصة، مش قابلة للعزل حسب منظمة بعينها).
 * @param {string} volunteerId
 */
function computeAchievementsForVolunteer(volunteerId) {
  const myParticipations = MOCK_PARTICIPATIONS.filter((p) => p.volunteerId === volunteerId)

  const completed = myParticipations.filter((participation) => {
    const opportunity = MOCK_OPPORTUNITIES.find((item) => item.id === participation.opportunityId)
    return (
      participation.status === PARTICIPATION_STATUS.ACCEPTED &&
      opportunity &&
      new Date(opportunity.endDate) < new Date()
    )
  })

  const totalHours = completed.reduce((sum, p) => sum + (Number(p.hoursLogged) || 0), 0)

  // أقدم فرصة مكتملة (تاريخًا) — تُستخدم كـ earnedDate لإنجاز "أول فرصة"
  const earliestCompleted = [...completed].sort(
    (a, b) => new Date(a.joinedDate) - new Date(b.joinedDate),
  )[0]

  const unlockedMap = {
    a1: completed.length >= 1,
    a2: totalHours >= 10,
    a3: completed.length >= 3,
  }

  return ACHIEVEMENT_DEFINITIONS.map((definition) => ({
    ...definition,
    unlocked: unlockedMap[definition.id] || false,
    earnedDate: unlockedMap[definition.id] ? earliestCompleted?.joinedDate || null : null,
  }))
}

/**
 * Fetches the FULL achievement catalog for a volunteer, each entry flagged
 * with whether it's unlocked yet (so locked ones can still be displayed).
 * @param {string|number} [volunteerId] - Volunteer id (optional when using token-based "me" auth)
 * @returns {Promise<Array<{id:string, name:string, description:string, unlocked:boolean, earnedDate:string|null}>>}
 */
export async function fetchVolunteerAchievements(volunteerId) {
  if (MOCK_MODE) {
    await wait()

    // لو ما انمرر volunteerId (حالة "me" — صفحة بروفايل المتطوع نفسه)،
    // منحله من الجلسة الحالية بنفس منطق participateInOpportunity بالضبط
    const resolvedId = volunteerId || (() => {
      try {
        const raw = localStorage.getItem(AUTH_STORAGE_KEY)
        const email = raw ? JSON.parse(raw)?.user?.email : null
        return email ? `v-${email}` : null
      } catch {
        return null
      }
    })()

    if (!resolvedId) {
      return ACHIEVEMENT_DEFINITIONS.map((definition) => ({ ...definition, unlocked: false, earnedDate: null }))
    }

    return computeAchievementsForVolunteer(resolvedId)
  }

  try {
    const endpoint = volunteerId
      ? `/volunteers/${volunteerId}/achievements`
      : '/volunteers/me/achievements'

    const response = await apiClient.get(endpoint)
    return response.data || []
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Failed to load achievements'))
  }
}