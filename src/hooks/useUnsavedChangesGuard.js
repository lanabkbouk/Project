
// يحجز أي محاولة تنقّل حقيقي داخل التطبيق (روابط، زر رجوع المتصفح) لما
// fشرط shouldBlock صحيح — يعتمد على useBlocker من react-router-dom،
// يلي يتطلب Data Router (راجع App.jsx). بالإضافة، يضيف تحذير المتصفح
// الأصلي (beforeunload) لتغطية إغلاق التاب أو تحديث الصفحة، لأن
// useBlocker وحده ما بيغطي هالحالة.

import { useEffect } from "react";
import { useBlocker } from "react-router-dom";

export default function useUnsavedChangesGuard(shouldBlock) {
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      shouldBlock && currentLocation.pathname !== nextLocation.pathname,
  );

  useEffect(() => {
    function handleBeforeUnload(event) {
      if (!shouldBlock) return;
      event.preventDefault();
      // بعض المتصفحات القديمة تتطلب تعيين returnValue صراحة
      event.returnValue = "";
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [shouldBlock]);

  return blocker;
}