// components/common/Badge.jsx
//
// شارة حالة بسيطة، نظيفة، ومتناسقة بصريًا مع بقية التصميم.

const TONE_CLASSES = {
  neutral: "bg-heading/5 text-body border-heading/10",
  primary: "bg-primary/10 text-primary border-primary/30",
  success: "bg-emerald-500/10 text-emerald-700 border-emerald-500/30",
  secondary: "bg-secondary/10 text-secondary border-secondary/30",
  warning: "bg-yellow-500/10 text-yellow-700 border-yellow-500/40",
  danger: "bg-danger/10 text-danger border-danger/40",
  header: "bg-field text-heading border-heading/10"
}

/**
 * @param {string} label
 * @param {'neutral'|'primary'|'secondary'|'warning'|'danger'} [tone='neutral']
 */
export default function Badge({ label, tone = "neutral" }) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border ${TONE_CLASSES[tone]} shadow-sm`}
    >
      {label}
    </span>
  )
}