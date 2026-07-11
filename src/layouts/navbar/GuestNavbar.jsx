import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { LogIn, Menu, UserPlus, X } from 'lucide-react'
import { ROUTES } from '../../app/routes/paths'

import LogoIcon from '../../components/ui/LogoIcon'
import Button from '../../components/ui/Button'

const links = [

  { name: 'Home', href: ROUTES.HOME },
  { name: 'Opportunities', href: ROUTES.PARTICIPATES },
  { name: 'Organization', href: ROUTES.ORGANIZATION_PROFILE },
  { name: 'About Us', href: ROUTES.ABOUT },
]

// const causeDropdownItems = [
//   { name: 'Medical Aid', href: '/about' },
//   { name: 'Education', href: '/about' },
//   { name: 'Emergency Relief', href: '/about' },
//   { name: 'Environment', href: '/about' },
// ]

export default function GuestNavbar() {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  // const [isDropdownOpen, setIsDropdownOpen] = useState(false)


  const homeLinkClass = ({ isActive }) =>
    `relative inline-flex w-fit py-2 transition duration-300 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-[#FD7E14] after:transition-transform after:duration-300 hover:after:scale-x-100 ${
      isActive ? 'text-[#FD7E14]' : 'text-white hover:text-[#FD7E14]'
    }`

  const otherLinkClass = ({ isActive }) =>
    `block py-2 px-3 md:p-0 transition duration-300 ${isActive ? 'text-[#FD7E14]' : 'text-white hover:text-[#FD7E14]'}`



  return (
    <nav className='top-0 z-50 w-full bg-black'>
      <div className='mx-auto max-w-7xl px-6 py-4'>
        <div className='flex items-center justify-between'>
          <NavLink to={ROUTES.HOME} className='flex items-center space-x-3 rtl:space-x-reverse'>
            <LogoIcon className='h-6 w-6' />
            <span className='self-center whitespace-nowrap text-2xl font-semibold text-white'>Charity</span>
          </NavLink>

          <div className='flex items-center gap-3 md:order-2'>
            <Button
              onClick={() => navigate(ROUTES.REGISTER)}
              className='hidden items-center gap-2 rounded-2xl bg-primary px-5 py-2.5 text-[15px] font-medium text-white transition hover:opacity-90 md:flex'
              variant='primary'
              size='medium'
            >
              <UserPlus className='h-4 w-4' />
              <span>Create Account</span>
            </Button>

            <Button
              onClick={() => navigate(ROUTES.REGISTER)}
              className='flex items-center gap-2 rounded-2xl bg-primary px-4 py-2.5 text-[14px] font-medium text-white transition hover:opacity-90 md:hidden'
              variant='primary'
              size='medium'
            >
              <UserPlus className='h-4 w-4' />
              <span>Create Account</span>
            </Button>

            <Button
              onClick={() => navigate(ROUTES.LOGIN)}
              className='hidden items-center gap-2 border-primary rounded-2xl bg-black px-5 py-2.5 text-[15px] font-medium text-white transition hover:opacity-90 lg:flex'
              variant='ghost'
              size='medium'
            >
              <LogIn className='h-4 w-4' />
              <span>Sign In</span>
            </Button>

            <Button
              onClick={() => navigate(ROUTES.LOGIN)}
              className='flex items-center gap-2 border-primary rounded-2xl bg-black px-4 py-2.5 text-[14px] font-medium text-white transition hover:opacity-90 md:hidden'
              variant='ghost'
              size='medium'
            >
              <LogIn className='h-4 w-4' />
              <span>Sign In</span>
            </Button>


            <Button
              onClick={() => setIsOpen(!isOpen)}
              className='p-2 text-white focus:outline-none md:hidden'
              aria-label='Toggle menu'
              variant='ghost'
              size='small'
            >
              {isOpen ? <X className='h-8 w-8' /> : <Menu className='h-8 w-8' />}
            </Button>
          </div>

          <div className='hidden items-center md:order-1 md:flex md:w-auto'>
            <ul className='flex flex-row items-center space-x-8 font-medium text-[16px] rtl:space-x-reverse'>
              <li>
                <NavLink to={ROUTES.HOME} className={homeLinkClass}>
                  Home
                </NavLink>
              </li>

              {links.filter((link) => link.name !== 'Home').map((link) => {
                return (
                  <li key={link.name}>
                    <NavLink to={link.href} className={otherLinkClass}>
                      {link.name}
                    </NavLink>
                  </li>
                )
              })}
          
            </ul>
          </div>
        </div>

        <div className={`overflow-hidden transition-all duration-300 ease-in-out md:hidden ${isOpen ? 'mt-4 max-h-150 pb-4 opacity-100' : 'max-h-0 opacity-0'}`}>
          <ul className='flex flex-col items-start space-y-1 border-t border-white/10 pt-4 font-medium text-[15px]'>
            <li className='w-full'>
              <NavLink to={ROUTES.HOME} onClick={() => setIsOpen(false)} className={({ isActive }) => `block w-full px-3 py-3 transition duration-300 ${isActive ? 'text-primary' : 'text-white'}`}>
                Home
              </NavLink>
            </li>

            {/* <li className='w-full'>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className='flex w-full items-center justify-between gap-1 px-3 py-3 text-white transition duration-300 hover:text-[#FD7E14]'
              >
                <span>Cause</span>
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <div className={`overflow-hidden transition-all duration-200 ${isDropdownOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'}`}>
                <ul className='mx-2 rounded-lg bg-[#1A1A1A] py-1 text-sm font-medium text-gray-300'>
                  {causeDropdownItems.map((item) => (
                    <li key={item.name}>
                      <NavLink to={item.href} onClick={() => setIsOpen(false)} className='block rounded-md px-4 py-3 transition-colors hover:bg-[#FD7E14] hover:text-white'>
                        {item.name}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            </li> */}

            {links.filter((link) => link.name !== 'Home').map((link) => (
              <li key={link.name} className='w-full'>
                <NavLink to={link.href} onClick={() => setIsOpen(false)} className={({ isActive }) => `block w-full px-3 py-3 transition duration-300 ${isActive ? 'text-primary' : 'text-white'}`}>
                  {link.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  )
}
