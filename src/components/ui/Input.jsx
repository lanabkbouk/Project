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
  labelClassName = 'text-heading', // لون الـ label الافتراضي؛ يمكن تجاوزه حسب خلفية الصفحة
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
    default: "bg-bg border border-heading/10 text-heading placeholder-body/60 rounded-xl focus:border-primary",
    filled: "bg-white border border-heading/10 text-heading placeholder-body/60 rounded-xl focus:border-primary",
    underline: "border-0 border-b-2 border-heading/20 bg-transparent text-heading placeholder-body/60 rounded-none focus:border-primary",
    danger: "w-full px-4 py-3 border border-red-500 bg-red-50 text-red-700 rounded-lg transition focus:border-red-600",
    success: "border border-green-600 bg-green-50 text-green-700 rounded-xl focus:border-green-700"
  }

  const appliedVariant = error ? 'danger' : success ? 'success' : variant

  const classes = [
    'w-full transition focus:outline-none',
    sizeStyles[size],
    variantStyles[appliedVariant],
    disabled ? 'opacity-50 cursor-not-allowed' : 'focus:ring-2 focus:ring-primary/30',
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

  const iconColorClass = error ? 'text-danger' : 'text-primary'

  return (
    <div className={`flex flex-col gap-1 ${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label htmlFor={name} className={`mb-1 text-sm font-medium ${labelClassName}`}>
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
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-heading/40"
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