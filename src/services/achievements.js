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

const MOCK_MODE = isMockMode()

const MOCK_ACHIEVEMENTS = [
  {
    id: 'a1',
    name: 'First Volunteering Opportunity',
    description: 'Completed your first volunteering opportunity.',
    unlocked: false,
    earnedDate: null,
  },
  {
    id: 'a2',
    name: '10 Volunteer Hours',
    description: 'Reached 10 cumulative volunteering hours.',
    unlocked: true,
    earnedDate: null,
  },
  {
    id: 'a3',
    name: 'Completion of Three Group Activities',
    description: 'Completed 3 group volunteering opportunities.',
    unlocked: false,
    earnedDate: null,
  },
]

/**
 * Fetches the FULL achievement catalog for a volunteer, each entry flagged
 * with whether it's unlocked yet (so locked ones can still be displayed).
 * @param {string|number} [volunteerId] - Volunteer id (optional when using token-based "me" auth)
 * @returns {Promise<Array<{id:string, name:string, description:string, unlocked:boolean, earnedDate:string|null}>>}
 */
export async function fetchVolunteerAchievements(volunteerId) {
  if (MOCK_MODE) {
    await wait()
    return MOCK_ACHIEVEMENTS
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