const iconBaseClass = 'h-5 w-5'

export function FacebookIcon({ className = iconBaseClass }) {
  return (
    <svg aria-hidden='true' className={className} viewBox='0 0 24 24' fill='currentColor'>
      <path d='M13.5 9H16V6h-2.5c-2 0-3.5 1.6-3.5 3.75V12H8v3h2v7h3v-7h2.4l.6-3H13v-2.1c0-.7.4-.9.5-.9Z' />
    </svg>
  )
}

export function InstagramIcon({ className = iconBaseClass }) {
  return (
    <svg aria-hidden='true' className={className} viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round'>
      <rect x='4' y='4' width='16' height='16' rx='4' />
      <circle cx='12' cy='12' r='3.5' />
      <circle cx='17' cy='7' r='1' fill='currentColor' stroke='none' />
    </svg>
  )
}

export function LinkedInIcon({ className = iconBaseClass }) {
  return (
    <svg aria-hidden='true' className={className} viewBox='0 0 24 24' fill='currentColor'>
      <path d='M6.5 8.5A1.75 1.75 0 1 1 6.5 5a1.75 1.75 0 0 1 0 3.5ZM5 21V9h3v12H5Zm5 0V9h2.9v1.7h.1c.6-1 1.9-2.1 4-2.1 3 0 4 2 4 4.8V21h-3v-6.2c0-1.5 0-3.4-2.1-3.4s-2.4 1.6-2.4 3.3V21h-3Z' />
    </svg>
  )
}

const socialIcons = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  linkedin: LinkedInIcon,
}

export function SocialIconLink({ icon, label, href = '#', className = '', accentClass = '', hoverClass = '' }) {
  const Icon = socialIcons[icon]

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