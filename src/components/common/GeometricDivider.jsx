
// فاصل زخرفي بسيط بين أقسام الصفحة: خط رفيع + معين صغير بلون العلامة
// التجارية بالنص. Component عرض بحت بدون أي props أو منطق.

export default function GeometricDivider() {
  return (
    <div className="flex items-center justify-center gap-3 my-20" aria-hidden="true">
      <span className="h-px flex-1 max-w-xs bg-heading/10" />
      <span className="w-2.5 h-2.5 rotate-45 bg-primary rounded-[2px]" />
      <span className="h-px flex-1 max-w-xs bg-heading/10" />
    </div>
  );
}