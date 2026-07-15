export default function Input({
  label,
  name,
  register,
  registerOptions,
  type = "text",
  placeholder = "",
  size = "medium",
  variant = "default",
  fullWidth = false,
  disabled = false,
  className = "",
  error = "",
  success = false,
  ...props
}) {
  const sizeStyles = {
    small: "px-3 py-2 text-sm",
    medium: "px-4 py-3 text-base",
    large: "px-5 py-4 text-lg",
  };
  const variantStyles = {
    default:
      "w-full px-4 py-3 bg-black border rounded-lg text-white placeholder-white/50 transition focus:outline-none focus:border-[#FD7E14]",
    filled:
      "w-full px-4 py-3 bg-white border border-black/15 rounded-lg text-black transition focus:outline-none focus:border-[#FD7E14]",
    underline:
      "w-full px-4 py-3 border-0 border-b-2 border-gray-300 rounded-none bg-transparent text-black transition focus:border-primary",
    danger:
      "w-full px-4 py-3 border border-red-500 bg-red-50 text-red-700 rounded-lg transition focus:border-red-600",
    success:
      "w-full px-4 py-3 border border-green-500 bg-green-50 text-green-700 rounded-lg transition focus:border-green-600",
  };

  const textColorStyles = {
    default: "text-white placeholder-white/50",
    success: "text-green-700 placeholder-green-400",
    danger: "text-black placeholder-black/40",
  };

  const appliedVariant = error ? "danger" : success ? "success" : variant;

  const borderColorClass =
    variant === "default" ? (error ? "border-red-500" : "border-white/20") : "";

  const classes = [
    "w-full px-4 py-3 rounded-lg transition  focus:outline-none focus:ring-0",
    sizeStyles[size],
    variantStyles[appliedVariant],
    textColorStyles[appliedVariant],
    borderColorClass,
    disabled ? "opacity-50 cursor-not-allowed" : "focus:ring-2",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={`flex flex-col gap-1  ${fullWidth ? "w-full" : ""}`}>
      {label && (
        <label htmlFor={name} className="mb-1 text-sm font-medium">
          {label}
        </label>
      )}

      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        className={classes}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
        {...(register ? register(name, registerOptions) : {})}
        {...props}
      />

      {error && (
        <p id={`${name}-error`} className="mt-1 text-xs text-danger">
          {error}
        </p>
      )}
      {/* {success && !error && <p className="text-green-600 text-xs mt-1">Looks good</p>} */}
    </div>
  );
}
