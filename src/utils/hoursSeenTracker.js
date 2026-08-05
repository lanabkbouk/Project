// نقطة واحدة لتتبّع آخر قيمة "ساعات مؤكدة" (hoursLogged) شافها المتطوع
// لكل مشاركة، عبر localStorage. نفس فلسفة achievementSeenTracker.js
// بالضبط، بس بدل Set من الـ id فقط، خزّنا id→hoursLogged (Map) حتى لو
// المنظمة عدّلت الرقم مرة تانية بعد ما المتطوع شافه أول مرة، يرجع
// يظهر كـ"جديد" (تغيّر فعلي بالقيمة، مش بس أول ظهور لها).

const SEEN_KEY = "participations:seenHoursLogged";

export function getSeenHoursMap() {
  try {
    const raw = localStorage.getItem(SEEN_KEY);
    return raw ? new Map(Object.entries(JSON.parse(raw))) : new Map();
  } catch {
    return new Map();
  }
}

export function markHoursSeen(participationId, hoursLogged) {
  const current = getSeenHoursMap();
  current.set(participationId, hoursLogged);

  try {
    localStorage.setItem(SEEN_KEY, JSON.stringify(Object.fromEntries(current)));
  } catch {
    // تجاهل أي خطأ تخزين (وضع التصفح الخاص، أو تجاوز الحصة المسموحة)
  }
}