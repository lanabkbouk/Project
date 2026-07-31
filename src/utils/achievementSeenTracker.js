// نقطة واحدة لتتبّع أي إنجازات "شافها" المتطوع مفتوحة من قبل، عبر
// localStorage. يستخدمها طرفان:
//   - AchievementsList.jsx: يقرأ ويكتب (يعلّم الإنجاز كـ"مشاهد" بعد
//     عرض حركة الاحتفال).
//   - useUnseenAchievements.js: يقرأ بس (لعرض نقطة تنبيه بالـ Navbar)
//     بدون ما يعلّم أي شي كمشاهد، عشان النقطة ما تختفي قبل ما المتطوع
//     يشوف الاحتفال فعليًا بصفحة البروفايل.

const SEEN_KEY = "achievements:celebratedIds";

export function getSeenAchievementIds() {
  try {
    const raw = localStorage.getItem(SEEN_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

export function markAchievementIdsSeen(ids) {
  try {
    localStorage.setItem(SEEN_KEY, JSON.stringify([...ids]));
  } catch {
    // تجاهل أي خطأ تخزين (وضع التصفح الخاص، أو تجاوز الحصة المسموحة)
  }
}