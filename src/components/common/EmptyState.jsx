// components/common/EmptyState.jsx
//
// حالة فارغة موحّدة تُستخدم بكل الصفحات (بدل ما كل صفحة تبني حالتها
// الفارغة يدويًا لحالها). الشكل: أيقونة + عنوان + وصف + زر إجراء بارز
// (اختياري) — نفس النمط المتعارف عليه عالميًا بمعظم المواقع والتطبيقات
// (GitHub, Notion, Linear...) لتشجيع المستخدم يتخذ الخطوة التالية بدل
// ما يوقف عند "ما في شي هون".

import Button from "../ui/Button";

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}) {
  return (
    <div className="flex flex-col items-center text-center gap-5 py-20 px-6">
      
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-heading/5 flex items-center justify-center shadow-sm">
          <Icon size={28} className="text-heading/70" />
        </div>
      )}

      <h3 className="font-semibold text-heading text-lg">{title}</h3>

      {description && (
        <p className="text-sm text-body max-w-sm leading-relaxed">
          {description}
        </p>
      )}

      {actionLabel && onAction && (
        <Button variant="primary" size="medium" onClick={onAction} className="mt-1">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}