import { useQuery } from '@tanstack/react-query'
import { fetchOrganizationProfile } from '../../services/organization'
import { isMockMode } from '../../services/api/mockMode'
import { queryKeys } from '../../app/queryKeys'

/**
 * يجلب بروفايل المنظمة المسجّلة دخولها حاليًا. المفتاح لازم يرتبط
 * بمعرّف المنظمة نفسه حتى ما يصير cache collision بين أكثر من منظمة أو
 * بين جلسة فيها منظمة وأخرى بدونها.
 *
 * ⚠️ enabled: بوضع الباك اند الحقيقي (real)، organizationId إجباري فعليًا
 * (بيدخل برابط الـ URL /organizations/{id})، فلازم ننتظره قبل ما نطلق
 * أي طلب. لكن بوضع mock، fetchOrganizationProfile أصلًا بيدوّر عن
 * الحساب بالإيميل المخزّن بالجلسة، مش بالـ organizationId — فتعطيل
 * الاستعلام لحد ما توصل organizationId كان عم يمنع الطلب بصمت لأي حساب
 * قديم أو حساب اتسجّل بلحظة كان فيها خلل مؤقت بتوليد الـ ID، رغم إنه
 * البيانات الفعلية موجودة وجاهزة تنجلب أصلًا.
 */
export function useOrganizationProfileQuery(organizationId) {
  return useQuery({
    queryKey: queryKeys.organization.profile(organizationId),
    queryFn: () => fetchOrganizationProfile(organizationId),
    enabled: isMockMode() || Boolean(organizationId),
  })
}