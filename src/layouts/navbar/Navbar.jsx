import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LogIn,
  Menu,
  UserPlus,
  X,
  UserIcon,
  LogOut,
  ChevronDown,
} from "lucide-react";

import { ROUTES } from "../../constants/paths";
import { ACCOUNT_TYPES } from "../../constants/auth/accountTypes";
import { linksByRole } from "../../constants/navLinks";

import LogoIcon from "../../components/ui/LogoIcon";
import Button from "../../components/ui/Button";
import NavbarDropdown from "../../components/ui/NavbarDropdown";
import { useAuth } from "../../context/AuthContext";

export default function Navbar({ role = "guest" }) {
  const navigate = useNavigate();
  const { user, accountType, isAuthenticated, logout } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate(ROUTES.HOME);
  };

  const baseLinks = [
    { name: "Home", href: ROUTES.HOME },
    { name: "About Us", href: ROUTES.ABOUT },
  ];

  const roleLinks = linksByRole[role] || [];
  const allLinks = [...baseLinks, ...roleLinks];

  const linkClass = ({ isActive }) =>
    `relative inline-flex py-2 transition duration-300 ${
      isActive ? "text-primary" : "text-white hover:text-primary"
    }`;

  return (
    <nav className="top-0 z-50 w-full bg-black border-b border-white/10">
      <div className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex items-center justify-between">

          {/* Logo */}
          <NavLink to={ROUTES.HOME} className="flex items-center gap-3">
            <LogoIcon className="h-6 w-6" />
            <span className="text-2xl font-semibold text-white">
              Volunteer Platform
            </span>
          </NavLink>

          {/* Right Section */}
          <div className="flex items-center gap-3 md:order-2">

            {!isAuthenticated ? (
              <div className="flex items-center gap-3">

                {/* Create Account */}
                <Button
                  onClick={() => navigate(ROUTES.REGISTER)}
                  variant="primary"
                  size="medium"
                  className="flex items-center gap-2 rounded-2xl px-5 py-2.5 
                             text-[15px] font-medium shadow-sm hover:shadow-md 
                             border border-primary/40"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Create Account</span>
                </Button>

                {/* Sign In */}
                <Button
                  onClick={() => navigate(ROUTES.LOGIN)}
                  variant="ghost"
                  size="medium"
                  className="
                    hidden lg:flex items-center gap-2
                    rounded-2xl
                    bg-black
                    text-white
                    border border-primary
                    px-5 py-2.5 text-[15px] font-medium
                    transition hover:opacity-90
                  "
                >
                  <LogIn className="h-4 w-4" />
                  <span>Sign In</span>
                </Button>


              </div>
            ) : (
              <div className="relative">
                <NavbarDropdown
                  isOpen={isProfileOpen}
                  setIsOpen={setIsProfileOpen}
                  trigger={
                    <div className="flex items-center gap-2 rounded-2xl px-3 py-2 
                                    bg-white/10 border border-white/15
                                    text-white hover:bg-white/15 hover:border-white/25 
                                    transition">
                      {user?.avatarUrl ? (
                        <img
                          src={user.avatarUrl}
                          alt={user.displayName}
                          className="h-7 w-7 rounded-full object-cover border-2 border-primary/70"
                        />
                      ) : (
                        <div className="h-7 w-7 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
                          <UserIcon className="h-4 w-4 text-primary" />
                        </div>
                      )}
                      <span className="text-sm sm:text-base">
                        {user?.displayName}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-white/60 transition-transform ${
                          isProfileOpen ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  }
                  items={[
                    {
                      name: "My Profile",
                      href:
                        accountType === ACCOUNT_TYPES.VOLUNTEER
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
              variant="ghost"
              size="small"
              className="p-2 rounded-xl bg-heading/10 text-white 
                         hover:bg-heading/20 md:hidden"
            >
              {isOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </Button>

          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex md:w-auto md:order-1">
            <ul className="flex flex-row items-center gap-8 font-medium text-[16px]">
              {allLinks.map((link) => (
                <li key={link.name}>
                  <NavLink to={link.href} className={linkClass}>
                    {link.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`overflow-hidden transition-all duration-300 md:hidden ${
            isOpen ? "mt-4 max-h-150 pb-4 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <ul className="flex flex-col items-start space-y-1 border-t border-white/10 pt-4 font-medium text-[15px]">
            {allLinks.map((link) => (
              <li key={link.name} className="w-full">
                <NavLink
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `block w-full px-3 py-3 transition ${
                      isActive ? "text-primary" : "text-white"
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}