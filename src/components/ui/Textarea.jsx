export default function Textarea({
  label = "",
  name,
  register,
  registerOptions,
  placeholder = "",
  rows = 5,
  fullWidth = true,
  disabled = false,
  error = "",
  required = false,
  className = "",
  ...props
}) {
  const registerProps = register ? register(name, registerOptions) : {};

  return (
    <div className={`flex flex-col gap-2 ${fullWidth ? "w-full" : ""}`}>
      {label && (
        <label htmlFor={name} className="text-heading font-medium text-[15px]">
          {label}
          {required && <span className="text-primary ml-1">*</span>}
        </label>
      )}

      <textarea
        id={name}
        name={name}
        rows={rows}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
        className={`
          px-4 py-3
          rounded-lg
          border
          bg-bg
          text-body
          placeholder:text-body/60
          outline-none
          resize-none
          transition-all duration-200

          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-text"}

          ${
            error
              ? "border-danger focus:border-danger"
              : "border-heading/15 focus:border-primary"
          }

          ${className}
        `}
        {...registerProps}
        {...props}
      />

      {error && (
        <p id={`${name}-error`} className="text-danger text-sm">
          {error}
        </p>
      )}
    </div>
  );
}