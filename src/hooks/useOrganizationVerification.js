import { useOrganizationProfileQuery } from "./queries/useOrganizationProfileQuery";
import { ORGANIZATION_STATUS, getOrganizationStatusMeta } from "../constants/organizationStatus";

/**
 * يجلب حالة توثيق المنظمة الحالية، ليستخدمه أي صفحة (My Causes، إنشاء/تعديل
 * فرصة، قائمة المتقدمين، الداشبورد) لتعطيل الأزرار الفعلية فقط
 * (نشر/قبول/رفض/حذف/تعديل) دون حجب عرض الصفحة نفسها — المنظمة تشوف كل
 * شيء، وتُمنع فقط من التصرف الفعلي لحد ما تُوثَّق.
 *
 * ملاحظة مهمة: هاد الـ hook ما بيعمل طلب شبكة خاص فيه — هو غلاف رفيع
 * (thin wrapper) فوق useOrganizationProfileQuery، اللي بيعتمد على cache
 * React Query المشترك (queryKeys.organization.profile). هيك كل الصفحات
 * يلي بتستخدمه بتشارك نفس نسخة البيانات، وأي تحديث (مثلاً حفظ البروفايل
 * بصفحة orgProfile) بينعكس تلقائيًا على البقية بدون طلب شبكة إضافي.
 */
export function useOrganizationVerification() {
  const { data, isPending } = useOrganizationProfileQuery();

  // الخدمة بترجع { success, data } دايمًا (ما بترمي استثناء عند الفشل)
  const status = data?.success ? data.data?.status : null;

  return {
    status,
    loading: isPending,
    isVerified: status === ORGANIZATION_STATUS.VERIFIED,
    meta: getOrganizationStatusMeta(status),
  };
}