// Matches the "participates" relation in the ERD (volunteer <-> opportunity).
// Returns the opportunities the currently logged-in volunteer has joined,
// each enriched with participation-specific fields (status, hours logged).
//
// TODO: once Laravel is ready, set VITE_API_MODE=real
// GET /api/volunteers/me/participations
// Expected response: [{ opportunityId, status, hoursLogged, joinedDate, opportunity }, ...]

import { apiClient, getApiErrorMessage } from './api/client'
import { isMockMode } from './api/mockMode'
import { wait } from './api/delay'
import { fetchOpportunities } from './opportunities'
import { getEffectiveParticipationStatus, PARTICIPATION_STATUS } from '../constants/participationStatus'
import { OPPORTUNITY_STATUS } from '../constants/opportunityStatus'
import { MOCK_PARTICIPATIONS, MOCK_VOLUNTEER_PROFILES } from './mock/mockParticipationsStore'
import { fetchVolunteerAchievements } from './achievements'

const MOCK_MODE = isMockMode()

/**
 * Fetches the current volunteer's participations (joined opportunities).
 * @returns {Promise<Array<{opportunityId:string, status:string, hoursLogged:number, joinedDate:string, opportunity:object}>>}
 */
export async function fetchMyParticipations() {
  if (MOCK_MODE) {
    await wait()
    const opportunities = await fetchOpportunities()
    return MOCK_PARTICIPATIONS.map((participation) => {
      const opportunity = opportunities.find((item) => item.id === participation.opportunityId) || null
      return {
        ...participation,
        // pending تتحول expired بالعرض تلقائيًا لو فات تاريخ بداية
        // الفرصة والمنظمة ما ردّت — راجع constants/participationStatus.js
        status: opportunity ? getEffectiveParticipationStatus(participation, opportunity) : participation.status,
        opportunity,
      }
    }).filter((participation) => participation.opportunity)
  }

  try {
    const response = await apiClient.get('/volunteers/me/participations')
    return response.data || []
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Failed to load your volunteering history'))
  }
}

/**
 * يجلب المتقدمين على فرصة معيّنة (لصفحة "قائمة المتقدمين" عند المنظمة).
 * @param {string} opportunityId
 */
export async function fetchApplicantsForOpportunity(opportunityId) {
  if (MOCK_MODE) {
    await wait()
    // محتاجين تاريخ بداية الفرصة لحساب Expired، وهوية المنظمة لحساب
    // إحصائيات "لدى هالمنظمة بالذات" — نفس منطق fetchMyParticipations
    // بالضبط، بس هون من جهة المنظمة
    const opportunities = await fetchOpportunities()
    const opportunity = opportunities.find((item) => item.id === opportunityId) || null
    const organizationId = opportunity?.organization?.id

    const applicants = MOCK_PARTICIPATIONS.filter(
      (participation) => participation.opportunityId === opportunityId,
    )

    return Promise.all(
      applicants.map(async (participation) => {
        const volunteerProfile = MOCK_VOLUNTEER_PROFILES[participation.volunteerId] || null

        // ⚠️ إحصائيات حقيقية محسوبة "لدى هالمنظمة بالذات" — مش رقم
        // ثابت مخترع. بنجمع كل مشاركات نفس المتطوع (volunteerId)
        // المرتبطة بفرص من نفس المنظمة الحالية فقط، ومكتملة فعليًا
        let completedOpportunitiesCount = 0
        let totalHoursVolunteered = 0
        let achievements = []

        if (volunteerProfile && organizationId) {
          const sameVolunteerParticipations = MOCK_PARTICIPATIONS.filter(
            (item) => item.volunteerId === participation.volunteerId,
          )

          sameVolunteerParticipations.forEach((item) => {
            const itemOpportunity = opportunities.find((o) => o.id === item.opportunityId)
            const isCompletedAtThisOrg =
              itemOpportunity?.organization?.id === organizationId &&
              itemOpportunity?.status === OPPORTUNITY_STATUS.COMPLETED &&
              item.status === PARTICIPATION_STATUS.ACCEPTED

            if (isCompletedAtThisOrg) {
              completedOpportunitiesCount += 1
              totalHoursVolunteered += Number(item.hoursLogged) || 0
            }
          })

          // ⚠️ الإنجازات عكس الإحصائيات فوق — تراكمية عبر المنصة كلها
          // (مش قابلة للعزل حسب منظمة، راجع API_CONTRACT.md)، فهون
          // بنجيب القائمة الحقيقية الكاملة لهالمتطوع بغض النظر عن
          // المنظمة الحالية
          achievements = await fetchVolunteerAchievements(participation.volunteerId)
        }

        return {
          id: participation.id,
          // ⚠️ بدون هالسطر، طلب pending كان بيضل "Pending" للأبد حتى لو
          // الفرصة خلصت من زمان — وبالتالي أزرار Accept/Reject تضل ظاهرة
          // بشكل خاطئ عند المنظمة رغم إنه فات وقت القرار
          status: opportunity
            ? getEffectiveParticipationStatus(participation, opportunity)
            : participation.status,
          participatedAt: participation.joinedDate,
          committedHours: participation.committedHours,
          hoursLogged: participation.hoursLogged,
          volunteer: volunteerProfile
            ? { ...volunteerProfile, completedOpportunitiesCount, totalHoursVolunteered, achievements }
            : null,
        }
      }),
    )
  }

  try {
    const response = await apiClient.get(`/opportunities/${opportunityId}/participants`)
    return response.data || []
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Failed to load applicants'))
  }
}

/**
 * نقطة موحّدة لتغيير حالة طلب مشاركة — تُستخدم من طرف المنظمة (accepted/rejected).
 * @param {string} participationId
 * @param {string} status
 */
export async function updateParticipationStatus(participationId, status) {
  if (MOCK_MODE) {
    await wait()
    const participation = MOCK_PARTICIPATIONS.find((item) => item.id === participationId)
    if (participation) participation.status = status
    return { success: true }
  }

  try {
    await apiClient.put(`/participations/${participationId}`, { status })
    return { success: true }
  } catch (error) {
    return { success: false, error: getApiErrorMessage(error, 'Failed to update this request') }
  }
}

// انسحاب المتطوع من مشاركة — قرار مع فريق سنا: حذف السطر بالكامل من
// opportunity_volunteer، بأي وقت (pending أو accepted سوا)، بدون أي
// حالة "withdrawn" مخزّنة. مش endpoint تغيير حالة، هو DELETE فعلي.
/**
 * @param {string} participationId
 */
export async function withdrawParticipation(participationId) {
  if (MOCK_MODE) {
    await wait()
    const index = MOCK_PARTICIPATIONS.findIndex((item) => item.id === participationId)
    if (index === -1) return { success: false, error: 'Participation not found' }
    MOCK_PARTICIPATIONS.splice(index, 1)
    return { success: true }
  }

  try {
    await apiClient.delete(`/participations/${participationId}`)
    return { success: true }
  } catch (error) {
    return { success: false, error: getApiErrorMessage(error, 'Failed to withdraw from this opportunity') }
  }
}

// ————————————————————————————————————————————————————————————
// إدارة الساعات النهائية (منظمة فقط، بعد انتهاء الفرصة) — راجع
// ManageHoursModal.jsx وApplicantCard.jsx. الشرط (opportunityHasEnded
// && isAccepted) محسوب بالكامل بالفرونت أصلاً؛ هالدالة نفّذت هون
// كنقطة واحدة، لكنها لن تُستخدم فعليًا بوضع real لحد ما فريق سنا يضيف:
//   - عمود hours_logged (nullable) بجدول opportunity_volunteer
//   - PATCH /participations/{id}/hours { hours }
// ————————————————————————————————————————————————————————————

/**
 * تحدّث الساعات النهائية المؤكدة لمشاركة معيّنة (بعد انتهاء الفرصة).
 * نفس نمط {success,error} المستخدم بـ updateParticipationStatus.
 * @param {string} participationId
 * @param {number} hours
 */
export async function updateParticipationHours(participationId, hours) {
  if (MOCK_MODE) {
    await wait()

    const participation = MOCK_PARTICIPATIONS.find((item) => item.id === participationId)
    if (!participation) return { success: false, error: 'Participation not found' }

    participation.hoursLogged = hours
    return { success: true }
  }

  try {
    await apiClient.patch(`/participations/${participationId}/hours`, { hours })
    return { success: true }
  } catch (error) {
    return { success: false, error: getApiErrorMessage(error, 'Failed to update hours') }
  }
}