// src/components/volunteerProfile/AchievementCard.jsx
import { Lock } from "lucide-react";
import Typography from "../ui/Typography";
import { getAchievementStyle } from "../../utils/achievementStyles";

function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function AchievementCard({ achievement }) {
  const isUnlocked = Boolean(achievement.unlocked);
  // كل إنجاز ياخد لونه وأيقونته الخاصة حسب نوعه
  const { icon: Icon, colorClasses } = getAchievementStyle(achievement.name);

  return (
    <div
      className={`
        relative rounded-2xl p-5 flex flex-col gap-3
        bg-field border shadow-sm transition-all duration-300
        ${isUnlocked ? "border-heading/10 hover:shadow-lg hover:-translate-y-1" : "border-heading/10 grayscale opacity-70"}
      `}
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses}`}>
        {isUnlocked ? <Icon size={22} aria-hidden="true" /> : <Lock size={20} aria-hidden="true" />}
      </div>

      <Typography variant="h6" as="h3" className="text-heading font-semibold">
        {achievement.name}
      </Typography>

      {achievement.description ? (
        <Typography variant="bodySm" className="text-heading/70 leading-relaxed">
          {achievement.description}
        </Typography>
      ) : null}

      <div className="mt-auto flex items-center justify-end pt-3">
        <span className="text-xs text-heading/40 flex items-center gap-1">
          {isUnlocked ? (
            formatDate(achievement.earnedDate)
          ) : (
            <>
              <Lock size={12} aria-hidden="true" /> Locked
            </>
          )}
        </span>
      </div>
    </div>
  );
}