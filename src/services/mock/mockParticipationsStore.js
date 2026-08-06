// مخزن Mock مشترك لبيانات المشاركات (participations).
//
// ليش ملف مستقل؟ لأنه opportunities.js (participateInOpportunity) صار
// محتاج "يكتب" سجل مشاركة جديد لحظة الانضمام، وparticipations.js
// (fetchApplicantsForOpportunity) هو يلي "يقرأ" هالسجلات لعرضها للمنظمة.
// لو استوردنا participations.js مباشرة جوا opportunities.js كان رح
// يصير Circular Import (participations.js نفسها أصلًا بتستورد
// fetchOpportunities من opportunities.js) — فبدل هيك، الملفين بيعتمدوا
// سوا على هالمصدر المشترك الوحيد.

import { PARTICIPATION_STATUS } from '../../constants/participationStatus'

// ⚠️ كل مشاركة هلق فيها volunteerId ثابت — قبل هيك، كل لقطة متقدم
// كانت معزولة عن باقي مشاركات نفس المتطوع (حتى لو كان نفس الشخص شارك
// بفرص تانية)، فكان مستحيل نحسب إحصائيات حقيقية (ساعات/فرص مكتملة).
// هلق: نفس volunteerId بيتكرر عبر أكتر من مشاركة/منظمة، فمنقدر نحسب
// "كم فرصة أكمل لدى هالمنظمة بالذات" مقابل "كم إجمالاً عالمنصة" بدقة.
//
// ملاحظة على التواريخ: o1 (2026-08-01)، o5 (2025-12-20)، وo6
// (2025-07-14) انتهت فعليًا (تاريخ اليوم 2026-08-05) — يعني
// attachComputedStatus بيحسبهم "completed" تلقائيًا. o2/o3/o4 لسا
// بالمستقبل، فمشاركاتهم مش completed بعد.
export const MOCK_PARTICIPATIONS = [
  // — المتقدمين الحاليين على مراجعة (زي ما كانوا أصلًا) —
  { id: 'p1', volunteerId: 'v1', opportunityId: 'o1', status: PARTICIPATION_STATUS.PENDING, committedHours: 3, hoursLogged: null, joinedDate: '2026-07-25' },
  { id: 'p2', volunteerId: 'v2', opportunityId: 'o2', status: PARTICIPATION_STATUS.ACCEPTED, committedHours: 4, hoursLogged: null, joinedDate: '2026-07-20' },
  { id: 'p5', volunteerId: 'v3', opportunityId: 'o1', status: PARTICIPATION_STATUS.REJECTED, committedHours: 2, hoursLogged: null, joinedDate: '2026-05-15' },

  // — سجل تاريخي إضافي (فرص منتهية فعليًا)، لحساب إحصائيات حقيقية —
  // Lina (v1): فرصتين مكتملتين بمنظمتين غير org1 (فرصتها الحالية
  // بمراجعة p1 بالأعلى) — حتى يبان الفرق بين "لدى هالمنظمة" (0) و"إجمالاً" (2)
  { id: 'p20', volunteerId: 'v1', opportunityId: 'o6', status: PARTICIPATION_STATUS.ACCEPTED, committedHours: 6, hoursLogged: 6, joinedDate: '2025-07-01' },
  { id: 'p21', volunteerId: 'v1', opportunityId: 'o5', status: PARTICIPATION_STATUS.ACCEPTED, committedHours: 4, hoursLogged: 4, joinedDate: '2025-12-10' },

  // Omar (v2): فرصة مكتملة إضافية بنفس منظمة o2 (org2) + فرصتين
  // بمنظمات تانية — حتى يبان "لدى هالمنظمة" (1) مقابل "إجمالاً" (3)
  { id: 'p22', volunteerId: 'v2', opportunityId: 'o6', status: PARTICIPATION_STATUS.ACCEPTED, committedHours: 12, hoursLogged: 12, joinedDate: '2025-07-05' },
  { id: 'p23', volunteerId: 'v2', opportunityId: 'o5', status: PARTICIPATION_STATUS.ACCEPTED, committedHours: 15, hoursLogged: 15, joinedDate: '2025-12-05' },
  { id: 'p24', volunteerId: 'v2', opportunityId: 'o1', status: PARTICIPATION_STATUS.ACCEPTED, committedHours: 15, hoursLogged: 15, joinedDate: '2026-07-20' },

  // Maya (v3): فرصة مكتملة وحدة بس (منظمة تانية غير org1)
  { id: 'p25', volunteerId: 'v3', opportunityId: 'o6', status: PARTICIPATION_STATUS.ACCEPTED, committedHours: 5, hoursLogged: 5, joinedDate: '2025-07-10' },
]

// بروفايل كل متطوع — مفتاح المصفوفة هلق volunteerId (مش participation
// id)، لأنه بروفايل يخص شخص، مش طلب مشاركة واحد بعينه
export const MOCK_VOLUNTEER_PROFILES = {
  v1: {
    volunteerId: 'v1', name: 'Lama Haddad', photo: null, city: 'Damascus',
    skills: ['First Aid', 'Communication'], phone: '+963911111111',
    educationLevel: "Bachelor's Degree", dateOfBirth: '2001-03-14', gender: 'female',
  },
  v2: {
    volunteerId: 'v2', name: 'Omar Khalil', photo: null, city: 'Aleppo',
    skills: ['Teaching'], phone: '+963922222222',
    educationLevel: "Master's Degree", dateOfBirth: '1997-09-02', gender: 'male',
  },
  v3: {
    volunteerId: 'v3', name: 'Maya Saleh', photo: null, city: 'Damascus',
    skills: ['Photography'], phone: '+963955555555',
    educationLevel: 'High School', dateOfBirth: '2004-11-20', gender: 'female',
  },
}

/**
 * يضيف سجل مشاركة جديد لحظة ما متطوع (بوضع Mock) يضغط "Confirm & Join" —
 * هاي الدالة بالذات هي يلي بتربط انضمام المتطوع فعليًا بقائمة
 * المتقدمين يلي بتشوفها المنظمة، بدل ما يضلّوا معزولين عن بعض.
 * @param {{opportunityId: string, committedHours: number, volunteerProfile: object}} params
 * @returns {object} سجل المشاركة الجديد
 */
export function addMockParticipation({ opportunityId, committedHours, volunteerProfile }) {
  // volunteerId ثابت لنفس الإيميل — لو نفس المتطوع انضم أكتر من مرة
  // (فرص مختلفة)، بيرجع يترقّم تلقائيًا تحت نفس الهوية، مش هويات
  // متفرقة كل مرة يشارك فيها
  const volunteerId = volunteerProfile.email ? `v-${volunteerProfile.email}` : `v-${Date.now()}`

  const participation = {
    id: `p${Date.now()}`,
    volunteerId,
    opportunityId,
    status: PARTICIPATION_STATUS.PENDING,
    committedHours,
    hoursLogged: null,
    joinedDate: new Date().toISOString().slice(0, 10),
  }

  MOCK_PARTICIPATIONS.push(participation)
  MOCK_VOLUNTEER_PROFILES[volunteerId] = { volunteerId, ...volunteerProfile }

  return participation
}