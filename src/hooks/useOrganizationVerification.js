import { useEffect, useState } from "react";
import { fetchOrganizationProfile } from "../services/organization";
import { ORGANIZATION_STATUS, getOrganizationStatusMeta } from "../constants/organizationStatus";

/**
 * يجلب حالة توثيق المنظمة الحالية، ليستخدمه أي صفحة (My Causes، إنشاء/تعديل
 * فرصة، قائمة المتقدمين) لتعطيل الأزرار الفعلية فقط (نشر/قبول/رفض/حذف/تعديل)
 * دون حجب عرض الصفحة نفسها — المنظمة تشوف كل شيء، وتُمنع فقط من التصرف
 * الفعلي لحد ما تُوثَّق.
 */
export function useOrganizationVerification() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    fetchOrganizationProfile().then((result) => {
      if (!isMounted) return;
      if (result.success) setStatus(result.data.status);
      setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    status,
    loading,
    isVerified: status === ORGANIZATION_STATUS.VERIFIED,
    meta: getOrganizationStatusMeta(status),
  };
}