import { ChevronDown } from 'lucide-react'

export default function Input({
  label,
  name,
  register,
  registerOptions,
  as = 'input',
  type = 'text',
  placeholder = '',
  size = 'medium',
  variant = 'default',
  fullWidth = false,
  disabled = false,
  className = '',
  error = '',
  success = false,
  options = [],
  icon: Icon = null,
  ...props
}) {
  const sizeStyles = {
    small: 'px-3 py-2 text-sm',
    medium: 'px-4 py-3 text-base',
    large: 'px-5 py-4 text-lg',
  }

  const variantStyles = {
    default: "w-full px-4 py-3 bg-black border rounded-lg text-white placeholder-white/50 transition focus:outline-none focus:border-primary",
    filled: "w-full px-4 py-3 bg-white border border-black/15 rounded-lg text-black transition focus:outline-none focus:border-primary",
    underline: "w-full px-4 py-3 border-0 border-b-2 border-gray-300 rounded-none bg-transparent text-black transition focus:border-primary",
    danger: "w-full px-4 py-3 border border-red-500 bg-red-50 text-red-700 rounded-lg transition focus:border-red-600",
    success: "w-full px-4 py-3 border border-green-500 bg-green-50 text-green-700 rounded-lg transition focus:border-green-600"
  }

  const textColorStyles = {
    default: 'text-white placeholder-white/50',
    filled: 'text-black placeholder-black/40',
    underline: 'text-black placeholder-black/40',
    success: 'text-green-700 placeholder-green-400',
    danger: 'text-black placeholder-black/40',
  }

  const appliedVariant = error ? 'danger' : success ? 'success' : variant

  const borderColorClass =
    variant === 'default'
      ? error
        ? 'border-red-500'
        : 'border-white/20'
      : ''

  const classes = [
    'w-full rounded-lg transition focus:outline-none focus:ring-0',
    sizeStyles[size],
    variantStyles[appliedVariant],
    textColorStyles[appliedVariant],
    borderColorClass,
    disabled ? 'opacity-50 cursor-not-allowed' : 'focus:ring-2',
    as === 'select' ? 'appearance-none cursor-pointer pr-10' : '',
    Icon ? 'pl-10' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const sharedProps = {
    id: name,
    name,
    disabled,
    'aria-invalid': Boolean(error),
    'aria-describedby': error ? `${name}-error` : undefined,
    className: classes,
    ...(register ? register(name, registerOptions) : {}),
    ...props,
  }

  const iconColorClass = error ? 'text-red-500' : 'text-primary'

  return (
    <div className={`flex flex-col gap-1 ${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label htmlFor={name} className="mb-1 text-sm font-medium">
          {label}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <Icon
            size={18}
            className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 ${iconColorClass}`}
          />
        )}

        {as === 'select' && (
          <>
            <select {...sharedProps}>
              <option value="" hidden>{placeholder || 'Select an option'}</option>
              {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-black/40"
            />
          </>
        )}

        {as === 'input' && (
          <input type={type} placeholder={placeholder} {...sharedProps} />
        )}
      </div>

      {error && (
        <p id={`${name}-error`} className="mt-1 text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  )
}