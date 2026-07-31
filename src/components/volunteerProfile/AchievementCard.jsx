// src/components/volunteerProfile/AchievementCard.jsx
import { Lock } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import Typography from "../ui/Typography";
import { getAchievementStyle } from "../../utils/achievementStyles";
import { CARD_SURFACE, CARD_ELEVATION, CARD_PADDING } from "../../utils/surfaceStyles";

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

// justUnlocked: true بس أول مرة يشوف فيها المتطوع هالإنجاز مفتوح (تتحكم
// فيها AchievementsList عبر localStorage) — بعدها بيصير إنجاز عادي بدون
// إعادة تشغيل الحركة بكل زيارة، بنفس منطق أي منصة إنجازات عالمية.
export default function AchievementCard({ achievement, justUnlocked = false }) {
  const isUnlocked = Boolean(achievement.unlocked);
  // كل إنجاز ياخد لونه وأيقونته الخاصة حسب نوعه
  const { icon: Icon, colorClasses } = getAchievementStyle(achievement.name);
  const prefersReducedMotion = useReducedMotion();
  const shouldCelebrate = isUnlocked && justUnlocked && !prefersReducedMotion;

  return (
    <motion.div
      initial={shouldCelebrate ? { scale: 0.85, opacity: 0 } : false}
      animate={shouldCelebrate ? { scale: 1, opacity: 1 } : false}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      className={[
        "relative flex flex-col gap-3 overflow-hidden",
        CARD_SURFACE,
        CARD_PADDING,
        // الإنجاز المقفول ما بياخد أي تأثير Hover — مو تفاعلي فعليًا
        isUnlocked ? CARD_ELEVATION : "grayscale opacity-70",
        shouldCelebrate ? "animate-unlock-glow" : "",
      ].join(" ")}
    >
      {/* لمعة تعبر البطاقة مرة وحدة لحظة الفتح — تأثير "Shine Sweep" */}
      {shouldCelebrate && (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
          initial={{ x: "-120%" }}
          animate={{ x: "220%" }}
          transition={{ duration: 0.9, delay: 0.15, ease: "easeOut" }}
        />
      )}

      <motion.div
        initial={shouldCelebrate ? { scale: 0, rotate: -20 } : false}
        animate={shouldCelebrate ? { scale: 1, rotate: 0 } : false}
        transition={{ type: "spring", stiffness: 300, damping: 14, delay: 0.05 }}
        className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses}`}
      >
        {isUnlocked ? <Icon size={22} aria-hidden="true" /> : <Lock size={20} aria-hidden="true" />}
      </motion.div>

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
    </motion.div>
  );
}