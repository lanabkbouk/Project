// نافذة منبثقة عامة قابلة لإعادة الاستخدام (ما كانت موجودة إطلاقًا
// بالمشروع). تُغلق بـ Escape أو الضغط خارجها، وتاخد الفوكس تلقائيًا
// عند الفتح لدعم قارئات الشاشة والتنقّل بالكيبورد.
//
// ملاحظة مهمة: نرندرها عبر createPortal مباشرة جوا document.body.
// السبب: كل الصفحات ملفوفة بـ motion.div (framer-motion) بـ MainLayout،
// وFramer Motion بيطبّق CSS transform عليه — وأي transform على عنصر أب
// بيصير containing block جديد لأي عنصر جواه بـ position:fixed، فهيك
// الـ Modal كان بيتموضع نسبة لصفحة الـ motion.div (وينقص أو يطلع
// بمكان غلط) بدل الشاشة كاملة. الـ Portal بيطلع الـ Modal برّا هالشجرة
// تمامًا، فـ position:fixed بيرجع يشتغل نسبة للـ viewport متل ما لازم.

import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import Typography from "./Typography";

export default function Modal({ open, onClose, title, children, footer, dialogClassName = "max-w-md" }) {
  const dialogRef = useRef(null);
  const generatedTitleId = useId();
  const titleId = title ? generatedTitleId : undefined;

  useEffect(() => {
    if (!open) return undefined;

    function handleKeyDown(event) {
      if (event.key === "Escape") onClose?.();
    }

    document.addEventListener("keydown", handleKeyDown);
    dialogRef.current?.focus();

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div aria-hidden="true" className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={`animate-shell-in relative w-full rounded-2xl border border-heading/10 bg-field p-6 shadow-2xl focus:outline-none ${dialogClassName}`}
      >
        {title && (
          <Typography id={titleId} variant="h4" gutterBottom>
            {title}
          </Typography>
        )}

        <div className="text-sm text-body leading-relaxed">{children}</div>

        {footer && <div className="mt-6 flex flex-wrap justify-end gap-3">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}