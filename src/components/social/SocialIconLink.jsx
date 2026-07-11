export default function SocialIconLink({ Icon, label, href = '#', className = '', accentClass = '', hoverClass = '' }) {
  return (
    <a
      aria-label={label}
      className={`group inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 text-white transition duration-200 ease-out ${accentClass} ${hoverClass} hover:-translate-y-0.5 hover:scale-105 ${className}`}
      href={href}
    >
      {Icon ? <Icon className='h-5 w-5 drop-shadow-sm transition-transform duration-200 group-hover:scale-110' /> : null}
    </a>
  )
}