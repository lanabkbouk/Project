import { useEffect, useState } from "react";
import { AlertCircle, Trophy } from "lucide-react";
import { fetchVolunteerAchievements } from "../../services/achievements";
import AchievementCard from "./AchievementCard";
import Skeleton from "../ui/Skeleton";
import EmptyState from "../common/EmptyState";
import Typography from "../ui/Typography";
import { CARD_SURFACE, CARD_PADDING } from "../../utils/surfaceStyles";
import { getSeenAchievementIds, markAchievementIdsSeen } from "../../utils/achievementSeenTracker";

export default function AchievementsList() {
  const [achievements, setAchievements] = useState([]);
  const [justUnlockedIds, setJustUnlockedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // بتزيد بكل ضغطة "Try again" — بيعيد تشغيل الـ effect تحتها لإعادة الجلب
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let isMounted = true;
    let markSeenTimeout;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const data = await fetchVolunteerAchievements();
        if (!isMounted) return;

        const seen = getSeenAchievementIds();
        const unlockedIds = data.filter((item) => item.unlocked).map((item) => item.id);
        const newlyUnlocked = new Set(unlockedIds.filter((id) => !seen.has(id)));

        setJustUnlockedIds(newlyUnlocked);
        setAchievements(data);

        // ⚠️ تأجيل التعليم كـ"مشاهد" — لو علّمناه فورًا هون (كان الكود
        // القديم)، أي زيارة لصفحة البروفايل بتلغي التنبيه بالجرس على
        // طول، حتى لو المستخدم أصلاً ما شاف الجرس أو الحركة بعد. منستنى
        // 4 ثواني (وقت كافي لحركة الاحتفال + يلاحظها المستخدم فعليًا)
        // قبل ما نعتبره "مشاهد" نهائيًا
        markSeenTimeout = setTimeout(() => {
          markAchievementIdsSeen(new Set([...seen, ...unlockedIds]));
        }, 4000);
      } catch (err) {
        if (isMounted) setError(err.message || "Failed to load achievements");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();
    return () => {
      isMounted = false;
      clearTimeout(markSeenTimeout);
    };
  }, [retryCount]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className={`${CARD_SURFACE} ${CARD_PADDING} flex flex-col gap-4`}>
            <div className="flex items-start justify-between gap-3">
              <Skeleton className="h-12 w-12 rounded-xl" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <div className="flex flex-col gap-2">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
            <Skeleton className="h-1.5 w-full rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="Couldn't load your achievements"
        description={error}
        actionLabel="Try again"
        onAction={() => setRetryCount((count) => count + 1)}
      />
    );
  }

  if (achievements.length === 0) {
    return (
      <EmptyState
        icon={Trophy}
        title="No achievements yet"
        description="Start volunteering to earn your first badge!"
      />
    );
  }

  const unlockedCount = achievements.filter((item) => item.unlocked).length;

  return (
    <div className="flex flex-col gap-5">
      <Typography variant="bodySm" className="font-medium text-heading/50">
        {unlockedCount} of {achievements.length} unlocked
      </Typography>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {achievements.map((item) => (
          <AchievementCard
            key={item.id}
            achievement={item}
            justUnlocked={justUnlockedIds.has(item.id)}
          />
        ))}
      </div>
    </div>
  );
}
