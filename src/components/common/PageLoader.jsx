// components/common/PageLoader.jsx
//
// حالة التحميل الظاهرة أثناء تنزيل كود أي صفحة lazy (React.lazy) —
// نفس فلسفة Skeleton (صندوق نابض بدل Spinner بنص الشاشة يعمل قفزة
// بصرية)، بس بحجم يغطي كامل منطقة المحتوى لأنه ما في شكل صفحة محدد
// نعرف نقلّده مسبقًا (كل صفحة شكلها مختلف).

import Skeleton from "../ui/Skeleton";

export default function PageLoader() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    </div>
  );
}