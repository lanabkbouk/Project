import { ChevronDown } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Dropdown({
  label,
  items = [],
  header = null,
  isOpen,
  setIsOpen,

  width = "w-56",
  align = "right",

  className = "",
  itemClassName = "",
}) {
  const alignStyles = {
    right: "right-0",
    left: "left-0",
  };

  return (
    <div className={`relative ${className}`}>
      
      {/* Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          flex items-center justify-between gap-2
          w-full px-3 py-3
          text-heading
          transition duration-200
          hover:text-primary
        "
      >
        <span>{label}</span>

        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Menu */}
      <div
        className={`
          absolute ${alignStyles[align]} ${width}
          mt-2 z-50
          overflow-hidden
          rounded-2xl
          bg-heading
          border border-bg/10
          shadow-lg
          transition-all duration-200
          ${isOpen ? "max-h-96 opacity-100 visible" : "max-h-0 opacity-0 invisible"}
        `}
      >
        {/* Header */}
        {header && (
          <div className="px-4 py-3 border-b border-bg/10">
            {header}
          </div>
        )}

        {/* Items */}
        <ul className="py-2">
          {items.map((item) => (
            <li key={item.name}>
              {item.href ? (
                <NavLink
                  to={item.href}
                  onClick={item.onClick}
                  className={`
                    flex items-center gap-3
                    px-4 py-2.5
                    text-sm text-bg
                    hover:bg-primary/10 hover:text-primary
                    transition-colors duration-200
                    ${itemClassName}
                  `}
                >
                  {item.icon && <item.icon className="w-4 h-4" />}
                  <span>{item.name}</span>
                </NavLink>
              ) : (
                <button
                  onClick={item.onClick}
                  className={`
                    flex items-center gap-3
                    w-full px-4 py-2.5
                    text-sm text-bg text-left
                    hover:bg-primary/10 hover:text-primary
                    transition-colors duration-200
                    ${itemClassName}
                  `}
                >
                  {item.icon && <item.icon className="w-4 h-4" />}
                  <span>{item.name}</span>
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
