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

// نفس البيانات التجريبية الأصلية بالضبط — بس هلق بمكان واحد بدل ما
// تكون محلية جوا participations.js فقط
export const MOCK_PARTICIPATIONS = [
  { id: 'p1', opportunityId: 'o1', status: PARTICIPATION_STATUS.PENDING, committedHours: 3, hoursLogged: null, joinedDate: '2026-07-25' },
  { id: 'p2', opportunityId: 'o2', status: PARTICIPATION_STATUS.ACCEPTED, committedHours: 4, hoursLogged: null, joinedDate: '2026-07-20' },
  { id: 'p5', opportunityId: 'o1', status: PARTICIPATION_STATUS.REJECTED, committedHours: 2, hoursLogged: null, joinedDate: '2026-05-15' },
]

export const MOCK_APPLICANT_PROFILES = {
  p1: { name: 'Lina Haddad', photo: null, city: 'Damascus', skills: ['First Aid', 'Communication'], phone: '+963911111111' },
  p2: { name: 'Omar Khalil', photo: null, city: 'Aleppo', skills: ['Teaching'], phone: '+963922222222' },
  p5: { name: 'Maya Saleh', photo: null, city: 'Damascus', skills: ['Photography'], phone: '+963955555555' },
}

/**
 * يضيف سجل مشاركة جديد لحظة ما متطوع (بوضع Mock) يضغط "Confirm & Join" —
 * هاي الدالة بالذات هي يلي بتربط انضمام المتطوع فعليًا بقائمة
 * المتقدمين يلي بتشوفها المنظمة، بدل ما يضلّوا معزولين عن بعض.
 * @param {{opportunityId: string, committedHours: number, volunteerProfile: object}} params
 * @returns {object} سجل المشاركة الجديد
 */
export function addMockParticipation({ opportunityId, committedHours, volunteerProfile }) {
  const participation = {
    id: `p${Date.now()}`,
    opportunityId,
    status: PARTICIPATION_STATUS.PENDING,
    committedHours,
    hoursLogged: null,
    joinedDate: new Date().toISOString().slice(0, 10),
  }

  MOCK_PARTICIPATIONS.push(participation)
  MOCK_APPLICANT_PROFILES[participation.id] = volunteerProfile

  return participation
}