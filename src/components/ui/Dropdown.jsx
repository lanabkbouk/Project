import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Dropdown({
  label = "Select",
  items = [],
  onItemClick,
  value,
  onChange,
  placeholder = "",
  icon: Icon = null,
  error = "",
  variant = "filled",
  as = "div",
  className = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isSelectionMode = typeof onChange === "function";
  const selectedItem = isSelectionMode
    ? items.find((i) => i.value === value)
    : null;

  const triggerText = selectedItem ? selectedItem.name : placeholder || label;

  const handleItemClick = (item) => {
    if (isSelectionMode) {
      onChange(item.value);
    }
    onItemClick?.(item);
    setIsOpen(false);
  };

  const Root = as;

  return (
    <Root ref={rootRef} className={`relative w-full ${className}`}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex items-center justify-between w-full gap-2 
          px-4 py-3 rounded-xl bg-white shadow-sm 
          hover:shadow-md transition-all duration-300 
          border ${error ? "border-red-500" : "border-black/10"}`}
      >
        <span className="flex items-center gap-2 truncate">
          {Icon && (
            <Icon
              size={18}
              className={error ? "text-red-500" : "text-primary"}
            />
          )}
          <span className={!selectedItem ? "text-black/40" : ""}>
            {triggerText}
          </span>
        </span>

        <ChevronDown
          size={16}
          className={`transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          } text-black/40`}
        />
      </button>

      {/* Menu */}
      <div
        className={`absolute z-20 mt-2 w-full overflow-hidden 
          transition-all duration-300 ease-out
          ${isOpen ? "max-h-72 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <ul
          className="py-2 px-1 space-y-1 text-sm font-medium 
            rounded-xl backdrop-blur-md bg-white/80 
            border border-black/10 shadow-lg max-h-64 overflow-y-auto"
        >
          {items.map((item) =>
            item.href ? (
              <li key={item.name}>
                <NavLink
                  to={item.href}
                  onClick={() => handleItemClick(item)}
                  className="block px-4 py-3 hover:bg-primary hover:text-white rounded-md transition-colors"
                >
                  {item.name}
                </NavLink>
              </li>
            ) : (
              <li key={item.value ?? item.name}>
                <button
                  type="button"
                  onClick={() => handleItemClick(item)}
                  className={`w-full text-left block px-4 py-3 rounded-md transition-colors ${
                    selectedItem?.value === item.value
                      ? "bg-primary/15 text-primary border border-primary/30"
                      : "hover:bg-primary/10 hover:text-primary"
                  }`}
                >
                  {item.name}
                </button>
              </li>
            )
          )}
        </ul>
      </div>

      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </Root>
  );
}
