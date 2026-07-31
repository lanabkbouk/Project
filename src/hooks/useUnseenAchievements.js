
// بيتحقق بس (بدون ما يعلّم أي شي كـ"مشاهد") إذا عند المتطوع إنجاز
// مفتوح لسا ما زاره — يُستخدم لعرض نقطة حمراء بسيطة على رابط البروفايل
// بالـ Navbar. التعليم الفعلي كـ"مشاهد" بيصير حصرًا لما يفتح صفحة
// البروفايل فعليًا (AchievementsList.jsx)، عشان النقطة ما تختفي قبل ما
// يشوف حركة الاحتفال بنفسه.
//
// بيعيد التحقق كل ما تغيّر المسار (تنقّل المتطوع بالموقع)، عشان النقطة
// تختفي بسرعة معقولة بعد ما يزور بروفايله، بدون الحاجة لأي Context
// إضافي أو Polling مستمر.

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ACCOUNT_TYPES } from "../constants/auth/accountTypes";
import { fetchVolunteerAchievements } from "../services/achievements";
import { getSeenAchievementIds } from "../utils/achievementSeenTracker";

export default function useUnseenAchievements() {
  const { isAuthenticated, accountType } = useAuth();
  const location = useLocation();
  const isVolunteer = isAuthenticated && accountType === ACCOUNT_TYPES.VOLUNTEER;
  const [hasUnseen, setHasUnseen] = useState(false);

  useEffect(() => {
    if (!isVolunteer) return;

    let isMounted = true;

    fetchVolunteerAchievements()
      .then((achievements) => {
        if (!isMounted) return;
        const seen = getSeenAchievementIds();
        const unseenUnlocked = achievements.some(
          (item) => item.unlocked && !seen.has(item.id)
        );
        setHasUnseen(unseenUnlocked);
      })
      .catch(() => {
        if (isMounted) setHasUnseen(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isVolunteer, location.pathname]);

  return isVolunteer && hasUnseen;
}