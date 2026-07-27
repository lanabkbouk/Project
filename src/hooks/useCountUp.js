// hooks/useCountUp.js
//
// يحرّك رقم من 0 لحد القيمة الفعلية بشكل تصاعدي لما يظهر العنصر على الشاشة.
// حركة واحدة مقصودة (بدل ما نبعثر أنيميشن بكل مكان)، ومحترمة لإعدادات

import { useEffect, useRef, useState } from 'react'

/**
 * @param {number} targetValue - الرقم النهائي
 * @param {number} [durationMs=1200]
 */
export function useCountUp(targetValue, durationMs = 1200) {
  const [displayValue, setDisplayValue] = useState(0)
  const elementRef = useRef(null)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion || !targetValue) {
      setDisplayValue(targetValue || 0)
      return
    }

    const node = elementRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()

        const startTime = performance.now()

        function tick(now) {
          const progress = Math.min((now - startTime) / durationMs, 1)
          // easing بسيط (ease-out) حتى الحركة تبطّئ بالنهاية بدل توقف مفاجئ
          const eased = 1 - Math.pow(1 - progress, 3)
          setDisplayValue(Math.round(eased * targetValue))
          if (progress < 1) requestAnimationFrame(tick)
        }

        requestAnimationFrame(tick)
      },
      { threshold: 0.3 }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [targetValue, durationMs])

  return { displayValue, elementRef }
}