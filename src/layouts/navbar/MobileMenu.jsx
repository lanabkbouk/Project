import { Compass } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import Button from '../../components/ui/Button'

export default function MobileMenu({ isOpen, onClose, links = [], actions = [] }) {
  if (!isOpen) return null

  return (
    <div className='border-t border-slate-200 bg-white lg:hidden'>
      <div className='mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6'>
        <nav className='flex flex-col gap-2'>
          {links.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              onClick={onClose}
              className={({ isActive }) =>
                `rounded-2xl px-3 py-2 text-sm font-medium transition ${
                  isActive ? 'bg-primary/10 text-primary' : 'text-slate-700 hover:bg-slate-100'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        <div className='flex flex-col gap-2'>
          {actions.map((action) => (
            <NavLink key={action.href} to={action.href} onClick={onClose} className='w-full'>
              <Button fullWidth variant={action.variant} size='medium'>
                {action.label}
              </Button>
            </NavLink>
          ))}

          {/* Auth CTAs responsive */}
          <div className='lg:hidden flex flex-col gap-2'>
            <NavLink to='/register' onClick={onClose} className='w-full'>
              <Button fullWidth variant='primary' size='small'>
                Create Account
              </Button>
            </NavLink>

            <NavLink to='/login' onClick={onClose} className='w-full'>
              <Button fullWidth variant='ghost' size='large'>
                Sign In
              </Button>
            </NavLink>
          </div>

        </div>

        <div className='flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600'>
          <Compass className='h-4 w-4 text-primary' />
          Browse opportunities and volunteer programs
        </div>
      </div>
    </div>
  )
}
