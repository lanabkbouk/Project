import { useEffect, useRef } from 'react'

/**
 * hook لإغلاق أي عنصر (Dropdown / Modal / Menu) عند الضغط خارج حدوده.
 * يُعيد ref يجب ربطه بالعنصر الجذر (الحاوية الخارجية) للمكوّن.
 *
 * @param {boolean} isOpen - هل العنصر مفتوح حاليًا (لا داعي لتسجيل المستمع إن كان مغلقًا)
 * @param {() => void} onClose - الدالة التي تُستدعى عند الضغط خارج العنصر
 */
export default function useClickOutside(isOpen, onClose) {
  const ref = useRef(null)

  useEffect(() => {
    if (!isOpen) return undefined

    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, onClose])

  return ref
}