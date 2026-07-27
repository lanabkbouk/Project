export default function Button({
  variant = "primary",
  size = "medium",
  children,
  onClick,
  disabled = false,
  fullWidth = false,
  className = "",
  type = "button",
  isLoading = false,
  loadingText = "Saving...",
  ...props
}) {
  const variantStyles = {
    primary: "bg-primary text-bg hover:bg-primary/90",
    secondary: "bg-secondary text-bg hover:bg-secondary/90",
    ghost: "bg-bg border border-heading/20 text-heading hover:bg-heading/5",
    success: "bg-green-600 text-white hover:bg-green-700",
    danger: "bg-danger text-white hover:bg-dangerHover",
  };

  const sizeStyles = {
    small: "px-3 py-2 text-sm",
    medium: "px-5 py-2.5 text-base",
    large: "px-7 py-3 text-lg",
  };

  const classes = [
    "rounded-xl font-medium transition-all duration-200",
    "focus:outline-none focus:ring-2 focus:ring-primary/40",
    variantStyles[variant],
    sizeStyles[size],
    (disabled || isLoading)
      ? "opacity-60 cursor-not-allowed"
      : "cursor-pointer hover:shadow-sm",
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
