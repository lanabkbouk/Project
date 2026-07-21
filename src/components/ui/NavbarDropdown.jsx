import { ChevronDown } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function NavbarDropdown({
  trigger,
  items = [],
  header = null,
  isOpen,
  setIsOpen,
  width = "w-56",
  align = "right",
  className = "",
}) {
  const alignStyles = {
    right: "right-0",
    left: "left-0",
  };

  return (
    <div className={`relative ${className}`}>
      {/* Trigger */}
      {trigger ? (
        <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer select-none">
          {trigger}
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="
            flex items-center gap-2
            text-white bg-gray-800
            hover:bg-gray-700
            border border-gray-600
            font-medium text-[14px]
            px-4 py-2.5
            rounded-[30px]
            transition
          "
        >
          <span>Profile</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      )}

      {/* Menu */}
      {isOpen && (
        <div
          className={`
            absolute ${alignStyles[align]} ${width}
            mt-2 z-50
            bg-[#1A1A1A]
            border border-white/10
            rounded-lg
            shadow-xl
          `}
        >
          {/* Header */}
          {header && (
            <div className="px-4 py-3 border-b border-white/10">
              {header}
            </div>
          )}

          {/* Items */}
          <div className="py-2">
            {items.map((item) => {
              const isLogout = item.name === "Logout";

              const baseClasses =
                "w-full flex items-center gap-3 px-4 py-2 text-sm transition";
              const textClasses = isLogout
                ? "text-red-400 hover:bg-red-500/10"
                : "text-gray-300 hover:bg-primary/20 hover:text-white";
              const iconClasses = isLogout
                ? "w-4 h-4 text-red-400"
                : "w-4 h-4 text-gray-300";

              const content = (
                <>
                  {item.icon && <item.icon className={iconClasses} />}
                  <span>{item.name}</span>
                </>
              );

              return item.href ? (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={item.onClick}
                  className={`${baseClasses} ${textClasses} ${
                    isLogout ? "border-t border-white/10 mt-1 pt-2" : ""
                  }`}
                >
                  {content}
                </NavLink>
              ) : (
                <button
                  key={item.name}
                  onClick={item.onClick}
                  className={`${baseClasses} ${textClasses} ${
                    isLogout ? "border-t border-white/10 mt-1 pt-2" : ""
                  }`}
                >
                  {content}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}