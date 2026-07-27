import Typography from "./Typography";

export default function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between items-center py-1 gap-3">
      <Typography
        variant="bodySm"
        color="muted"
        className="whitespace-nowrap"
      >
        {label}
      </Typography>

      <Typography
        variant="bodySm"
        color="heading"
        weight="medium"
        className="truncate text-left"
      >
        {value || "—"}
      </Typography>
    </div>
  );
}
