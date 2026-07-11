import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import Button from '../../components/ui/Button'
import MobileMenu from './MobileMenu'
import { ROUTES } from '../../app/routes/paths'

const links = [
  { name: 'Home', href: ROUTES.HOME },
  { name: 'About', href: ROUTES.ABOUT },
  { name: 'Profile', href: ROUTES.ORGANIZATION_PROFILE },
]

const actions = [
  { label: 'Dashboard', href: ROUTES.ORGANIZATION_PROFILE, variant: 'primary' },
]

const homeLinkClass = ({ isActive }) =>
  `relative inline-flex w-fit text-sm font-medium transition after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 hover:after:scale-x-100 ${
    isActive ? 'text-primary' : 'text-slate-700 hover:text-primary'
  }`

const otherLinkClass = ({ isActive }) =>
  `text-sm font-medium transition ${isActive ? 'text-primary' : 'text-slate-700 hover:text-primary'}`

export default function OrgNavbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className='sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur'>
      <div className='mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8'>
        <NavLink to={ROUTES.HOME} className='flex items-center gap-2 text-lg font-semibold text-heading'>
          <span className='flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-white'>V</span>
          Volunteer Hub
        </NavLink>

        <nav className='hidden items-center gap-6 lg:flex'>
          {links.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              className={link.name === 'Home' ? homeLinkClass : otherLinkClass}
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        <div className='hidden items-center gap-2 lg:flex'>
          {actions.map((action) => (
            <NavLink key={action.href} to={action.href}>
              <Button variant={action.variant}>{action.label}</Button>
            </NavLink>
          ))}
        </div>

        <button
          className='rounded-2xl p-2 text-slate-700 hover:bg-slate-100 lg:hidden'
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label='Toggle menu'
        >
          {isOpen ? <X className='h-5 w-5' /> : <Menu className='h-5 w-5' />}
        </button>
      </div>

      <MobileMenu isOpen={isOpen} onClose={() => setIsOpen(false)} links={links} actions={actions} />
    </header>
  )
}
