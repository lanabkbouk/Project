// services/dashboard.js
//
// ما في Endpoint واحد جاهز يرجّع "إحصائيات لوحة تحكم المنظمة" مباشرة،
// فهاد الملف يجمّع (يـ Compose) بيانات موجودة أصلاً بخدمتين منفصلتين
// (fetchMyOpportunities + fetchApplicantsForOpportunity لكل فرصة) ويحسب
// منها الإحصائيات والنشاطات الأخيرة — بدل ما هالحسبة تصير جوا الصفحة.
//
// لما يجهز endpoint حقيقي بالباك اند (مثلاً GET /organizations/me/dashboard)
// بيصير التبديل هون بس بمكان واحد، بدون ما تتغيّر صفحة الداشبورد نفسها.

import { fetchMyOpportunities } from './opportunities'
import { fetchApplicantsForOpportunity } from './participations'
import { OPPORTUNITY_STATUS } from '../constants/opportunityStatus'
import { PARTICIPATION_STATUS } from '../constants/participationStatus'

/**
 * @typedef {Object} OrganizationDashboardData
 * @property {number} totalOpportunities
 * @property {number} openOpportunities
 * @property {number} totalVolunteers
 * @property {number} pendingRequests
 * @property {number} completionRate - نسبة مئوية (0-100)
 * @property {Array<{id:string, title:string, currentVolunteers:number, maxVolunteers:number}>} opportunitiesBreakdown
 * @property {Array<{id:string, volunteerName:string, opportunityTitle:string, status:string, date:string}>} recentActivity
 */

/**
 * يجلب ويجمّع كل بيانات لوحة تحكم المنظمة الحالية.
 * @param {string} organizationId - هوية المنظمة الحالية (من AuthContext)
 * @returns {Promise<{success: boolean, data?: OrganizationDashboardData, error?: string}>}
 */
export async function fetchOrganizationDashboard(organizationId) {
  try {
    const opportunities = await fetchMyOpportunities(organizationId)

    if (opportunities.length === 0) {
      return {
        success: true,
        data: {
          totalOpportunities: 0,
          openOpportunities: 0,
          totalVolunteers: 0,
          pendingRequests: 0,
          completionRate: 0,
          opportunitiesBreakdown: [],
          recentActivity: [],
        },
      }
    }

    // نجيب المتقدّمين لكل فرصة بالتوازي (Promise.all) بدل واحد ورا الثاني
    const applicantsPerOpportunity = await Promise.all(
      opportunities.map((opportunity) => fetchApplicantsForOpportunity(opportunity.id)),
    )

    const totalOpportunities = opportunities.length
    // "مفتوحة" هلق تعني فعليًا registration_open بس (لسا تقبل متطوعين
    // جدد) — قيد العمل ما بتُحسب هون لأنها ما عادت تقبل تسجيل جديد
    const openOpportunities = opportunities.filter(
      (item) => item.status === OPPORTUNITY_STATUS.REGISTRATION_OPEN,
    ).length
    const completedOpportunities = opportunities.filter(
      (item) => item.status === OPPORTUNITY_STATUS.COMPLETED,
    ).length

    const totalVolunteers = opportunities.reduce(
      (sum, item) => sum + (Number(item.currentVolunteers) || 0),
      0,
    )

    const allApplicants = applicantsPerOpportunity.flat()
    const pendingRequests = allApplicants.filter(
      (applicant) => applicant.status === PARTICIPATION_STATUS.PENDING,
    ).length

    // معدل اكتمال الفرص: نسبة الفرص "المنتهية فعليًا" (completed) من
    // إجمالي الفرص المنشورة — بدل نسبة "غير المفتوحة" سابقًا، يلي كانت
    // بتحسب الفرص "قيد العمل" خطأً كـ "منتهية"
    const completionRate = Math.round((completedOpportunities / totalOpportunities) * 100)

    const opportunitiesBreakdown = opportunities.map((opportunity) => ({
      id: opportunity.id,
      title: opportunity.title,
      currentVolunteers: Number(opportunity.currentVolunteers) || 0,
      maxVolunteers: Number(opportunity.maxVolunteers) || 0,
    }))

    // نبني قائمة نشاطات موحّدة (طلب مشاركة لكل متقدّم) ونرتّبها بالأحدث أولًا
    const recentActivity = opportunities
      .flatMap((opportunity, index) =>
        applicantsPerOpportunity[index].map((applicant) => ({
          id: applicant.id,
          volunteerName: applicant.volunteer?.name || 'A volunteer',
          opportunityTitle: opportunity.title,
          status: applicant.status,
          date: applicant.participatedAt,
        })),
      )
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5)

    return {
      success: true,
      data: {
        totalOpportunities,
        openOpportunities,
        totalVolunteers,
        pendingRequests,
        completionRate,
        opportunitiesBreakdown,
        recentActivity,
      },
    }
  } catch (error) {
    return {
      success: false,
      error: error?.message || 'Unable to load dashboard data',
    }
  }
}