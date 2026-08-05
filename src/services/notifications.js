// services/notifications.js
//
// نظام التنبيهات — تمت الموافقة عليه من الباك اند، لكن الـ endpoint
// الحقيقي لسا ما بُني (سيُطوَّر لاحقًا ويُبلَّغ الفرونت). هالملف جاهز
// من الآن بنفس بنية باقي الخدمات (MOCK_MODE / real API) حتى لما يجهز
// الـ endpoint، الاستبدال يصير هون فقط بدون أي لمسة على useRecentUpdates
// أو NotificationBell أو أي Component تاني.
//
// TODO: لما يجهز الباك اند، الشكل المتوقع للـ endpoint:
//   GET /api/notifications
//   Response: [{ id, type, title, description, href, seen }, ...]
// أو أي شكل تاني يتفقوا عليه — المهم إنه يترجم هون فقط لنفس شكل items[]
// المستخدم حاليًا (id/type/title/description/href) دون تغيير أي مكان تاني.

import { apiClient, getApiErrorMessage } from './api/client'
import { isMockMode } from './api/mockMode'
import { fetchVolunteerAchievements } from './achievements'
import { fetchMyParticipations } from './participations'
import { getSeenAchievementIds } from '../utils/achievementSeenTracker'
import { getSeenHoursMap } from '../utils/hoursSeenTracker'
import { getSeenStatusMap } from '../utils/participationStatusSeenTracker'
import { PARTICIPATION_STATUS } from '../constants/participationStatus'
import { ROUTES } from '../constants/paths'

const MOCK_MODE = isMockMode()

// يبني عناصر التنبيهات من الإنجازات: كل إنجاز اتفتح حديثًا ولسا ما
// انشاف (مش موجود بقائمة seenAchievements) بيصير عنصر تنبيه واحد
function buildAchievementItems(achievements, seenAchievements) {
  return achievements
    .filter((achievement) => achievement.unlocked && !seenAchievements.has(achievement.id))
    .map((achievement) => ({
      id: `achievement:${achievement.id}`,
      type: 'achievement',
      title: 'New achievement unlocked',
      description: achievement.name,
      // #achievements يمرّر تلقائيًا لقسم الإنجازات مباشرة (راجع
      // useEffect بـ volunteerProfile.jsx) بدل ما يوصل أعلى الصفحة
      href: `${ROUTES.VOLUNTEER_PROFILE}#achievements`,
    }))
}

// يبني عناصر التنبيهات من المشاركات: ساعات اتأكدت حديثًا، أو حالة
// المشاركة اتغيّرت (قُبل/اترفض) ولسا ما انشافت
function buildParticipationItems(participations, seenHours, seenStatus) {
  const items = []

  participations.forEach((participation) => {
    const opportunityTitle = participation.opportunity?.title || 'an opportunity'

    const hasNewHours =
      participation.hoursLogged !== null &&
      participation.hoursLogged !== undefined &&
      Number(seenHours.get(participation.id)) !== Number(participation.hoursLogged)

    if (hasNewHours) {
      items.push({
        id: `hours:${participation.id}`,
        type: 'hours',
        title: 'Hours confirmed',
        description: `${opportunityTitle}: ${participation.hoursLogged} hrs`,
        href: ROUTES.MY_VOLUNTEERING,
      })
    }

    const isDecided =
      participation.status === PARTICIPATION_STATUS.ACCEPTED ||
      participation.status === PARTICIPATION_STATUS.REJECTED

    if (isDecided && seenStatus.get(participation.id) !== participation.status) {
      items.push({
        id: `status:${participation.id}`,
        type:
          participation.status === PARTICIPATION_STATUS.ACCEPTED
            ? 'status-accepted'
            : 'status-rejected',
        title:
          participation.status === PARTICIPATION_STATUS.ACCEPTED
            ? 'Your request was accepted'
            : 'Your request was declined',
        description: opportunityTitle,
        href: ROUTES.MY_VOLUNTEERING,
      })
    }
  })

  return items
}

/**
 * يجلب التنبيهات الحديثة غير المقروءة للمتطوع الحالي.
 *
 * بوضع Mock: تُشتق من الإنجازات + المشاركات (نفس المنطق القديم اللي
 * كان جوا useRecentUpdates مباشرة)، مقارنة بما هو مخزّن محليًا كـ "مشاهَد".
 *
 * @returns {Promise<Array<{id:string, type:string, title:string, description:string, href:string}>>}
 */
export async function fetchRecentNotifications() {
  if (MOCK_MODE) {
    const [achievements, participations] = await Promise.all([
      fetchVolunteerAchievements(),
      fetchMyParticipations(),
    ])

    const achievementItems = buildAchievementItems(achievements, getSeenAchievementIds())
    const participationItems = buildParticipationItems(
      participations,
      getSeenHoursMap(),
      getSeenStatusMap(),
    )

    return [...achievementItems, ...participationItems]
  }

  try {
    const response = await apiClient.get('/notifications')
    const data = Array.isArray(response.data) ? response.data : []

    // تطبيع دفاعي: لو الباك اند رجّع أسماء حقول مختلفة شوي عن المتوقع،
    // هالسطر بيضمن إنه NotificationBell ما ينكسر لحد ما يتفق الفريقين
    // نهائيًا على الشكل النهائي للـ endpoint
    return data.map((item) => ({
      id: item.id,
      type: item.type || 'update',
      title: item.title || 'New update',
      description: item.description || item.message || '',
      href: item.href || item.link || ROUTES.HOME,
    }))
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Failed to load notifications'), { cause: error })
  }
}