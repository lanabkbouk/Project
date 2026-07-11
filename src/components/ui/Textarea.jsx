export default function Textarea({
  label = "",
  value,
  onChange,
  placeholder = "",
  rows = 5,
  fullWidth = true,
  disabled = false,
  error = "",
  required = false,
  className = "",
  ...props
}) {
  return (
    <div className={`flex flex-col gap-2 ${fullWidth ? "w-full" : ""}`}>
      
      {/* Label */}
      {label && (
        <label className="text-heading font-medium text-[15px]">
          {label}
          {required && <span className="text-primary ml-1">*</span>}
        </label>
      )}

      {/* Textarea */}
      <textarea
        value={value}
        onChange={onChange}
        rows={rows}
        placeholder={placeholder}
        disabled={disabled}
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
        {...props}
      />

      {/* Error */}
      {error && (
        <p className="text-danger text-sm">
          {error}
        </p>
      )}
    </div>
  );
}
