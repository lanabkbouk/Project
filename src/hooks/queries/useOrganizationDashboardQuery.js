import { useQuery } from '@tanstack/react-query'
import { fetchOrganizationDashboard } from '../../services/dashboard'
import { isMockMode } from '../../services/api/mockMode'
import { queryKeys } from '../../app/queryKeys'

/**
 * يجلب بيانات لوحة تحكم المنظمة المسجّلة دخولها حاليًا (إحصائيات + توزيع
 * فرص + نشاطات). كانت هاي الصفحة الوحيدة بالمشروع يلي بتجيب بياناتها
 * يدويًا عبر useEffect/useState خام بدل useXQuery — القرار كان بيفتح
 * احتمال race condition حقيقي (stale closure لما organizationId يتغيّر
 * بسرعة، مثلًا عند إعادة mount متكررة)، لأن الـ effect القديم ما كان
 * بيلغي الطلب السابق قبل ما يطلق الجديد. useQuery بيحل هاي المشكلة
 * تلقائيًا (cache + retry + إلغاء ضمني للطلبات القديمة عند تغيّر المفتاح).
 *
 * ⚠️ enabled: نفس ملاحظة useOrganizationProfileQuery بالضبط — بوضع mock
 * fetchOrganizationDashboard(→ fetchMyOpportunities) بيدوّر عن الفرص
 * بالجلسة المخزّنة مش بالـ organizationId الممرَّر، فتعطيل الاستعلام لحد
 * ما يوصل organizationId كان رح يمنع الطلب بصمت بوضع mock بينما البيانات
 * جاهزة تنجلب أصلًا.
 *
 * @param {string} organizationId
 */
export function useOrganizationDashboardQuery(organizationId) {
  return useQuery({
    queryKey: queryKeys.organization.dashboard(organizationId),
    queryFn: () => fetchOrganizationDashboard(organizationId),
    enabled: isMockMode() || Boolean(organizationId),
  })
}