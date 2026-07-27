import { useCountUp } from '../../hooks/useCountUp'

export default function StatCard({ number, label }) {
  const { displayValue, elementRef } = useCountUp(number)

  return (
    <div
      ref={elementRef}
      className="bg-bg rounded-xl p-8 text-center border border-heading/10 shadow-sm hover:shadow-md transition-all"
    >
      <div className="text-4xl font-bold text-primary mb-3">
        {displayValue}+
      </div>

      <p className="text-heading/70 text-sm font-medium leading-relaxed">
        {label}
      </p>
    </div>
  )
}
