import { useCountUp } from '../../hooks/useCountUp'
import { CARD_SURFACE, CARD_ELEVATION } from '../../utils/surfaceStyles'

export default function StatCard({ number, label, suffix = '+' }) {
  const { displayValue, elementRef } = useCountUp(number)

  return (
    <div
      ref={elementRef}
      className={`${CARD_SURFACE} ${CARD_ELEVATION} p-8 text-center`}
    >
      <div className="text-4xl font-bold text-primary mb-3">
        {displayValue}{suffix}
      </div>

      <p className="text-heading/70 text-sm font-medium leading-relaxed">
        {label}
      </p>
    </div>
  )
}