import { useCallback, useState } from 'react'

/**
 * نقطة إدارة الحالة الموحّدة لأي Toast بصفحة واحدة — بدل ما كل صفحة تعرّف
 * useState منفصل لكل من (submitError, successMessage) وتكرّر نفس منطق
 * الفتح/الإغلاق. صفحة واحدة = Toast واحد نشط بأي لحظة، فمعرّف نوع
 * الرسالة (variant) بدل حقلين منفصلين كافي وأبسط.
 *
 * @param {{message?: string, variant?: 'success'|'error'|'info'}} [initial]
 */
export function useToast(initial = { message: '', variant: 'info' }) {
  const [toast, setToast] = useState(initial)

  const showToast = useCallback((message, variant = 'info') => {
    setToast({ message, variant })
  }, [])

  const showSuccess = useCallback((message) => showToast(message, 'success'), [showToast])
  const showError = useCallback((message) => showToast(message, 'error'), [showToast])

  const closeToast = useCallback(() => {
    setToast((prev) => ({ ...prev, message: '' }))
  }, [])

  return { toast, showToast, showSuccess, showError, closeToast }
}