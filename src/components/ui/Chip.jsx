const COLOR_STYLES = {
  primary: "bg-primary/10 text-primary border-primary/20",
  gold: "bg-amber-100 text-amber-800 border-amber-200",
  silver: "bg-slate-200 text-slate-700 border-slate-300",
  bronze: "bg-orange-100 text-orange-800 border-orange-200",
  blue: "bg-blue-100 text-blue-700 border-blue-200",
  purple: "bg-purple-100 text-purple-700 border-purple-200",
  green: "bg-emerald-100 text-emerald-700 border-emerald-200",
  pink: "bg-pink-100 text-pink-700 border-pink-200",
};

export default function Chip({ children, color = "primary", className = "", customStyle = "" }) {
  const styles = customStyle || COLOR_STYLES[color] || COLOR_STYLES.primary;

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-sm border font-medium ${styles} ${className}`}
    >
      {children}
    </span>
  );
}