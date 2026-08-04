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
import { PARTICIPATION_STATUS } from '../constants/participationStatus'

const MOCK_MODE = isMockMode()

// مثال واحد على كل حالة من الحالات الثلاث المؤكدة، لعرضها بالتصميم قبل الربط مع الباك اند
// ⚠️ committedHours: الرقم يلي المتطوع التزم فيه لحظة الانضمام (عبر
// ParticipateHoursModal). hoursLogged: الرقم النهائي يلي المنظمة بتأكده/
// بتعدّله بعد ما الفرصة تخلص فعليًا — null لحد ما تحدّده (راجع
// updateParticipationHours أسفل الملف). قبل الانتهاء الفعلي بيساوي
// committedHours افتراضيًا (نفس الفكرة يلي بيبلّش فيها ManageHoursModal).
const MOCK_PARTICIPATIONS = [
  { id: 'p1', opportunityId: 'o1', status: PARTICIPATION_STATUS.PENDING, committedHours: 3, hoursLogged: null, joinedDate: '2026-07-25' },
  { id: 'p2', opportunityId: 'o2', status: PARTICIPATION_STATUS.ACCEPTED, committedHours: 4, hoursLogged: null, joinedDate: '2026-07-20' },
  { id: 'p5', opportunityId: 'o1', status: PARTICIPATION_STATUS.REJECTED, committedHours: 2, hoursLogged: null, joinedDate: '2026-05-15' },
]

// بيانات متطوع تجريبية لكل مشاركة، تُستخدم فقط بجانب المنظمة (قائمة المتقدمين)
// حيث تحتاج المنظمة ترى معلومات المتطوع نفسه، لا فقط حالة طلبه
const MOCK_APPLICANT_PROFILES = {
  p1: { name: 'Lina Haddad', photo: null, city: 'Damascus', skills: ['First Aid', 'Communication'], phone: '+963911111111' },
  p2: { name: 'Omar Khalil', photo: null, city: 'Aleppo', skills: ['Teaching'], phone: '+963922222222' },
  p5: { name: 'Maya Saleh', photo: null, city: 'Damascus', skills: ['Photography'], phone: '+963955555555' },
}

/**
 * Fetches the current volunteer's participations (joined opportunities).
 * @returns {Promise<Array<{opportunityId:string, status:string, hoursLogged:number, joinedDate:string, opportunity:object}>>}
 */
export async function fetchMyParticipations() {
  if (MOCK_MODE) {
    await wait()
    const opportunities = await fetchOpportunities()
    return MOCK_PARTICIPATIONS.map((participation) => ({
      ...participation,
      opportunity: opportunities.find((item) => item.id === participation.opportunityId) || null,
    })).filter((participation) => participation.opportunity)
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
    return MOCK_PARTICIPATIONS.filter((participation) => participation.opportunityId === opportunityId).map(
      (participation) => ({
        id: participation.id,
        status: participation.status,
        participatedAt: participation.joinedDate,
        committedHours: participation.committedHours,
        hoursLogged: participation.hoursLogged,
        volunteer: MOCK_APPLICANT_PROFILES[participation.id] || null,
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
 * نقطة موحّدة لتغيير حالة طلب مشاركة — تُستخدم من طرف المنظمة (accepted/rejected)
 * ومن طرف المتطوع (withdrawn) على حد سواء، عبر نفس الـ Endpoint.
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

// withdrawParticipation انشالت مؤقتًا مع حالة WITHDRAWN — لو تأكدت
// لاحقًا من الباك، ترجع الدالة والحالة مع بعض بنفس المكانين تمامًا.

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