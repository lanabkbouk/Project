import { useEffect, useState } from "react";
import { fetchVolunteerAchievements } from "../../services/achievements";
import AchievementCard from "./AchievementCard";
import Skeleton from "../ui/Skeleton";
import { CARD_SURFACE, CARD_PADDING } from "../../utils/surfaceStyles";
import { getSeenAchievementIds, markAchievementIdsSeen } from "../../utils/achievementSeenTracker";

export default function AchievementsList() {
  const [achievements, setAchievements] = useState([]);
  const [justUnlockedIds, setJustUnlockedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    let markSeenTimeout;

    async function load() {
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
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className={`${CARD_SURFACE} ${CARD_PADDING} flex flex-col gap-3`}>
            <Skeleton className="w-12 h-12 rounded-xl" />
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-sm text-danger">{error}</p>;
  }

  if (achievements.length === 0) {
    return (
      <p className="text-sm text-heading/50">
        No achievements yet. Start volunteering to earn your first badge!
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {achievements.map((item) => (
        <AchievementCard
          key={item.id}
          achievement={item}
          justUnlocked={justUnlockedIds.has(item.id)}
        />
      ))}
    </div>
  );
}