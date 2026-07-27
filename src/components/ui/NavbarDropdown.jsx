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
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer select-none"
      >
        {trigger}
      </div>

      {/* Menu */}
      {isOpen && (
        <div
          className={`
            absolute ${alignStyles[align]} ${width}
            mt-2 z-50
            bg-bg
            border border-heading/10
            rounded-xl
            shadow-lg
            backdrop-blur-sm
          `}
        >
          {/* Header */}
          {header && (
            <div className="px-4 py-3 border-b border-heading/10">
              {header}
            </div>
          )}

          {/* Items */}
          <div className="py-2">
            {items.map((item) => {
              const isLogout = item.name === "Logout";

              const baseClasses =
                "w-full flex items-center gap-3 px-4 py-2 text-sm transition rounded-lg";

              const textClasses = isLogout
                ? "text-danger hover:bg-danger/10"
                : "text-heading hover:bg-heading/5";

              const iconClasses = isLogout
                ? "w-4 h-4 text-danger"
                : "w-4 h-4 text-heading/70";

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
                    isLogout ? "border-t border-heading/10 mt-1 pt-2" : ""
                  }`}
                >
                  {content}
                </NavLink>
              ) : (
                <button
                  key={item.name}
                  onClick={item.onClick}
                  className={`${baseClasses} ${textClasses} ${
                    isLogout ? "border-t border-heading/10 mt-1 pt-2" : ""
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
