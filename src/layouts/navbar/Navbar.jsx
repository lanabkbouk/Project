import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { LogIn, Menu, UserPlus, X ,UserIcon , LogOut , ChevronDown } from 'lucide-react'
import { ROUTES } from '../../app/routes/paths'
 import { linksByRole } from '../../constants/navLinks'
import LogoIcon from '../../components/ui/LogoIcon'
import Button from '../../components/ui/Button'
import NavbarDropdown from '../../components/ui/NavbarDropdown'
import { useSelector , useDispatch} from 'react-redux'
import { logout } from '../../app/redux/authSlice'

export default function Navbar({ role = 'guest' }) {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false)
  
  // 
  const { user, accountType, isAuthenticated } = useSelector((state) => state.auth);
  const [isProfileOpen , setIsProfileOpen] = useState(false)
    //لتسجيل الخروج 
    const handleLogout = () => {
      dispatch(logout());        // يمسح Redux + LocalStorage
      navigate(ROUTES.HOME);    // يعيد التوجيه لصفحة تسجيل الدخول
    };


  // Combine fixed links (Home, About) with role-based links
  const baseLinks = [
    { name: 'Home', href: ROUTES.HOME },
    { name: 'About Us', href: ROUTES.ABOUT },
  ]
  
  const roleLinks = linksByRole[role]  || [] 
  const allLinks = [...baseLinks, ...roleLinks]

  const homeLinkClass = ({ isActive }) =>
    `relative inline-flex w-fit py-2 transition duration-300 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-[#FD7E14] after:transition-transform after:duration-300 hover:after:scale-x-100 ${
      isActive ? 'text-primary' : 'text-white hover:text-primary'
    }`

  const otherLinkClass = ({ isActive }) =>
    `block py-2 px-3 md:p-0 transition duration-300 ${isActive ? 'text-primary' : 'text-white hover:text-primary'}`

  return (
    <nav className='top-0 z-50 w-full bg-black'>
      <div className='mx-auto max-w-7xl px-6 py-4'>
        <div className='flex items-center justify-between'>
          <NavLink to={ROUTES.HOME} className='flex items-center space-x-3 rtl:space-x-reverse'>
            <LogoIcon className='h-6 w-6' />
            <span className='self-center whitespace-nowrap text-2xl font-semibold text-white'>Charity</span>
          </NavLink>


          <div className="flex items-center gap-3 md:order-2">

  {/* إذا المستخدم غير مسجّل */}
            {!isAuthenticated ? (
              <>
                {/* Create Account Desktop */}
                <Button
                  onClick={() => navigate(ROUTES.REGISTER)}
                  className="hidden md:flex items-center gap-2 rounded-2xl bg-primary px-5 py-2.5 text-[15px] font-medium text-white transition hover:opacity-90"
                  variant="primary"
                  size="medium"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Create Account</span>
                </Button>

                {/* Create Account Mobile */}
                <Button
                  onClick={() => navigate(ROUTES.REGISTER)}
                  className="flex md:hidden items-center gap-2 rounded-2xl bg-primary px-4 py-2.5 text-[14px] font-medium text-white transition hover:opacity-90"
                  variant="primary"
                  size="medium"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Create Account</span>
                </Button>

                {/* Sign In Desktop */}
                <Button
                  onClick={() => navigate(ROUTES.LOGIN)}
                  className="hidden lg:flex items-center gap-2 border-primary rounded-2xl bg-black px-5 py-2.5 text-[15px] font-medium text-white transition hover:opacity-90"
                  variant="ghost"
                  size="medium"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Sign In</span>
                </Button>

                {/* Sign In Mobile */}
                <Button
                  onClick={() => navigate(ROUTES.LOGIN)}
                  className="flex md:hidden items-center gap-2 border-primary rounded-2xl bg-black px-4 py-2.5 text-[14px] font-medium text-white transition hover:opacity-90"
                  variant="ghost"
                  size="medium"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Sign In</span>
                </Button>
              </>
            ) : (
              /* إذا المستخدم مسجّل → Dropdown */
              <div className="relative">
                <NavbarDropdown
                  isOpen={isProfileOpen}
                  setIsOpen={setIsProfileOpen}
                  trigger={
                    <button className="flex items-center gap-2 rounded-full px-3 py-2 text-white cursor-pointer transition-colors duration-200 hover:bg-white/10">
                      <UserIcon className="h-5 w-5" />
                      <span className="text-sm sm:text-base">{user?.name || "User"}</span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isProfileOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  }
                  items={[
                    {
                      name: "My Profile",
                      href:
                        accountType === "volunteer"
                          ? ROUTES.VOLUNTEER_PROFILE
                          : ROUTES.ORGANIZATION_PROFILE,
                    },
                    {
                      name: "Logout",
                      icon: LogOut,
                      onClick: handleLogout,
                    },
                  ]}
                />
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-white focus:outline-none md:hidden"
              aria-label="Toggle menu"
              variant="ghost"
              size="small"
            >
              {isOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
            </Button>

          </div>



          <div className='hidden items-center md:order-1 md:flex md:w-auto'>
            <ul className='flex flex-row items-center space-x-8 font-medium text-[16px] rtl:space-x-reverse'>
              {allLinks.map((link) => (
                <li key={link.name}>
                  <NavLink to={link.href} className={link.name === 'Home' ? homeLinkClass : otherLinkClass}>
                    {link.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={`overflow-hidden transition-all duration-300 ease-in-out md:hidden ${isOpen ? 'mt-4 max-h-150 pb-4 opacity-100' : 'max-h-0 opacity-0'}`}>
          <ul className='flex flex-col items-start space-y-1 border-t border-white/10 pt-4 font-medium text-[15px]'>
            {allLinks.map((link) => (
              <li key={link.name} className='w-full'>
                <NavLink 
                  to={link.href} 
                  onClick={() => setIsOpen(false)} 
                  className={({ isActive }) => `block w-full px-3 py-3 transition duration-300 ${isActive ? 'text-primary' : 'text-white'}`}
                >
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

