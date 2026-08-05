// نسخة مصغّرة من "مركز إشعارات" — بدون أي باك اند حقيقي، بس فحص محلي
// دوري (Polling) + عند كل تنقّل بالموقع (نفس فلسفة useUnseenAchievements
// وuseUnseenHoursConfirmation بالضبط، بس مجمّعين هون بمكان واحد بدل
// نقطة حمراء صامتة). كل عنصر برجع منه اسم/سبب/رابط، حتى الـ Dropdown
// بالنافبار يقدر يعرضهم كقائمة صغيرة بدل بس نقطة بدون تفسير.
//
// لما يجهز مركز الإشعارات الحقيقي بالباك اند لاحقًا، هالهوك بيصير أسهل
// نقطة نستبدلها — الـ Navbar ما بيهمه مصدر البيانات، بس شكل items[].

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ACCOUNT_TYPES } from "../constants/auth/accountTypes";
import { fetchVolunteerAchievements } from "../services/achievements";
import { fetchMyParticipations } from "../services/participations";
import { getSeenAchievementIds } from "../utils/achievementSeenTracker";
import { getSeenHoursMap } from "../utils/hoursSeenTracker";
import { getSeenStatusMap } from "../utils/participationStatusSeenTracker";
import { PARTICIPATION_STATUS } from "../constants/participationStatus";
import { ROUTES } from "../constants/paths";

// كل 5 ثواني — كافي لتجربة سلسة بدون ما نضرب الأداء، وبنفس الوقت مش
// معتمدين بس على تغيير الصفحة (اللي كان السبب الحقيقي وراء المشكلة:
// المتطوع يمنح إنجاز وهمي ويضل بنفس الصفحة، فما كان في أي محفّز لإعادة
// الفحص إطلاقًا لحد ما يتنقّل لصفحة تانية)
const POLL_INTERVAL_MS = 5000;

export default function useRecentUpdates() {
  const { isAuthenticated, accountType } = useAuth();
  const location = useLocation();
  const isVolunteer = isAuthenticated && accountType === ACCOUNT_TYPES.VOLUNTEER;
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!isVolunteer) return undefined;

    let isMounted = true;

    function checkForUpdates() {
      Promise.all([fetchVolunteerAchievements(), fetchMyParticipations()])
        .then(([achievements, participations]) => {
          if (!isMounted) return;

          const seenAchievements = getSeenAchievementIds();
          const seenHours = getSeenHoursMap();
          const seenStatus = getSeenStatusMap();
          const nextItems = [];

          achievements.forEach((achievement) => {
            if (!achievement.unlocked || seenAchievements.has(achievement.id)) return;
            nextItems.push({
              id: `achievement:${achievement.id}`,
              type: "achievement",
              title: "New achievement unlocked",
              description: achievement.name,
              // #achievements يمرّر تلقائيًا لقسم الإنجازات مباشرة (راجع
              // useEffect بـ volunteerProfile.jsx) — بدل ما يوصل أعلى
              // الصفحة ويدوّر عليه يدويًا
              href: `${ROUTES.VOLUNTEER_PROFILE}#achievements`,
            });
          });

          participations.forEach((participation) => {
            const opportunityTitle = participation.opportunity?.title || "an opportunity";

            if (
              participation.hoursLogged !== null &&
              participation.hoursLogged !== undefined &&
              Number(seenHours.get(participation.id)) !== Number(participation.hoursLogged)
            ) {
              nextItems.push({
                id: `hours:${participation.id}`,
                type: "hours",
                title: "Hours confirmed",
                description: `${opportunityTitle}: ${participation.hoursLogged} hrs`,
                href: ROUTES.MY_VOLUNTEERING,
              });
            }

            const isDecided =
              participation.status === PARTICIPATION_STATUS.ACCEPTED ||
              participation.status === PARTICIPATION_STATUS.REJECTED;

            if (isDecided && seenStatus.get(participation.id) !== participation.status) {
              nextItems.push({
                id: `status:${participation.id}`,
                type:
                  participation.status === PARTICIPATION_STATUS.ACCEPTED
                    ? "status-accepted"
                    : "status-rejected",
                title:
                  participation.status === PARTICIPATION_STATUS.ACCEPTED
                    ? "Your request was accepted"
                    : "Your request was declined",
                description: opportunityTitle,
                href: ROUTES.MY_VOLUNTEERING,
              });
            }
          });

          setItems(nextItems);
        })
        .catch(() => {
          if (isMounted) setItems([]);
        });
    }

    checkForUpdates();
    const intervalId = setInterval(checkForUpdates, POLL_INTERVAL_MS);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [isVolunteer, location.pathname]);

  return { items: isVolunteer ? items : [], hasUnseen: isVolunteer && items.length > 0 };
}