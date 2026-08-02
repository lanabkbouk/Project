
// يلف كامل التطبيق (بـ main.jsx) — إذا صار خطأ JS غير متوقع بأي Component
// جوا الشجرة (استثناء بالـ render، مو استدعاء API فاشل يلي متله متل عنده
// معالجة خاصة فيه بكل صفحة أصلًا)، بدل ما تنهار الصفحة كاملة وتصير بيضاء
// بدون أي رسالة، نعرض واجهة بديلة بنفس هوية الموقع مع خيار تحديث الصفحة.
//
// لازم Class Component هون تحديدًا (مو hook) — React لسا ما وفّر بديل
// Hook لـ componentDidCatch/getDerivedStateFromError حتى اللحظة.
//
// ملاحظة: هاي طبقة الحماية على مستوى كل التطبيق. الأخطاء المتوقعة (فشل
// طلب API مثلًا) تنعالج محليًا بكل صفحة عبر isError/error من react-query،
// وما توصل لهون أصلًا.

import { Component } from "react";
import { AlertTriangle } from "lucide-react";
import Typography from "../ui/Typography";
import Button from "../ui/Button";

export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // نكتفي بتسجيلها بالـ console حاليًا؛ نقطة واحدة مركزية لو حبينا
    // مستقبلًا نبعتها لخدمة رصد أخطاء (Sentry أو ما شابه) بدون ما نلمس
    // أي مكان تاني بالتطبيق.
    console.error("Unhandled application error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.assign("/");
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center gap-6 px-4 text-center sm:px-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-danger/10">
          <AlertTriangle size={30} className="text-danger" aria-hidden="true" />
        </div>

        <Typography variant="overline" color="danger">
          Something went wrong
        </Typography>

        <Typography variant="h1">This page hit an unexpected error</Typography>

        <Typography variant="lead" className="max-w-md text-body">
          Sorry about that. Try reloading the page — if the problem keeps
          happening, please try again later.
        </Typography>

        <Button variant="primary" size="large" onClick={this.handleReload} className="mt-2">
          Reload Page
        </Button>
      </div>
    );
  }
}