export default function Button({
  variant = "primary",
  size = "medium",
  children,
  onClick,
  disabled = false,
  fullWidth = false,
  className = "",
  type = "button",
  isLoading = false, // الحالة الجديدة
  loadingText = "Saving...", // نص التحميل الافتراضي
  ...props
}) {
  const variantStyles = {
    primary: "bg-primary hover:opacity-80 text-bg",
    secondary: "bg-black hover:bg-gray-700 text-white",
    ghost: "bg-bg border-2 border-heading text-heading hover:bg-zinc-800",
    success: "bg-green-600 hover:bg-green-700 text-white",
    danger: "bg-danger hover:bg-red-700 text-white",
  };

  const sizeStyles = {
    small: "px-3 py-2 text-sm",
    medium: "px-5 py-2.5 text-base",
    large: "px-7 py-3 text-lg",
  };

  const classes = [
    "rounded-2xl font-medium transition-all duration-200 focus:outline-none focus:ring-2",
    variantStyles[variant],
    sizeStyles[size],
    (disabled || isLoading)
      ? "opacity-50 cursor-not-allowed"
      : "cursor-pointer hover:shadow-md",
    fullWidth ? "w-full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? loadingText : children}
    </button>
  );
}
