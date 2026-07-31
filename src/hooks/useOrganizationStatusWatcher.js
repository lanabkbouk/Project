
// ⚠️ حل مؤقت لعدم وجود نظام تنبيهات حقيقي (Push/WebSocket) بالباك اند حاليًا.
// يراقب حالة توثيق المنظمة بشكل دوري (Polling) طالما الحساب من نوع "organization"
// ولسا الحالة "pending"، ويصدر رسالة Toast فورًا عند أول تغيّر يكتشفه — بغض
// النظر عن الصفحة التي تتصفحها المنظمة حاليًا.
//
// نخزّن "آخر حالة أُعلمت بها المنظمة" بـ localStorage (بمفتاح خاص بإيميلها)
// حتى لا يتكرر نفس الإشعار بعد كل تحديث للصفحة (Refresh).
//
// TODO: لما يتوفر نظام إشعارات حقيقي بالباك (WebSocket/Laravel Echo أو حتى
// endpoint بسيط لآخر الإشعارات)، يُستبدل الـ polling هون فقط بالاشتراك
// الحقيقي، بدون أي تعديل على MainLayout أو على مكوّن Toast نفسه.

import { useEffect, useRef, useState } from 'react'
import { fetchOrganizationProfile } from '../services/organization'
import { ORGANIZATION_STATUS, getOrganizationStatusMeta } from '../constants/organizationStatus'

const POLL_INTERVAL_MS = 45_000
const STORAGE_PREFIX = 'org_last_notified_status:'

function getStorageKey(email) {
  return `${STORAGE_PREFIX}${email}`
}

function readLastNotifiedStatus(email) {
  if (!email) return null
  return localStorage.getItem(getStorageKey(email))
}

function writeLastNotifiedStatus(email, status) {
  if (!email) return
  localStorage.setItem(getStorageKey(email), status)
}

/**
 * @param {{ email: string|null, enabled: boolean }} params
 * enabled = true فقط لما يكون المستخدم مسجّل دخول كمنظمة
 */
export function useOrganizationStatusWatcher({ email, enabled }) {
  const [toast, setToast] = useState(null) // { message, variant } | null
  const lastKnownStatusRef = useRef(null)

  useEffect(() => {
    if (!enabled || !email) return undefined

    let isMounted = true

    async function checkStatus() {
      const result = await fetchOrganizationProfile()
      if (!isMounted || !result.success) return

      const currentStatus = result.data.status

      // أول مرة: نهيّئ المرجع بالحالة الحالية بدون إظهار أي إشعار،
      // ونعتمد أيضًا آخر حالة معروفة بـ localStorage (لو الصفحة أُعيد تحميلها)
      if (lastKnownStatusRef.current === null) {
        lastKnownStatusRef.current = readLastNotifiedStatus(email) || currentStatus
        writeLastNotifiedStatus(email, currentStatus)
        return
      }

      const hasChanged = currentStatus !== lastKnownStatusRef.current
      if (!hasChanged) return

      lastKnownStatusRef.current = currentStatus
      writeLastNotifiedStatus(email, currentStatus)

      // نعرض إشعارًا فقط عند الوصول لحالة نهائية ذات معنى فعلي للمنظمة
      if (currentStatus === ORGANIZATION_STATUS.VERIFIED) {
        setToast({ message: getOrganizationStatusMeta(currentStatus).message, variant: 'success' })
      } else if (currentStatus === ORGANIZATION_STATUS.REJECTED) {
        setToast({ message: getOrganizationStatusMeta(currentStatus).message, variant: 'error' })
      } else if (currentStatus === ORGANIZATION_STATUS.SUSPENDED) {
        setToast({ message: getOrganizationStatusMeta(currentStatus).message, variant: 'error' })
      }
    }

    checkStatus()
    const intervalId = setInterval(checkStatus, POLL_INTERVAL_MS)

    return () => {
      isMounted = false
      clearInterval(intervalId)
    }
  }, [email, enabled])

  return { toast, dismissToast: () => setToast(null) }
}