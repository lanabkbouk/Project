
// نافذة منبثقة عامة قابلة لإعادة الاستخدام (ما كانت موجودة إطلاقًا
// بالمشروع). تُغلق بـ Escape أو الضغط خارجها، وتاخد الفوكس تلقائيًا
// عند الفتح لدعم قارئات الشاشة والتنقّل بالكيبورد.

import { useEffect, useRef } from "react";
import Typography from "./Typography";

export default function Modal({ open, onClose, title, children, footer }) {
  const dialogRef = useRef(null);

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

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div aria-hidden="true" className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
        tabIndex={-1}
        className="animate-shell-in relative w-full max-w-md rounded-2xl border border-heading/10 bg-field p-6 shadow-2xl focus:outline-none"
      >
        {title && (
          <Typography id="modal-title" variant="h4" gutterBottom>
            {title}
          </Typography>
        )}

        <div className="text-sm text-body leading-relaxed">{children}</div>

        {footer && <div className="mt-6 flex flex-wrap justify-end gap-3">{footer}</div>}
      </div>
    </div>
  );
}