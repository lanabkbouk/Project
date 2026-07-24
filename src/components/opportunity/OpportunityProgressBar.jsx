export default function OpportunityProgressBar({ current, max }) {
  const safeMax = Math.max(max, 1);
  const percentage = Math.min(Math.round((current / safeMax) * 100), 100);

  return (
    <div className="flex flex-col gap-2">
      <div className="w-full h-2 rounded-full bg-heading/10 overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-heading">
          {current} / {max} volunteers joined
        </span>
        <span className="text-heading/50">{percentage}%</span>
      </div>
    </div>
  );
}