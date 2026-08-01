import { useEffect, useState } from 'react'

/**
 * يرجّع نسخة "متأخرة" من value، ما تتحدث إلا بعد ما تتوقف عن التغيّر
 * لمدة delay — يمنع إرسال طلب API مع كل ضغطة مفتاح أثناء الكتابة بالبحث.
 * @param {*} value
 * @param {number} [delay=300]
 */
export function useDebouncedValue(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timeoutId = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timeoutId)
  }, [value, delay])

  return debouncedValue
}