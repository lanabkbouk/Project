// مركز إشعارات مصغّر — فحص دوري (Polling) + عند كل تنقّل بالموقع (نفس
// فلسفة useUnseenAchievements وuseUnseenHoursConfirmation، بس مجمّعين
// هون بمكان واحد بدل نقطة حمراء صامتة). كل عنصر برجع منه اسم/سبب/رابط،
// حتى الـ Dropdown بالنافبار يقدر يعرضهم كقائمة صغيرة بدل بس نقطة بدون تفسير.
//
// منطق "جلب وتجميع" البيانات صار بالكامل جوا services/notifications.js
// (مو هون) — الـ Hook مسؤول بس عن: التوقيت (polling)، وتيرة إعادة الفحص
// عند تغيير الصفحة، وربط الحالة بالـ Navbar. هيك لما يجهز endpoint
// التنبيهات الحقيقي بالباك اند، التعديل بيصير بملف الخدمة فقط، وهاد
// الملف ما بيلزمه أي تغيير إطلاقًا.

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ACCOUNT_TYPES } from "../constants/auth/accountTypes";
import { fetchRecentNotifications } from "../services/notifications";

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
      fetchRecentNotifications()
        .then((nextItems) => {
          if (isMounted) setItems(nextItems);
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