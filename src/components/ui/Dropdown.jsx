import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Dropdown({
  label = "Dropdown",
  items = [],
  onItemClick,
  className = "",
}) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <li className={`w-full ${className}`}>
      <button
        onClick={toggleDropdown}
        className="flex items-center justify-between w-full gap-1 text-white hover:text-primary transition duration-300 py-3 px-3"
      >
        <span>{label}</span>

        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-200 ${
          isOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="py-1 text-sm text-gray-300 font-medium bg-heading rounded-lg mx-2">
          {items.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.href}
                onClick={onItemClick}
                className="block px-4 py-3 hover:bg-primary hover:text-white rounded-md transition-colors"
              >
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}
