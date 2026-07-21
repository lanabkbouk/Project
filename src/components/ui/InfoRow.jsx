export default function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between items-center py-1 gap-3">
      <span className="text-sm text-heading/50 whitespace-nowrap">{label}</span>
      <span className="text-sm text-heading font-medium text-left truncate">
        {value || "—"}
      </span>
    </div>
  );
}